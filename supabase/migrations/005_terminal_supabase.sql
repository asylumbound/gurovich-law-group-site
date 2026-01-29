-- =====================================================
-- TERMINAL RAG ASSISTANT TABLES (Supabase/PostgreSQL)
-- Gurovich Law Group
-- =====================================================

-- Terminal sessions - tracks chat sessions with intake pinning
CREATE TABLE IF NOT EXISTS terminal_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  intake_id INTEGER NOT NULL REFERENCES intakes(id) ON DELETE CASCADE,
  title TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Terminal messages - stores chat history
CREATE TABLE IF NOT EXISTS terminal_messages (
  id SERIAL PRIMARY KEY,
  session_id UUID NOT NULL REFERENCES terminal_sessions(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  citations JSONB DEFAULT '[]'::jsonb,
  suggested_actions JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Upload text - stores extracted text from uploaded documents
CREATE TABLE IF NOT EXISTS upload_text (
  id SERIAL PRIMARY KEY,
  intake_id INTEGER NOT NULL REFERENCES intakes(id) ON DELETE CASCADE,
  upload_id INTEGER NOT NULL REFERENCES intake_uploads(id) ON DELETE CASCADE,
  file_name TEXT,
  extracted_text TEXT,
  word_count INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Discovery tasks - tracks tasks created from terminal
CREATE TABLE IF NOT EXISTS discovery_tasks (
  id SERIAL PRIMARY KEY,
  intake_id INTEGER NOT NULL REFERENCES intakes(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
  due_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Discovery drafts - stores work product drafts
CREATE TABLE IF NOT EXISTS discovery_drafts (
  id SERIAL PRIMARY KEY,
  intake_id INTEGER NOT NULL REFERENCES intakes(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  type TEXT NOT NULL,
  title TEXT,
  content JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_terminal_sessions_user ON terminal_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_terminal_sessions_intake ON terminal_sessions(intake_id);
CREATE INDEX IF NOT EXISTS idx_terminal_messages_session ON terminal_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_upload_text_intake ON upload_text(intake_id);
CREATE INDEX IF NOT EXISTS idx_discovery_tasks_intake ON discovery_tasks(intake_id);
CREATE INDEX IF NOT EXISTS idx_discovery_drafts_intake ON discovery_drafts(intake_id);

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers
DROP TRIGGER IF EXISTS update_terminal_sessions_updated_at ON terminal_sessions;
CREATE TRIGGER update_terminal_sessions_updated_at
  BEFORE UPDATE ON terminal_sessions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_discovery_tasks_updated_at ON discovery_tasks;
CREATE TRIGGER update_discovery_tasks_updated_at
  BEFORE UPDATE ON discovery_tasks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_discovery_drafts_updated_at ON discovery_drafts;
CREATE TRIGGER update_discovery_drafts_updated_at
  BEFORE UPDATE ON discovery_drafts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
