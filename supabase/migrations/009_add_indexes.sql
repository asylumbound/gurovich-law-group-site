-- =====================================================
-- ADD MISSING INDEXES FOR TERMINAL PERFORMANCE
-- Migration 009
-- Gurovich Law Group
-- =====================================================

-- Terminal Sessions Indexes
-- Index for filtering sessions by user
CREATE INDEX IF NOT EXISTS idx_terminal_sessions_user_id 
ON terminal_sessions(user_id);

-- Index for filtering sessions by intake
CREATE INDEX IF NOT EXISTS idx_terminal_sessions_intake_id 
ON terminal_sessions(intake_id);

-- Index for ordering sessions by creation date
CREATE INDEX IF NOT EXISTS idx_terminal_sessions_created_at 
ON terminal_sessions(created_at DESC);

-- Terminal Messages Indexes
-- Index for filtering messages by session
CREATE INDEX IF NOT EXISTS idx_terminal_messages_session_id 
ON terminal_messages(session_id);

-- Composite index for session message ordering (most common query pattern)
CREATE INDEX IF NOT EXISTS idx_terminal_messages_session_created 
ON terminal_messages(session_id, created_at DESC);

-- Upload Text Indexes
-- Index for filtering extracted text by intake
CREATE INDEX IF NOT EXISTS idx_upload_text_intake_id 
ON upload_text(intake_id);

-- Discovery Tables Indexes
-- Index for filtering discovery tasks by intake
CREATE INDEX IF NOT EXISTS idx_discovery_tasks_intake_id 
ON discovery_tasks(intake_id);

-- Index for filtering discovery drafts by intake
CREATE INDEX IF NOT EXISTS idx_discovery_drafts_intake_id 
ON discovery_drafts(intake_id);

-- Note: case_memory and intake_notes tables exist only in Supabase PostgreSQL,
-- not in MySQL/TiDB. Those indexes should be added via Supabase migrations.
