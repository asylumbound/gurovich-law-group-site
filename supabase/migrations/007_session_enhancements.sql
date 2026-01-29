-- Add is_favorite and deleted_at columns to terminal_sessions
ALTER TABLE terminal_sessions 
ADD COLUMN IF NOT EXISTS is_favorite BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL;

-- Create case_memory table for storing session summaries per intake
CREATE TABLE IF NOT EXISTS case_memory (
  id SERIAL PRIMARY KEY,
  intake_id INTEGER NOT NULL,
  session_id UUID REFERENCES terminal_sessions(id) ON DELETE CASCADE,
  memory_type VARCHAR(50) NOT NULL DEFAULT 'session_summary',
  title VARCHAR(500) NOT NULL,
  content TEXT NOT NULL,
  key_facts JSONB DEFAULT '[]',
  legal_issues JSONB DEFAULT '[]',
  citations JSONB DEFAULT '[]',
  created_by VARCHAR(100) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for case_memory
CREATE INDEX IF NOT EXISTS idx_case_memory_intake_id ON case_memory(intake_id);
CREATE INDEX IF NOT EXISTS idx_case_memory_session_id ON case_memory(session_id);
CREATE INDEX IF NOT EXISTS idx_case_memory_type ON case_memory(memory_type);

-- Create index for soft-deleted sessions
CREATE INDEX IF NOT EXISTS idx_terminal_sessions_deleted ON terminal_sessions(deleted_at);
CREATE INDEX IF NOT EXISTS idx_terminal_sessions_favorite ON terminal_sessions(is_favorite);
