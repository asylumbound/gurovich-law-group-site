// Terminal RAG Types for Admin Terminal Assistant

// =====================================================
// ENUM TYPES
// =====================================================

export type IntakeAccessRole = 'attorney' | 'staff' | 'viewer';

export type TerminalMessageRole = 'user' | 'assistant' | 'system';

export type DiscoveryDraftType = 'requests' | 'witness_topics' | 'esi_plan' | 'proof_matrix' | 'other';

export type DiscoveryTaskStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';

export type DiscoveryTaskPriority = 'low' | 'medium' | 'high' | 'urgent';

// =====================================================
// TABLE TYPES
// =====================================================

export interface IntakeAccess {
  id: number;
  intake_id: number;
  user_id: number;
  role: IntakeAccessRole;
  created_at: string;
  updated_at: string;
}

export interface TerminalSession {
  id: string; // UUID
  user_id: number;
  intake_id: number;
  title: string | null;
  created_at: string;
  updated_at: string;
}

export interface TerminalMessage {
  id: string; // UUID
  session_id: string;
  role: TerminalMessageRole;
  content: string;
  citations: Citation[];
  suggested_actions: SuggestedAction[];
  created_at: string;
}

export interface UploadText {
  id: number;
  upload_id: number;
  intake_id: number;
  text_content: string;
  word_count: number | null;
  extracted_at: string;
}

export interface DiscoveryTask {
  id: number;
  intake_id: number;
  title: string;
  description: string | null;
  priority: DiscoveryTaskPriority;
  status: DiscoveryTaskStatus;
  due_date: string | null;
  created_by_id: number | null;
  created_by_name: string | null;
  assigned_to_id: number | null;
  assigned_to_name: string | null;
  created_at: string;
  updated_at: string;
}

export interface DiscoveryDraft {
  id: number;
  intake_id: number;
  type: DiscoveryDraftType;
  title: string | null;
  content: Record<string, unknown>;
  created_by_id: number | null;
  created_by_name: string | null;
  created_at: string;
  updated_at: string;
}

export interface Statute {
  id: number;
  jurisdiction: string;
  code: string;
  section: string;
  title: string;
  text_content: string;
  tags: string[] | null;
  effective_date: string | null;
  created_at: string;
  updated_at: string;
}

// =====================================================
// CITATION TYPES
// =====================================================

export type CitationType = 'INTAKE' | 'NOTE' | 'UPLOAD' | 'STATUTE' | 'CASELAW';

export interface BaseCitation {
  type: CitationType;
  id: number | string;
}

export interface IntakeCitation extends BaseCitation {
  type: 'INTAKE';
  id: number;
}

export interface NoteCitation extends BaseCitation {
  type: 'NOTE';
  id: number;
}

export interface UploadCitation extends BaseCitation {
  type: 'UPLOAD';
  id: number;
  file_name: string;
}

export interface StatuteCitation extends BaseCitation {
  type: 'STATUTE';
  id: number;
  citation: string; // e.g., "CA CCP § 335.1"
}

export interface CaselawCitation extends BaseCitation {
  type: 'CASELAW';
  id: string;
  citation: string; // e.g., "Brown v. Board of Education"
  url?: string;
}

export type Citation = IntakeCitation | NoteCitation | UploadCitation | StatuteCitation | CaselawCitation;

// =====================================================
// SUGGESTED ACTION TYPES
// =====================================================

export interface SuggestedAction {
  label: string;
  action: string;
  payload?: Record<string, unknown>;
}

// =====================================================
// CONTEXT PACK TYPES
// =====================================================

export interface ContextPack {
  intake: ContextPackIntake;
  issue_type: ContextPackIssueType | null;
  parties: ContextPackParty[];
  notes: ContextPackNote[];
  uploads: ContextPackUpload[];
  practice_details: Record<string, unknown> | null;
  missing_info_hints: string[];
}

export interface ContextPackIntake {
  id: number;
  status: string;
  practice_area: string | null;
  issue_type_id: number | null;
  summary: string | null;
  incident_date: string | null;
  incident_city: string | null;
  incident_state: string | null;
  urgency: string | null;
  has_documents: boolean | null;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  email: string | null;
  city: string | null;
  state: string | null;
  created_at: string;
  updated_at: string;
}

export interface ContextPackIssueType {
  id: number;
  name: string;
  description: string | null;
}

export interface ContextPackParty {
  id: number;
  party_type: string;
  party_role: string;
  name: string | null;
  phone: string | null;
  email: string | null;
}

export interface ContextPackNote {
  id: number;
  note: string;
  created_by_name: string | null;
  created_at: string;
}

export interface ContextPackUpload {
  id: number;
  file_name: string;
  file_size: number;
  mime_type: string;
  tag: string;
  has_extracted_text: boolean;
}

// =====================================================
// SEARCH RESULT TYPES
// =====================================================

export interface UploadTextSearchResult {
  upload_id: number;
  file_name: string;
  snippet: string;
  rank: number;
}

export interface StatuteSearchResult {
  id: number;
  citation: string; // e.g., "CA CCP § 335.1"
  title: string;
  excerpt: string;
  jurisdiction: string;
  tags: string[] | null;
}

export interface CaselawSearchResult {
  id: string;
  title: string;
  court: string;
  date: string;
  citation: string;
  excerpt: string;
  url: string;
}

// =====================================================
// TERMINAL QUERY TYPES
// =====================================================

export interface TerminalQueryInput {
  intakeId: number;
  sessionId?: string;
  query: string;
  tools?: ('statutes' | 'caselaw' | 'uploads')[];
}

export interface TerminalQueryOutput {
  answer: string;
  citations: Citation[];
  suggestedActions: SuggestedAction[];
  sessionId: string;
}
