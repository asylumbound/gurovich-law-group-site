/**
 * Context Pack Builder for Terminal RAG
 * 
 * Builds a scoped data bundle for a single intake, ensuring strict data isolation.
 * The context pack is what the LLM assistant sees - it must only include data
 * from the active intake scope.
 */

import { getSupabaseAdmin } from "./supabase";
import type {
  ContextPack,
  ContextPackIntake,
  ContextPackIssueType,
  ContextPackParty,
  ContextPackNote,
  ContextPackUpload,
} from "./terminal-types";

const MAX_NOTES = 20; // Cap notes to prevent context overflow
const MAX_UPLOADS = 50; // Cap uploads metadata

/**
 * Build a context pack for a specific intake
 * This is the ONLY data the terminal assistant can access
 */
export async function buildContextPack(intakeId: number, userId: number): Promise<ContextPack> {
  const supabase = getSupabaseAdmin();
  
  // Get main intake data
  const { data: intake, error: intakeError } = await supabase
    .from("intakes")
    .select(`
      id,
      status,
      practice_area,
      issue_type_id,
      summary,
      incident_date,
      incident_city,
      incident_state,
      urgency,
      has_documents,
      first_name,
      last_name,
      phone,
      email,
      city,
      state,
      created_at,
      updated_at
    `)
    .eq("id", intakeId)
    .single();
  
  if (intakeError || !intake) {
    throw new Error(`Intake not found: ${intakeId}`);
  }
  
  // Get issue type details
  let issueType: ContextPackIssueType | null = null;
  if (intake.issue_type_id) {
    const { data: issueTypeData } = await supabase
      .from("issue_types")
      .select("id, name, description")
      .eq("id", intake.issue_type_id)
      .single();
    
    if (issueTypeData) {
      issueType = issueTypeData;
    }
  }
  
  // Get parties (scoped to intake)
  const { data: parties } = await supabase
    .from("intake_parties")
    .select("id, party_type, party_role, name, phone, email")
    .eq("intake_id", intakeId);
  
  // Get notes (scoped to intake, recent first, capped)
  const { data: notes } = await supabase
    .from("intake_notes")
    .select("id, note, created_by_name, created_at")
    .eq("intake_id", intakeId)
    .order("created_at", { ascending: false })
    .limit(MAX_NOTES);
  
  // Get uploads metadata (scoped to intake)
  const { data: uploads } = await supabase
    .from("intake_uploads")
    .select("id, file_name, file_size, mime_type, tag")
    .eq("intake_id", intakeId)
    .limit(MAX_UPLOADS);
  
  // Check which uploads have extracted text
  const uploadIds = uploads?.map(u => u.id) || [];
  let uploadsWithText: Set<number> = new Set();
  
  if (uploadIds.length > 0) {
    const { data: textData } = await supabase
      .from("upload_text")
      .select("upload_id")
      .in("upload_id", uploadIds);
    
    uploadsWithText = new Set(textData?.map(t => t.upload_id) || []);
  }
  
  // Get practice-specific details
  let practiceDetails: Record<string, unknown> | null = null;
  const detailsTableMap: Record<string, string> = {
    personal_injury: "intake_pi_details",
    criminal_defense: "intake_criminal_details",
    employment_law: "intake_employment_details",
    tenant_rights: "intake_tenant_details",
    civil_litigation: "intake_civil_details",
  };
  
  if (intake.practice_area && detailsTableMap[intake.practice_area]) {
    const { data: details } = await supabase
      .from(detailsTableMap[intake.practice_area])
      .select("*")
      .eq("intake_id", intakeId)
      .single();
    
    if (details) {
      // Remove internal fields
      const { id, intake_id, created_at, ...rest } = details;
      practiceDetails = rest;
    }
  }
  
  // Generate missing info hints
  const missingInfoHints = generateMissingInfoHints(intake, parties || [], uploads || []);
  
  return {
    intake: intake as ContextPackIntake,
    issue_type: issueType,
    parties: (parties || []) as ContextPackParty[],
    notes: (notes || []) as ContextPackNote[],
    uploads: (uploads || []).map(u => ({
      ...u,
      has_extracted_text: uploadsWithText.has(u.id),
    })) as ContextPackUpload[],
    practice_details: practiceDetails,
    missing_info_hints: missingInfoHints,
  };
}

/**
 * Generate hints about missing information in the intake
 */
