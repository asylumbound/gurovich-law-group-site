import { z } from "zod";
import { publicProcedure, router } from "./_core/trpc";
import { getSupabaseAdmin } from "./supabase";
import { nanoid } from "nanoid";
import {
  step0Schema,
  step1Schema,
  step2Schema,
  step3Schema,
  step4PISchema,
  step4CriminalSchema,
  step4EmploymentSchema,
  step4TenantSchema,
  step4CivilSchema,
  partySchema,
  practiceAreaSchema,
} from "../shared/onboard-validation";

export const onboardRouter = router({
  // Get issue types by practice area
  getIssueTypes: publicProcedure
    .input(z.object({ practice_area: practiceAreaSchema }))
    .query(async ({ input }) => {
      const supabase = getSupabaseAdmin();
      const { data, error } = await supabase
        .from("issue_types")
        .select("*")
        .eq("practice_area", input.practice_area)
        .order("name");

      if (error) throw new Error(error.message);
      return data;
    }),

  // Create a new draft intake
  createDraft: publicProcedure
    .input(step0Schema)
    .mutation(async ({ input }) => {
      const supabase = getSupabaseAdmin();
      const draftToken = nanoid(32);

      const { data, error } = await supabase
        .from("intakes")
        .insert({
          draft_token: draftToken,
          status: "draft",
          consent_no_attorney_relationship: input.consent_no_attorney_relationship,
          consent_contact: input.consent_contact,
          preferred_contact_method: input.preferred_contact_method,
          preferred_language: input.preferred_language,
        })
        .select()
        .single();

      if (error) throw new Error(error.message);
      return { intake: data, draftToken };
    }),

  // Get intake by draft token
  getByToken: publicProcedure
    .input(z.object({ draftToken: z.string() }))
    .query(async ({ input }) => {
      const supabase = getSupabaseAdmin();
      
      const { data: intake, error } = await supabase
        .from("intakes")
        .select("*")
        .eq("draft_token", input.draftToken)
        .single();

      if (error) throw new Error(error.message);

      // Get parties
      const { data: parties } = await supabase
        .from("intake_parties")
        .select("*")
        .eq("intake_id", intake.id);

      // Get uploads
      const { data: uploads } = await supabase
        .from("intake_uploads")
        .select("*")
        .eq("intake_id", intake.id);

      // Get practice-specific details if applicable
      let practiceDetails = null;
      if (intake.practice_area) {
        const detailsTable = getDetailsTable(intake.practice_area);
        if (detailsTable) {
          const { data } = await supabase
            .from(detailsTable)
            .select("*")
            .eq("intake_id", intake.id)
            .single();
          practiceDetails = data;
        }
      }

      return { intake, parties: parties || [], uploads: uploads || [], practiceDetails };
    }),

  // Update Step 1: Contact Basics
  updateStep1: publicProcedure
    .input(z.object({
      draftToken: z.string(),
      data: step1Schema,
    }))
    .mutation(async ({ input }) => {
      const supabase = getSupabaseAdmin();
      
      const { error } = await supabase
        .from("intakes")
        .update({
          first_name: input.data.first_name,
          last_name: input.data.last_name,
          phone: input.data.phone || null,
          email: input.data.email || null,
          city: input.data.city || null,
          state: input.data.state,
          best_time_to_contact: input.data.best_time_to_contact || null,
          is_affected_person: input.data.is_affected_person,
          relationship_to_affected: input.data.is_affected_person ? null : input.data.relationship_to_affected,
        })
        .eq("draft_token", input.draftToken);

      if (error) throw new Error(error.message);
      return { success: true };
    }),

  // Update Step 2: Matter Selection
  updateStep2: publicProcedure
    .input(z.object({
      draftToken: z.string(),
      data: step2Schema,
    }))
    .mutation(async ({ input }) => {
      const supabase = getSupabaseAdmin();
      
      const { error } = await supabase
        .from("intakes")
        .update({
          practice_area: input.data.practice_area,
          issue_type_id: input.data.issue_type_id,
          urgency: input.data.urgency,
          summary: input.data.summary,
        })
        .eq("draft_token", input.draftToken);

      if (error) throw new Error(error.message);
      return { success: true };
    }),

  // Update Step 3: Core Facts
  updateStep3: publicProcedure
    .input(z.object({
      draftToken: z.string(),
      data: step3Schema,
    }))
    .mutation(async ({ input }) => {
      const supabase = getSupabaseAdmin();
      
      // Get intake ID first
      const { data: intake, error: fetchError } = await supabase
        .from("intakes")
        .select("id")
        .eq("draft_token", input.draftToken)
        .single();

      if (fetchError) throw new Error(fetchError.message);

      // Update main intake
      const { error } = await supabase
        .from("intakes")
        .update({
          incident_date: input.data.incident_date || null,
          incident_date_unknown: input.data.incident_date_unknown,
          incident_city: input.data.incident_city || null,
          incident_state: input.data.incident_state || null,
          agency_involved: input.data.agency_involved,
          agency_name: input.data.agency_involved ? input.data.agency_name : null,
          report_number: input.data.agency_involved ? input.data.report_number : null,
          has_documents: input.data.has_documents,
        })
        .eq("draft_token", input.draftToken);

      if (error) throw new Error(error.message);

      // Update parties - delete existing and insert new
      if (input.data.parties && input.data.parties.length > 0) {
        await supabase
          .from("intake_parties")
          .delete()
          .eq("intake_id", intake.id);

        const partiesToInsert = input.data.parties.map((p) => ({
          intake_id: intake.id,
          party_type: p.party_type,
          party_role: p.party_role,
          name: p.name || null,
          phone: p.phone || null,
          email: p.email || null,
        }));

        await supabase
          .from("intake_parties")
          .insert(partiesToInsert);
      }

      return { success: true };
    }),

  // Update Step 4: Practice-specific details
  updateStep4: publicProcedure
    .input(z.object({
      draftToken: z.string(),
      practiceArea: practiceAreaSchema,
      data: z.union([
        step4PISchema,
        step4CriminalSchema,
        step4EmploymentSchema,
        step4TenantSchema,
        step4CivilSchema,
      ]),
    }))
    .mutation(async ({ input }) => {
      const supabase = getSupabaseAdmin();
      
      // Get intake ID
      const { data: intake, error: fetchError } = await supabase
        .from("intakes")
        .select("id")
        .eq("draft_token", input.draftToken)
        .single();

      if (fetchError) throw new Error(fetchError.message);

      const detailsTable = getDetailsTable(input.practiceArea);
      if (!detailsTable) throw new Error("Invalid practice area");

      // Upsert the details
      const { error } = await supabase
        .from(detailsTable)
        .upsert({
          intake_id: intake.id,
          ...input.data,
        }, {
          onConflict: "intake_id",
        });

      if (error) throw new Error(error.message);
      return { success: true };
    }),

  // Add upload metadata
  addUpload: publicProcedure
    .input(z.object({
      draftToken: z.string(),
      file_path: z.string(),
      file_name: z.string(),
      file_size: z.number(),
      mime_type: z.string(),
      tag: z.enum(["police_report", "medical", "contract", "notice", "photos", "emails", "other"]),
    }))
    .mutation(async ({ input }) => {
      const supabase = getSupabaseAdmin();
      
      // Get intake ID
      const { data: intake, error: fetchError } = await supabase
        .from("intakes")
        .select("id")
        .eq("draft_token", input.draftToken)
        .single();

      if (fetchError) throw new Error(fetchError.message);

      const { data, error } = await supabase
        .from("intake_uploads")
        .insert({
          intake_id: intake.id,
          file_path: input.file_path,
          file_name: input.file_name,
          file_size: input.file_size,
          mime_type: input.mime_type,
          tag: input.tag,
        })
        .select()
        .single();

      if (error) throw new Error(error.message);
      return data;
    }),

  // Upload file to Supabase storage
  uploadFile: publicProcedure
    .input(z.object({
      draftToken: z.string(),
      fileName: z.string(),
      fileData: z.string(), // base64 encoded
      mimeType: z.string(),
      tag: z.string(),
    }))
    .mutation(async ({ input }) => {
      const supabase = getSupabaseAdmin();
      
      // Get intake ID
      const { data: intake, error: fetchError } = await supabase
        .from("intakes")
        .select("id")
        .eq("draft_token", input.draftToken)
        .single();

      if (fetchError) throw new Error(fetchError.message);

      // Decode base64 and upload to storage
      const buffer = Buffer.from(input.fileData, "base64");
      const filePath = `intakes/${intake.id}/${nanoid(16)}_${input.fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("intake-uploads")
        .upload(filePath, buffer, {
          contentType: input.mimeType,
        });

      if (uploadError) throw new Error(uploadError.message);

      // Save metadata to database
      const { data, error } = await supabase
        .from("intake_uploads")
        .insert({
          intake_id: intake.id,
          file_path: filePath,
          file_name: input.fileName,
          file_size: buffer.length,
          mime_type: input.mimeType,
          tag: input.tag,
        })
        .select()
        .single();

      if (error) throw new Error(error.message);
      return { uploadId: data.id, filePath };
    }),

  // Delete file from storage and database
  deleteFile: publicProcedure
    .input(z.object({
      draftToken: z.string(),
      uploadId: z.number(),
    }))
    .mutation(async ({ input }) => {
      const supabase = getSupabaseAdmin();
      
      // Verify ownership via draft token
      const { data: intake } = await supabase
        .from("intakes")
        .select("id")
        .eq("draft_token", input.draftToken)
        .single();

      if (!intake) throw new Error("Invalid draft token");

      // Get the upload record
      const { data: upload } = await supabase
        .from("intake_uploads")
        .select("file_path")
        .eq("id", input.uploadId)
        .eq("intake_id", intake.id)
        .single();

      if (!upload) throw new Error("Upload not found");

      // Delete from storage
      await supabase.storage
        .from("intake-uploads")
        .remove([upload.file_path]);

      // Delete from database
      const { error } = await supabase
        .from("intake_uploads")
        .delete()
        .eq("id", input.uploadId)
        .eq("intake_id", intake.id);

      if (error) throw new Error(error.message);
      return { success: true };
    }),

  // Remove upload (legacy)
  removeUpload: publicProcedure
    .input(z.object({
      uploadId: z.number(),
      draftToken: z.string(),
    }))
    .mutation(async ({ input }) => {
      const supabase = getSupabaseAdmin();
      
      // Verify ownership via draft token
      const { data: intake } = await supabase
        .from("intakes")
        .select("id")
        .eq("draft_token", input.draftToken)
        .single();

      if (!intake) throw new Error("Invalid draft token");

      const { error } = await supabase
        .from("intake_uploads")
        .delete()
        .eq("id", input.uploadId)
        .eq("intake_id", intake.id);

      if (error) throw new Error(error.message);
      return { success: true };
    }),

  // Update additional notes
  updateNotes: publicProcedure
    .input(z.object({
      draftToken: z.string(),
      additional_notes: z.string().max(2000).optional(),
    }))
    .mutation(async ({ input }) => {
      const supabase = getSupabaseAdmin();
      
      const { error } = await supabase
        .from("intakes")
        .update({
          additional_notes: input.additional_notes || null,
        })
        .eq("draft_token", input.draftToken);

      if (error) throw new Error(error.message);
      return { success: true };
    }),

  // Submit intake (finalize)
  submit: publicProcedure
    .input(z.object({ draftToken: z.string() }))
    .mutation(async ({ input }) => {
      const supabase = getSupabaseAdmin();
      
      // Verify all required fields are present
      const { data: intake, error: fetchError } = await supabase
        .from("intakes")
        .select("*")
        .eq("draft_token", input.draftToken)
        .single();

      if (fetchError) throw new Error(fetchError.message);

      // Validate required fields
      if (!intake.consent_no_attorney_relationship || !intake.consent_contact) {
        throw new Error("Consents are required");
      }
      if (!intake.first_name || !intake.last_name) {
        throw new Error("Name is required");
      }
      if (!intake.phone && !intake.email) {
        throw new Error("Phone or email is required");
      }
      if (!intake.practice_area || !intake.issue_type_id || !intake.urgency || !intake.summary) {
        throw new Error("Matter selection is incomplete");
      }

      // Update status to submitted
      const { error } = await supabase
        .from("intakes")
        .update({ status: "submitted" })
        .eq("draft_token", input.draftToken);

      if (error) throw new Error(error.message);
      return { success: true, intakeId: intake.id };
    }),
});

// Helper function to get the correct details table name
function getDetailsTable(practiceArea: string): string | null {
  const tableMap: Record<string, string> = {
    personal_injury: "intake_pi_details",
    criminal_defense: "intake_criminal_details",
    employment_law: "intake_employment_details",
    tenant_rights: "intake_tenant_details",
    civil_litigation: "intake_civil_details",
  };
  return tableMap[practiceArea] || null;
}
