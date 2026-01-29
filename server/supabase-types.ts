// Supabase Database Types for Client Onboarding Questionnaire

// Enum types
export type PracticeArea = 
  | "personal_injury"
  | "criminal_defense"
  | "employment_law"
  | "civil_litigation"
  | "tenant_rights";

export type UrgencyLevel = "emergency" | "high" | "normal" | "unsure";

export type ContactMethod = "phone" | "email" | "text";

export type PreferredLanguage = "en" | "es" | "hy" | "ru" | "uk";

export type PartyType = 
  | "individual"
  | "business"
  | "government"
  | "insurance"
  | "other";

export type PartyRole = 
  | "defendant"
  | "plaintiff"
  | "witness"
  | "employer"
  | "landlord"
  | "tenant"
  | "other";

export type UploadTag = 
  | "police_report"
  | "medical"
  | "contract"
  | "notice"
  | "photos"
  | "emails"
  | "other";

export type IntakeStatus = "draft" | "submitted";

export type BestTimeToContact = "morning" | "afternoon" | "evening" | "anytime";

export type RelationshipToAffected = 
  | "spouse"
  | "parent"
  | "child"
  | "sibling"
  | "friend"
  | "attorney"
  | "other";

// Table types
export interface IssueType {
  id: number;
  practice_area: PracticeArea;
  name: string;
  description: string | null;
  created_at: string;
}

export interface Intake {
  id: number;
  draft_token: string;
  status: IntakeStatus;
  
  // Step 0: Consents
  consent_no_attorney_relationship: boolean;
  consent_contact: boolean;
  preferred_contact_method: ContactMethod | null;
  preferred_language: PreferredLanguage;
  
  // Step 1: Contact Basics
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  email: string | null;
  city: string | null;
  state: string | null;
  best_time_to_contact: BestTimeToContact | null;
  is_affected_person: boolean | null;
  relationship_to_affected: RelationshipToAffected | null;
  
  // Step 2: Matter Selection
  practice_area: PracticeArea | null;
  issue_type_id: number | null;
  urgency: UrgencyLevel | null;
  summary: string | null;
  
  // Step 3: Core Facts
  incident_date: string | null;
  incident_date_unknown: boolean;
  incident_city: string | null;
  incident_state: string | null;
  agency_involved: boolean | null;
  agency_name: string | null;
  report_number: string | null;
  has_documents: boolean | null;
  
  // Step 5: Additional
  additional_notes: string | null;
  
  created_at: string;
  updated_at: string;
}

export interface IntakeParty {
  id: number;
  intake_id: number;
  party_type: PartyType;
  party_role: PartyRole;
  name: string | null;
  phone: string | null;
  email: string | null;
  created_at: string;
}

export interface IntakeUpload {
  id: number;
  intake_id: number;
  file_path: string;
  file_name: string;
  file_size: number;
  mime_type: string;
  tag: UploadTag;
  created_at: string;
}

// Practice Area Detail Tables
export interface IntakePiDetails {
  id: number;
  intake_id: number;
  injury_severity: string | null;
  treatment_received: boolean | null;
  treatment_types: string[] | null;
  insurance_involved: boolean | null;
  insurance_types: string[] | null;
  vehicle_involved: boolean | null;
  claimant_role: string | null;
  photos_available: boolean | null;
  missed_work: boolean | null;
  current_status: string | null;
  created_at: string;
}

export interface IntakeCriminalDetails {
  id: number;
  intake_id: number;
  charges: string | null;
  has_court_date: boolean | null;
  court_date: string | null;
  courthouse_county: string | null;
  custody_status: string | null;
  prior_convictions: string | null;
  restraining_order_involved: boolean | null;
  created_at: string;
}

export interface IntakeEmploymentDetails {
  id: number;
  intake_id: number;
  employment_status: string | null;
  employer_name: string | null;
  job_title: string | null;
  date_hired: string | null;
  date_terminated: string | null;
  documents_available: string[] | null;
  desired_outcomes: string[] | null;
  created_at: string;
}

export interface IntakeTenantDetails {
  id: number;
  intake_id: number;
  party_role_type: string | null;
  property_city: string | null;
  property_zip: string | null;
  rent_controlled: string | null;
  notice_served: boolean | null;
  notice_type: string | null;
  conditions_issues: string[] | null;
  has_photos_reports: boolean | null;
  created_at: string;
}

export interface IntakeCivilDetails {
  id: number;
  intake_id: number;
  amount_band: string | null;
  contract_exists: boolean | null;
  demand_letter_sent: boolean | null;
  litigation_filed: boolean | null;
  case_number: string | null;
  county: string | null;
  created_at: string;
}

// Database schema type
export interface Database {
  public: {
    Tables: {
      issue_types: {
        Row: IssueType;
        Insert: Omit<IssueType, "id" | "created_at">;
        Update: Partial<Omit<IssueType, "id" | "created_at">>;
      };
      intakes: {
        Row: Intake;
        Insert: Partial<Omit<Intake, "id" | "created_at" | "updated_at">> & { draft_token: string };
        Update: Partial<Omit<Intake, "id" | "created_at">>;
      };
      intake_parties: {
        Row: IntakeParty;
        Insert: Omit<IntakeParty, "id" | "created_at">;
        Update: Partial<Omit<IntakeParty, "id" | "created_at">>;
      };
      intake_uploads: {
        Row: IntakeUpload;
        Insert: Omit<IntakeUpload, "id" | "created_at">;
        Update: Partial<Omit<IntakeUpload, "id" | "created_at">>;
      };
      intake_pi_details: {
        Row: IntakePiDetails;
        Insert: Omit<IntakePiDetails, "id" | "created_at">;
        Update: Partial<Omit<IntakePiDetails, "id" | "created_at">>;
      };
      intake_criminal_details: {
        Row: IntakeCriminalDetails;
        Insert: Omit<IntakeCriminalDetails, "id" | "created_at">;
        Update: Partial<Omit<IntakeCriminalDetails, "id" | "created_at">>;
      };
      intake_employment_details: {
        Row: IntakeEmploymentDetails;
        Insert: Omit<IntakeEmploymentDetails, "id" | "created_at">;
        Update: Partial<Omit<IntakeEmploymentDetails, "id" | "created_at">>;
      };
      intake_tenant_details: {
        Row: IntakeTenantDetails;
        Insert: Omit<IntakeTenantDetails, "id" | "created_at">;
        Update: Partial<Omit<IntakeTenantDetails, "id" | "created_at">>;
      };
      intake_civil_details: {
        Row: IntakeCivilDetails;
        Insert: Omit<IntakeCivilDetails, "id" | "created_at">;
        Update: Partial<Omit<IntakeCivilDetails, "id" | "created_at">>;
      };
    };
  };
}