function generateMissingInfoHints(
  intake: ContextPackIntake,
  parties: ContextPackParty[],
  uploads: { id: number; file_name: string; file_size: number; mime_type: string; tag: string }[]
): string[] {
  const hints: string[] = [];
  
  // Check for missing contact info
  if (!intake.phone && !intake.email) {
    hints.push("No contact information (phone or email) provided");
  }
  
  // Check for missing incident details
  if (!intake.incident_date) {
    hints.push("Incident date not specified");
  }
  
  if (!intake.incident_city || !intake.incident_state) {
    hints.push("Incident location not fully specified");
  }
  
  // Check for missing summary
  if (!intake.summary || intake.summary.length < 50) {
    hints.push("Case summary is brief or missing");
  }
  
  // Check for parties
  if (parties.length === 0) {
    hints.push("No opposing parties or witnesses identified");
  }
  
  // Check for documents
  if (intake.has_documents && uploads.length === 0) {
    hints.push("Client indicated documents exist but none uploaded");
  }
  
  return hints;
}

/**
 * Format context pack as a string for LLM system prompt
 */
export function formatContextPackForLLM(pack: ContextPack): string {
  const sections: string[] = [];
  
  // Intake summary
  sections.push(`## ACTIVE MATTER (Intake #${pack.intake.id})`);
  sections.push(`Status: ${pack.intake.status}`);
  sections.push(`Practice Area: ${pack.intake.practice_area || 'Not specified'}`);
  sections.push(`Issue Type: ${pack.issue_type?.name || 'Not specified'}`);
  sections.push(`Urgency: ${pack.intake.urgency || 'Not specified'}`);
  sections.push(`Client: ${pack.intake.first_name || ''} ${pack.intake.last_name || ''}`);
  sections.push(`Location: ${pack.intake.city || ''}, ${pack.intake.state || ''}`);
  sections.push(`Incident Date: ${pack.intake.incident_date || 'Unknown'}`);
  sections.push(`Incident Location: ${pack.intake.incident_city || ''}, ${pack.intake.incident_state || ''}`);
  
  // Summary
  if (pack.intake.summary) {
    sections.push(`\n### Case Summary\n${pack.intake.summary}`);
  }
  
  // Practice-specific details
  if (pack.practice_details) {
    sections.push(`\n### Practice-Specific Details`);
    for (const [key, value] of Object.entries(pack.practice_details)) {
      if (value !== null && value !== undefined) {
        const formattedKey = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        sections.push(`- ${formattedKey}: ${Array.isArray(value) ? value.join(', ') : value}`);
      }
    }
  }
  
  // Parties
  if (pack.parties.length > 0) {
    sections.push(`\n### Involved Parties`);
    for (const party of pack.parties) {
      sections.push(`- [${party.party_role}] ${party.name || 'Unknown'} (${party.party_type})`);
    }
  }
  
  // Notes
  if (pack.notes.length > 0) {
    sections.push(`\n### Internal Notes (${pack.notes.length} most recent)`);
    for (const note of pack.notes.slice(0, 5)) {
      const date = new Date(note.created_at).toLocaleDateString();
      sections.push(`- [${date}] ${note.created_by_name || 'Staff'}: ${note.note.substring(0, 200)}${note.note.length > 200 ? '...' : ''}`);
    }
  }
  
  // Uploads
  if (pack.uploads.length > 0) {
    sections.push(`\n### Documents (${pack.uploads.length} files)`);
    for (const upload of pack.uploads) {
      const textStatus = upload.has_extracted_text ? '✓ text extracted' : '○ no text';
      sections.push(`- [${upload.tag}] ${upload.file_name} (${textStatus})`);
    }
  }
  
  // Missing info hints
  if (pack.missing_info_hints.length > 0) {
    sections.push(`\n### Missing Information`);
    for (const hint of pack.missing_info_hints) {
      sections.push(`⚠ ${hint}`);
    }
  }
  
  return sections.join('\n');
}

/**
 * Verify user has access to intake
 * Returns true if user is admin or has explicit access
 */
export async function verifyIntakeAccess(intakeId: number, userId: number, userRole: string): Promise<boolean> {
  // Admins have access to all intakes
  if (userRole === 'admin') {
    return true;
  }
  
  const supabase = getSupabaseAdmin();
  
  // Check intake_access table
  const { data: access } = await supabase
    .from("intake_access")
    .select("id")
    .eq("intake_id", intakeId)
    .eq("user_id", userId)
    .single();
  
  return !!access;
}
