import { z } from "zod";

// Enum schemas
export const practiceAreaSchema = z.enum([
  "personal_injury",
  "criminal_defense",
  "employment_law",
  "civil_litigation",
  "tenant_rights",
]);

export const urgencyLevelSchema = z.enum(["emergency", "high", "normal", "unsure"]);

export const contactMethodSchema = z.enum(["phone", "email", "text"]);

export const preferredLanguageSchema = z.enum(["en", "es", "hy", "ru", "uk"]);

export const partyTypeSchema = z.enum([
  "individual",
  "business",
  "government",
  "insurance",
  "other",
]);

export const partyRoleSchema = z.enum([
  "defendant",
  "plaintiff",
  "witness",
  "employer",
  "landlord",
  "tenant",
  "other",
]);

export const uploadTagSchema = z.enum([
  "police_report",
  "medical",
  "contract",
  "notice",
  "photos",
  "emails",
  "other",
]);

export const bestTimeToContactSchema = z.enum(["morning", "afternoon", "evening", "anytime"]);

export const relationshipToAffectedSchema = z.enum([
  "spouse",
  "parent",
  "child",
  "sibling",
  "friend",
  "attorney",
  "other",
]);

// Step 0: Disclaimers + Consent
export const step0Schema = z.object({
  consent_no_attorney_relationship: z.boolean().refine((val) => val === true, {
    message: "You must acknowledge this disclaimer to continue",
  }),
  consent_contact: z.boolean().refine((val) => val === true, {
    message: "You must consent to be contacted to continue",
  }),
  preferred_contact_method: contactMethodSchema,
  preferred_language: preferredLanguageSchema,
});

// Step 1: Contact Basics
export const step1Schema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  phone: z.string().optional(),
  email: z.string().email("Invalid email address").optional(),
  city: z.string().optional(),
  state: z.string().default("CA"),
  best_time_to_contact: bestTimeToContactSchema.optional(),
  is_affected_person: z.boolean(),
  relationship_to_affected: relationshipToAffectedSchema.optional(),
}).refine(
  (data) => data.phone || data.email,
  {
    message: "Either phone or email is required",
    path: ["phone"],
  }
);

// Step 2: Matter Selection
export const step2Schema = z.object({
  practice_area: practiceAreaSchema,
  issue_type_id: z.number().int().positive("Please select an issue type"),
  urgency: urgencyLevelSchema,
  summary: z.string().min(10, "Please provide a brief summary (at least 10 characters)").max(500),
});

// Step 3: Core Facts
export const partySchema = z.object({
  party_type: partyTypeSchema,
  party_role: partyRoleSchema,
  name: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
});

export const step3Schema = z.object({
  incident_date: z.string().optional(),
  incident_date_unknown: z.boolean().default(false),
  incident_city: z.string().optional(),
  incident_state: z.string().optional(),
  agency_involved: z.boolean().optional(),
  agency_name: z.string().optional(),
  report_number: z.string().optional(),
  has_documents: z.boolean().optional(),
  parties: z.array(partySchema).optional(),
});

// Step 4A: Personal Injury Details
export const step4PISchema = z.object({
  injury_severity: z.string().optional(),
  treatment_received: z.boolean().optional(),
  treatment_types: z.array(z.string()).optional(),
  insurance_involved: z.boolean().optional(),
  insurance_types: z.array(z.string()).optional(),
  vehicle_involved: z.boolean().optional(),
  claimant_role: z.string().optional(),
  photos_available: z.boolean().optional(),
  missed_work: z.boolean().optional(),
  current_status: z.string().optional(),
});

// Step 4B: Criminal Defense Details
export const step4CriminalSchema = z.object({
  charges: z.string().optional(),
  has_court_date: z.boolean().optional(),
  court_date: z.string().optional(),
  courthouse_county: z.string().optional(),
  custody_status: z.string().optional(),
  prior_convictions: z.string().optional(),
  restraining_order_involved: z.boolean().optional(),
});

// Step 4C: Employment Law Details
export const step4EmploymentSchema = z.object({
  employment_status: z.string().optional(),
  employer_name: z.string().optional(),
  job_title: z.string().optional(),
  date_hired: z.string().optional(),
  date_terminated: z.string().optional(),
  documents_available: z.array(z.string()).optional(),
  desired_outcomes: z.array(z.string()).optional(),
});

// Step 4D: Tenant Rights Details
export const step4TenantSchema = z.object({
  party_role_type: z.string().optional(),
  property_city: z.string().optional(),
  property_zip: z.string().optional(),
  rent_controlled: z.string().optional(),
  notice_served: z.boolean().optional(),
  notice_type: z.string().optional(),
  conditions_issues: z.array(z.string()).optional(),
  has_photos_reports: z.boolean().optional(),
});

// Step 4E: Civil Litigation Details
export const step4CivilSchema = z.object({
  amount_band: z.string().optional(),
  contract_exists: z.boolean().optional(),
  demand_letter_sent: z.boolean().optional(),
  litigation_filed: z.boolean().optional(),
  case_number: z.string().optional(),
  county: z.string().optional(),
});

// Step 5: Uploads + Review
export const uploadSchema = z.object({
  file_name: z.string(),
  file_path: z.string(),
  file_size: z.number(),
  mime_type: z.string(),
  tag: uploadTagSchema,
});

export const step5Schema = z.object({
  uploads: z.array(uploadSchema).optional(),
  additional_notes: z.string().max(2000).optional(),
});

// Full intake schema for submission validation
export const fullIntakeSchema = z.object({
  // Step 0
  consent_no_attorney_relationship: z.boolean(),
  consent_contact: z.boolean(),
  preferred_contact_method: contactMethodSchema,
  preferred_language: preferredLanguageSchema,
  
  // Step 1
  first_name: z.string().min(1),
  last_name: z.string().min(1),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  city: z.string().optional(),
  state: z.string(),
  best_time_to_contact: bestTimeToContactSchema.optional(),
  is_affected_person: z.boolean(),
  relationship_to_affected: relationshipToAffectedSchema.optional(),
  
  // Step 2
  practice_area: practiceAreaSchema,
  issue_type_id: z.number().int().positive(),
  urgency: urgencyLevelSchema,
  summary: z.string().min(10).max(500),
  
  // Step 3
  incident_date: z.string().optional(),
  incident_date_unknown: z.boolean(),
  incident_city: z.string().optional(),
  incident_state: z.string().optional(),
  agency_involved: z.boolean().optional(),
  agency_name: z.string().optional(),
  report_number: z.string().optional(),
  has_documents: z.boolean().optional(),
  
  // Step 5
  additional_notes: z.string().optional(),
});

// Type exports
export type Step0Data = z.infer<typeof step0Schema>;
export type Step1Data = z.infer<typeof step1Schema>;
export type Step2Data = z.infer<typeof step2Schema>;
export type Step3Data = z.infer<typeof step3Schema>;
export type Step4PIData = z.infer<typeof step4PISchema>;
export type Step4CriminalData = z.infer<typeof step4CriminalSchema>;
export type Step4EmploymentData = z.infer<typeof step4EmploymentSchema>;
export type Step4TenantData = z.infer<typeof step4TenantSchema>;
export type Step4CivilData = z.infer<typeof step4CivilSchema>;
export type Step5Data = z.infer<typeof step5Schema>;
export type PartyData = z.infer<typeof partySchema>;
export type UploadData = z.infer<typeof uploadSchema>;
export type FullIntakeData = z.infer<typeof fullIntakeSchema>;
export type PracticeArea = z.infer<typeof practiceAreaSchema>;
