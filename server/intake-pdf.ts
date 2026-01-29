/**
 * PDF Generation for Intake Records
 * 
 * Generates professional PDF case summaries for attorneys to print/share.
 * Uses jsPDF for PDF generation.
 */

import { jsPDF } from "jspdf";

// Type definitions for intake data
interface IntakeData {
  id: number;
  first_name: string;
  last_name: string;
  phone?: string;
  email?: string;
  city?: string;
  state?: string;
  preferred_contact_method?: string;
  preferred_language?: string;
  best_time_to_contact?: string;
  is_affected_person?: boolean;
  relationship_to_affected?: string;
  practice_area?: string;
  urgency?: string;
  summary?: string;
  incident_date?: string;
  incident_date_unknown?: boolean;
  incident_city?: string;
  incident_state?: string;
  agency_involved?: boolean;
  agency_name?: string;
  report_number?: string;
  has_documents?: boolean;
  additional_notes?: string;
  status?: string;
  created_at: string;
  updated_at?: string;
  issue_type?: { name: string } | null;
  parties?: Array<{
    party_type: string;
    party_role: string;
    name?: string;
    phone?: string;
    email?: string;
  }>;
  uploads?: Array<{
    file_name: string;
    tag: string;
    file_size: number;
  }>;
  practice_details?: Record<string, unknown> | null;
}

// Label mappings
const PRACTICE_AREA_LABELS: Record<string, string> = {
  personal_injury: "Personal Injury",
  criminal_defense: "Criminal Defense",
  employment_law: "Employment Law",
  tenant_rights: "Tenant Rights",
  civil_litigation: "Civil Litigation",
};

const URGENCY_LABELS: Record<string, string> = {
  emergency: "EMERGENCY",
  high: "High Priority",
  normal: "Normal",
  unsure: "Not Sure",
};

const STATUS_LABELS: Record<string, string> = {
  draft: "Draft",
  submitted: "Submitted",
  reviewed: "Reviewed",
  contacted: "Contacted",
  converted: "Converted",
  closed: "Closed",
};

const LANGUAGE_LABELS: Record<string, string> = {
  en: "English",
  es: "Spanish",
  hy: "Armenian",
  ru: "Russian",
  uk: "Ukrainian",
};

const CONTACT_METHOD_LABELS: Record<string, string> = {
  phone: "Phone",
  email: "Email",
  text: "Text Message",
};

const TIME_LABELS: Record<string, string> = {
  morning: "Morning (9am-12pm)",
  afternoon: "Afternoon (12pm-5pm)",
  evening: "Evening (5pm-8pm)",
  anytime: "Anytime",
};

/**
 * Generate a PDF case summary for an intake record
 */
