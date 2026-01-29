-- =====================================================
-- ADMIN TERMINAL RAG ASSISTANT SCHEMA
-- Gurovich Law Group
-- Migration: 004_terminal_rag.sql
-- =====================================================

-- =====================================================
-- ENUM TYPES
-- =====================================================

-- Intake access roles
CREATE TYPE intake_access_role AS ENUM (
  'attorney',
  'staff',
  'viewer'
);

-- Terminal message roles
CREATE TYPE terminal_message_role AS ENUM (
  'user',
  'assistant',
  'system'
);

-- Discovery draft types
CREATE TYPE discovery_draft_type AS ENUM (
  'requests',
  'witness_topics',
  'esi_plan',
  'proof_matrix',
  'other'
);

-- Discovery task status
CREATE TYPE discovery_task_status AS ENUM (
  'pending',
  'in_progress',
  'completed',
  'cancelled'
);

-- Discovery task priority
CREATE TYPE discovery_task_priority AS ENUM (
  'low',
  'medium',
  'high',
  'urgent'
);

-- =====================================================
-- INTAKE ACCESS CONTROL TABLE
-- =====================================================

-- User-intake access permissions
CREATE TABLE intake_access (
  id SERIAL PRIMARY KEY,
  intake_id INTEGER NOT NULL REFERENCES intakes(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL,
  role intake_access_role NOT NULL DEFAULT 'viewer',
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(intake_id, user_id)
);

CREATE INDEX idx_intake_access_intake_id ON intake_access(intake_id);
CREATE INDEX idx_intake_access_user_id ON intake_access(user_id);

-- =====================================================
-- TERMINAL SESSION TABLES
-- =====================================================

-- Terminal sessions (pinned to single intake)
CREATE TABLE terminal_sessions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id INTEGER NOT NULL,
  intake_id INTEGER NOT NULL REFERENCES intakes(id) ON DELETE CASCADE,
  title VARCHAR(255),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_terminal_sessions_user_id ON terminal_sessions(user_id);
CREATE INDEX idx_terminal_sessions_intake_id ON terminal_sessions(intake_id);
CREATE INDEX idx_terminal_sessions_created_at ON terminal_sessions(created_at DESC);

-- Terminal messages (chat history)
CREATE TABLE terminal_messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  session_id UUID NOT NULL REFERENCES terminal_sessions(id) ON DELETE CASCADE,
  role terminal_message_role NOT NULL,
  content TEXT NOT NULL,
  citations JSONB DEFAULT '[]'::jsonb,
  suggested_actions JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_terminal_messages_session_id ON terminal_messages(session_id);
CREATE INDEX idx_terminal_messages_created_at ON terminal_messages(created_at);

-- =====================================================
-- DOCUMENT TEXT EXTRACTION TABLE
-- =====================================================

-- Extracted text from uploaded documents for RAG
CREATE TABLE upload_text (
  id SERIAL PRIMARY KEY,
  upload_id INTEGER NOT NULL REFERENCES intake_uploads(id) ON DELETE CASCADE,
  intake_id INTEGER NOT NULL REFERENCES intakes(id) ON DELETE CASCADE,
  text_content TEXT NOT NULL,
  word_count INTEGER,
  extracted_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(upload_id)
);

CREATE INDEX idx_upload_text_intake_id ON upload_text(intake_id);
CREATE INDEX idx_upload_text_upload_id ON upload_text(upload_id);

-- Full-text search index for keyword search
CREATE INDEX idx_upload_text_search ON upload_text USING gin(to_tsvector('english', text_content));

-- =====================================================
-- DISCOVERY ACCELERATOR TABLES
-- =====================================================

-- Discovery tasks
CREATE TABLE discovery_tasks (
  id SERIAL PRIMARY KEY,
  intake_id INTEGER NOT NULL REFERENCES intakes(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  priority discovery_task_priority DEFAULT 'medium' NOT NULL,
  status discovery_task_status DEFAULT 'pending' NOT NULL,
  due_date DATE,
  created_by_id INTEGER,
  created_by_name VARCHAR(255),
  assigned_to_id INTEGER,
  assigned_to_name VARCHAR(255),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_discovery_tasks_intake_id ON discovery_tasks(intake_id);
CREATE INDEX idx_discovery_tasks_status ON discovery_tasks(status);
CREATE INDEX idx_discovery_tasks_priority ON discovery_tasks(priority);

-- Discovery drafts (work product)
CREATE TABLE discovery_drafts (
  id SERIAL PRIMARY KEY,
  intake_id INTEGER NOT NULL REFERENCES intakes(id) ON DELETE CASCADE,
  type discovery_draft_type NOT NULL,
  title VARCHAR(255),
  content JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_by_id INTEGER,
  created_by_name VARCHAR(255),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_discovery_drafts_intake_id ON discovery_drafts(intake_id);
CREATE INDEX idx_discovery_drafts_type ON discovery_drafts(type);

-- =====================================================
-- STATUTES TABLE (Placeholder for legal research)
-- =====================================================

CREATE TABLE statutes (
  id SERIAL PRIMARY KEY,
  jurisdiction VARCHAR(50) NOT NULL DEFAULT 'CA',
  code VARCHAR(100) NOT NULL,
  section VARCHAR(100) NOT NULL,
  title VARCHAR(500) NOT NULL,
  text_content TEXT NOT NULL,
  tags TEXT[],
  effective_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_statutes_jurisdiction ON statutes(jurisdiction);
CREATE INDEX idx_statutes_code ON statutes(code);
CREATE INDEX idx_statutes_search ON statutes USING gin(to_tsvector('english', title || ' ' || text_content));

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on new tables
ALTER TABLE intake_access ENABLE ROW LEVEL SECURITY;
ALTER TABLE terminal_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE terminal_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE upload_text ENABLE ROW LEVEL SECURITY;
ALTER TABLE discovery_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE discovery_drafts ENABLE ROW LEVEL SECURITY;
ALTER TABLE statutes ENABLE ROW LEVEL SECURITY;

-- Intake access: Service role only (managed by server)
CREATE POLICY "intake_access_service_role" ON intake_access
  FOR ALL USING (true);

-- Terminal sessions: Service role only
CREATE POLICY "terminal_sessions_service_role" ON terminal_sessions
  FOR ALL USING (true);

-- Terminal messages: Service role only
CREATE POLICY "terminal_messages_service_role" ON terminal_messages
  FOR ALL USING (true);

-- Upload text: Service role only
CREATE POLICY "upload_text_service_role" ON upload_text
  FOR ALL USING (true);

-- Discovery tasks: Service role only
CREATE POLICY "discovery_tasks_service_role" ON discovery_tasks
  FOR ALL USING (true);

-- Discovery drafts: Service role only
CREATE POLICY "discovery_drafts_service_role" ON discovery_drafts
  FOR ALL USING (true);

-- Statutes: Public read access
CREATE POLICY "statutes_select" ON statutes
  FOR SELECT USING (true);

-- =====================================================
-- TRIGGERS FOR UPDATED_AT
-- =====================================================

-- Generic updated_at trigger function (if not exists)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to new tables
CREATE TRIGGER intake_access_updated_at
  BEFORE UPDATE ON intake_access
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER terminal_sessions_updated_at
  BEFORE UPDATE ON terminal_sessions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER discovery_tasks_updated_at
  BEFORE UPDATE ON discovery_tasks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER discovery_drafts_updated_at
  BEFORE UPDATE ON discovery_drafts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER statutes_updated_at
  BEFORE UPDATE ON statutes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- SEED DATA: Sample California Statutes
-- =====================================================

INSERT INTO statutes (jurisdiction, code, section, title, text_content, tags) VALUES
  ('CA', 'CCP', '335.1', 'Personal Injury Statute of Limitations', 
   'Within two years: An action for assault, battery, or injury to, or for the death of, an individual caused by the wrongful act or neglect of another.',
   ARRAY['personal_injury', 'statute_of_limitations', 'tort']),
  ('CA', 'CCP', '340.5', 'Medical Malpractice Statute of Limitations',
   'In an action for injury or death against a health care provider based upon such person''s alleged professional negligence, the time for the commencement of action shall be three years after the date of injury or one year after the plaintiff discovers, or through the use of reasonable diligence should have discovered, the injury, whichever occurs first.',
   ARRAY['medical_malpractice', 'statute_of_limitations', 'healthcare']),
  ('CA', 'PC', '187', 'Murder Definition',
   'Murder is the unlawful killing of a human being, or a fetus, with malice aforethought.',
   ARRAY['criminal', 'homicide', 'murder']),
  ('CA', 'PC', '240', 'Assault Definition',
   'An assault is an unlawful attempt, coupled with a present ability, to commit a violent injury on the person of another.',
   ARRAY['criminal', 'assault', 'violence']),
  ('CA', 'LC', '1102.5', 'Whistleblower Protection',
   'An employer, or any person acting on behalf of the employer, shall not retaliate against an employee for disclosing information, or because the employer believes that the employee disclosed or may disclose information, to a government or law enforcement agency.',
   ARRAY['employment', 'whistleblower', 'retaliation']),
  ('CA', 'CC', '1942.4', 'Tenant Habitability',
   'A landlord of a dwelling may not demand rent, collect rent, issue a notice of a rent increase, or issue a three-day notice to pay rent or quit, if the dwelling substantially lacks certain characteristics.',
   ARRAY['tenant_rights', 'habitability', 'landlord_tenant']),
  ('CA', 'CC', '1946.2', 'Just Cause Eviction',
   'After a tenant has continuously and lawfully occupied a residential real property for 12 months, the owner of the residential real property shall not terminate the tenancy without just cause.',
   ARRAY['tenant_rights', 'eviction', 'just_cause']);

-- =====================================================
-- COMMENTS
-- =====================================================

COMMENT ON TABLE intake_access IS 'User-intake access permissions for scoped data access';
COMMENT ON TABLE terminal_sessions IS 'RAG terminal chat sessions pinned to single intake';
COMMENT ON TABLE terminal_messages IS 'Chat messages within terminal sessions';
COMMENT ON TABLE upload_text IS 'Extracted text from uploaded documents for keyword search';
COMMENT ON TABLE discovery_tasks IS 'Discovery-related tasks generated from terminal';
COMMENT ON TABLE discovery_drafts IS 'Work product drafts (discovery requests, witness topics, etc.)';
COMMENT ON TABLE statutes IS 'Legal statutes for research and citation';