export function generateIntakePDF(intake: IntakeData): Buffer {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "letter",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;
  let yPos = margin;

  // Helper function to add text with word wrap
  const addText = (text: string, x: number, y: number, maxWidth: number, fontSize = 10): number => {
    doc.setFontSize(fontSize);
    const lines = doc.splitTextToSize(text, maxWidth);
    doc.text(lines, x, y);
    return y + lines.length * (fontSize * 0.4);
  };

  // Helper function to add a section header
  const addSectionHeader = (title: string): number => {
    if (yPos > pageHeight - 40) {
      doc.addPage();
      yPos = margin;
    }
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(139, 0, 0); // Dark red
    doc.text(title, margin, yPos);
    yPos += 2;
    doc.setDrawColor(139, 0, 0);
    doc.line(margin, yPos, pageWidth - margin, yPos);
    yPos += 6;
    doc.setFont("helvetica", "normal");
    doc.setTextColor(0, 0, 0);
    return yPos;
  };

  // Helper function to add a field
  const addField = (label: string, value: string | undefined | null, indent = 0): number => {
    if (!value) return yPos;
    if (yPos > pageHeight - 20) {
      doc.addPage();
      yPos = margin;
    }
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text(`${label}:`, margin + indent, yPos);
    doc.setFont("helvetica", "normal");
    const labelWidth = doc.getTextWidth(`${label}: `);
    const valueLines = doc.splitTextToSize(value, contentWidth - labelWidth - indent);
    doc.text(valueLines, margin + indent + labelWidth, yPos);
    yPos += valueLines.length * 4 + 2;
    return yPos;
  };

  // ============================================
  // HEADER
  // ============================================
  doc.setFillColor(26, 34, 43); // Dark navy
  doc.rect(0, 0, pageWidth, 35, "F");
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text("GUROVICH LAW GROUP", margin, 15);
  
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("Client Intake Case Summary", margin, 22);
  
  doc.setFontSize(9);
  doc.text(`Generated: ${new Date().toLocaleString()}`, margin, 29);
  
  // Case ID on right side
  doc.setFontSize(12);
  doc.text(`Case #${intake.id}`, pageWidth - margin - 25, 22);
  
  doc.setTextColor(0, 0, 0);
  yPos = 45;

  // ============================================
  // STATUS BANNER
  // ============================================
  const urgencyColor = intake.urgency === "emergency" ? [220, 53, 69] : 
                       intake.urgency === "high" ? [255, 193, 7] : [40, 167, 69];
  doc.setFillColor(urgencyColor[0], urgencyColor[1], urgencyColor[2]);
  doc.rect(margin, yPos, contentWidth, 8, "F");
  doc.setTextColor(intake.urgency === "high" ? 0 : 255, intake.urgency === "high" ? 0 : 255, intake.urgency === "high" ? 0 : 255);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  const statusText = `${URGENCY_LABELS[intake.urgency || "normal"] || "Normal"} | ${STATUS_LABELS[intake.status || "submitted"] || "Submitted"} | ${PRACTICE_AREA_LABELS[intake.practice_area || ""] || intake.practice_area || "Not Specified"}`;
  doc.text(statusText, margin + 3, yPos + 5.5);
  doc.setTextColor(0, 0, 0);
  yPos += 15;

  // ============================================
  // CLIENT INFORMATION
  // ============================================
  yPos = addSectionHeader("Client Information");
  
  addField("Name", `${intake.first_name} ${intake.last_name}`);
  addField("Phone", intake.phone);
  addField("Email", intake.email);
  addField("Location", intake.city && intake.state ? `${intake.city}, ${intake.state}` : undefined);
  addField("Preferred Contact", CONTACT_METHOD_LABELS[intake.preferred_contact_method || ""] || intake.preferred_contact_method);
  addField("Preferred Language", LANGUAGE_LABELS[intake.preferred_language || ""] || intake.preferred_language);
  addField("Best Time to Contact", TIME_LABELS[intake.best_time_to_contact || ""] || intake.best_time_to_contact);
  
  if (intake.is_affected_person === false && intake.relationship_to_affected) {
    addField("Relationship to Client", intake.relationship_to_affected);
  }
  
  yPos += 5;

  // ============================================
  // CASE INFORMATION
  // ============================================
  yPos = addSectionHeader("Case Information");
  
  addField("Practice Area", PRACTICE_AREA_LABELS[intake.practice_area || ""] || intake.practice_area);
  addField("Issue Type", intake.issue_type?.name);
  addField("Urgency", URGENCY_LABELS[intake.urgency || ""] || intake.urgency);
  addField("Status", STATUS_LABELS[intake.status || ""] || intake.status);
  addField("Submitted", new Date(intake.created_at).toLocaleString());
  
  yPos += 3;
  
  if (intake.summary) {
    doc.setFont("helvetica", "bold");
    doc.text("Case Summary:", margin, yPos);
    yPos += 5;
    doc.setFont("helvetica", "normal");
    yPos = addText(intake.summary, margin, yPos, contentWidth, 10);
    yPos += 5;
  }

  // ============================================
  // INCIDENT DETAILS
  // ============================================
  yPos = addSectionHeader("Incident Details");
  
  if (intake.incident_date_unknown) {
    addField("Incident Date", "Unknown");
  } else if (intake.incident_date) {
    addField("Incident Date", new Date(intake.incident_date).toLocaleDateString());
  }
  
  addField("Incident Location", intake.incident_city && intake.incident_state ? `${intake.incident_city}, ${intake.incident_state}` : undefined);
  
  if (intake.agency_involved) {
    addField("Agency Involved", "Yes");
    addField("Agency Name", intake.agency_name);
    addField("Report Number", intake.report_number);
  }
  
  addField("Has Documents", intake.has_documents ? "Yes" : "No");
  
  yPos += 5;

  // ============================================
  // PARTIES INVOLVED
  // ============================================
  if (intake.parties && intake.parties.length > 0) {
    yPos = addSectionHeader("Parties Involved");
    
    intake.parties.forEach((party, index) => {
      if (yPos > pageHeight - 30) {
        doc.addPage();
        yPos = margin;
      }
      
      doc.setFont("helvetica", "bold");
      doc.text(`Party ${index + 1}:`, margin, yPos);
      yPos += 5;
      doc.setFont("helvetica", "normal");
      
      addField("Type", party.party_type, 5);
      addField("Role", party.party_role, 5);
      addField("Name", party.name, 5);
      addField("Phone", party.phone, 5);
      addField("Email", party.email, 5);
      yPos += 3;
    });
  }

  // ============================================
  // PRACTICE-SPECIFIC DETAILS
  // ============================================
  if (intake.practice_details && Object.keys(intake.practice_details).length > 0) {
    yPos = addSectionHeader("Practice-Specific Details");
    
    const details = intake.practice_details;
    
    // Personal Injury specific fields
    if (intake.practice_area === "personal_injury") {
      addField("Injury Severity", details.injury_severity as string);
      addField("Treatment Received", details.treatment_received ? "Yes" : "No");
      if (details.treatment_types && Array.isArray(details.treatment_types)) {
        addField("Treatment Types", (details.treatment_types as string[]).join(", "));
      }
      addField("Insurance Involved", details.insurance_involved ? "Yes" : "No");
      if (details.insurance_types && Array.isArray(details.insurance_types)) {
        addField("Insurance Types", (details.insurance_types as string[]).join(", "));
      }
      addField("Vehicle Involved", details.vehicle_involved ? "Yes" : "No");
      addField("Claimant Role", details.claimant_role as string);
      addField("Photos Available", details.photos_available ? "Yes" : "No");
      addField("Missed Work", details.missed_work ? "Yes" : "No");
      addField("Current Status", details.current_status as string);
    }
    
    // Criminal Defense specific fields
    if (intake.practice_area === "criminal_defense") {
      addField("Charges", details.charges as string);
      addField("Has Court Date", details.has_court_date ? "Yes" : "No");
      if (details.court_date) {
        addField("Court Date", new Date(details.court_date as string).toLocaleDateString());
      }
      addField("Courthouse County", details.courthouse_county as string);
      addField("Custody Status", details.custody_status as string);
      addField("Prior Convictions", details.prior_convictions as string);
      addField("Restraining Order Involved", details.restraining_order_involved ? "Yes" : "No");
    }
    
    // Employment Law specific fields
    if (intake.practice_area === "employment_law") {
      addField("Employment Status", details.employment_status as string);
      addField("Employer Name", details.employer_name as string);
      addField("Job Title", details.job_title as string);
      if (details.date_hired) {
        addField("Date Hired", new Date(details.date_hired as string).toLocaleDateString());
      }
      if (details.date_terminated) {
        addField("Date Terminated", new Date(details.date_terminated as string).toLocaleDateString());
      }
      if (details.documents_available && Array.isArray(details.documents_available)) {
        addField("Documents Available", (details.documents_available as string[]).join(", "));
      }
      if (details.desired_outcomes && Array.isArray(details.desired_outcomes)) {
        addField("Desired Outcomes", (details.desired_outcomes as string[]).join(", "));
      }
    }
    
    // Tenant Rights specific fields
    if (intake.practice_area === "tenant_rights") {
      addField("Party Role", details.party_role_type as string);
      addField("Property City", details.property_city as string);
      addField("Property ZIP", details.property_zip as string);
      addField("Rent Controlled", details.rent_controlled as string);
      addField("Notice Served", details.notice_served ? "Yes" : "No");
      addField("Notice Type", details.notice_type as string);
      if (details.conditions_issues && Array.isArray(details.conditions_issues)) {
        addField("Condition Issues", (details.conditions_issues as string[]).join(", "));
      }
      addField("Has Photos/Reports", details.has_photos_reports ? "Yes" : "No");
    }
    
    // Civil Litigation specific fields
    if (intake.practice_area === "civil_litigation") {
      addField("Amount Band", details.amount_band as string);
      addField("Contract Exists", details.contract_exists ? "Yes" : "No");
      addField("Demand Letter Sent", details.demand_letter_sent ? "Yes" : "No");
      addField("Litigation Filed", details.litigation_filed ? "Yes" : "No");
      addField("Case Number", details.case_number as string);
      addField("County", details.county as string);
    }
    
    yPos += 5;
  }

  // ============================================
  // UPLOADED DOCUMENTS
  // ============================================
  if (intake.uploads && intake.uploads.length > 0) {
    yPos = addSectionHeader("Uploaded Documents");
    
    intake.uploads.forEach((upload, index) => {
      if (yPos > pageHeight - 15) {
        doc.addPage();
        yPos = margin;
      }
      
      const sizeKB = Math.round(upload.file_size / 1024);
      doc.text(`${index + 1}. ${upload.file_name} (${upload.tag}) - ${sizeKB}KB`, margin, yPos);
      yPos += 5;
    });
    
    yPos += 5;
  }

  // ============================================
  // ADDITIONAL NOTES
  // ============================================
  if (intake.additional_notes) {
    yPos = addSectionHeader("Additional Notes from Client");
    yPos = addText(intake.additional_notes, margin, yPos, contentWidth, 10);
    yPos += 5;
  }

  // ============================================
  // FOOTER
  // ============================================
  const footerY = pageHeight - 15;
  doc.setDrawColor(200, 200, 200);
  doc.line(margin, footerY - 5, pageWidth - margin, footerY - 5);
  
  doc.setFontSize(8);
  doc.setTextColor(128, 128, 128);
  doc.text("CONFIDENTIAL - Attorney-Client Privileged Information", margin, footerY);
  doc.text("Gurovich Law Group | (818) 401-4725 | info@gurovichlaw.com", margin, footerY + 4);
  doc.text(`Page 1 of ${doc.getNumberOfPages()}`, pageWidth - margin - 20, footerY);

  // Return as Buffer
  const arrayBuffer = doc.output("arraybuffer");
  return Buffer.from(arrayBuffer);
}
