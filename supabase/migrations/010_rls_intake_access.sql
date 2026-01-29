-- =====================================================
-- RLS + INTAKE_ACCESS TABLE FOR DATA ISOLATION
-- Migration 010
-- Gurovich Law Group
-- 
-- This migration creates the intake_access table and enables
-- Row Level Security (RLS) on all intake-scoped tables to
-- prevent cross-client data pollution.
-- =====================================================

-- =====================================================
-- 1) CREATE INTAKE_ACCESS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS intake_access (
  id SERIAL PRIMARY KEY,
  intake_id INTEGER NOT NULL REFERENCES intakes(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'viewer',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(intake_id, user_id)
);

-- Index for fast lookups
CREATE INDEX IF NOT EXISTS idx_intake_access_user_id ON intake_access(user_id);
CREATE INDEX IF NOT EXISTS idx_intake_access_intake_id ON intake_access(intake_id);

-- =====================================================
-- 2) HELPER FUNCTION: Check if user is admin
-- Uses the users table role field
-- =====================================================

CREATE OR REPLACE FUNCTION is_admin(check_user_id TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM users 
    WHERE id = check_user_id AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 3) HELPER FUNCTION: Check intake access
-- Returns true if user is admin OR has explicit access
-- =====================================================

CREATE OR REPLACE FUNCTION has_intake_access(check_intake_id INTEGER, check_user_id TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  -- Admins have access to all intakes
  IF is_admin(check_user_id) THEN
    RETURN TRUE;
  END IF;
  
  -- Check explicit access grant
  RETURN EXISTS (
    SELECT 1 FROM intake_access 
    WHERE intake_id = check_intake_id AND user_id = check_user_id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 4) ENABLE RLS ON INTAKE-SCOPED TABLES
-- =====================================================

-- Enable RLS on intakes table
ALTER TABLE intakes ENABLE ROW LEVEL SECURITY;

-- Enable RLS on intake_notes
ALTER TABLE intake_notes ENABLE ROW LEVEL SECURITY;

-- Enable RLS on intake_uploads
ALTER TABLE intake_uploads ENABLE ROW LEVEL SECURITY;

-- Enable RLS on intake_parties
ALTER TABLE intake_parties ENABLE ROW LEVEL SECURITY;

-- Enable RLS on practice detail tables
ALTER TABLE intake_pi_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE intake_criminal_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE intake_employment_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE intake_tenant_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE intake_civil_details ENABLE ROW LEVEL SECURITY;

-- Enable RLS on terminal tables
ALTER TABLE terminal_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE terminal_messages ENABLE ROW LEVEL SECURITY;

-- Enable RLS on discovery tables
ALTER TABLE discovery_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE discovery_drafts ENABLE ROW LEVEL SECURITY;

-- Enable RLS on upload_text
ALTER TABLE upload_text ENABLE ROW LEVEL SECURITY;

-- Enable RLS on case_memory (if exists)
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'case_memory') THEN
    EXECUTE 'ALTER TABLE case_memory ENABLE ROW LEVEL SECURITY';
  END IF;
END $$;

-- =====================================================
-- 5) CREATE RLS POLICIES
-- =====================================================

-- Policy for intakes table
DROP POLICY IF EXISTS intakes_access_policy ON intakes;
CREATE POLICY intakes_access_policy ON intakes
  FOR ALL
  USING (
    has_intake_access(id, current_setting('app.user_id', true))
  );

-- Policy for intake_notes
DROP POLICY IF EXISTS intake_notes_access_policy ON intake_notes;
CREATE POLICY intake_notes_access_policy ON intake_notes
  FOR ALL
  USING (
    has_intake_access(intake_id, current_setting('app.user_id', true))
  );

-- Policy for intake_uploads
DROP POLICY IF EXISTS intake_uploads_access_policy ON intake_uploads;
CREATE POLICY intake_uploads_access_policy ON intake_uploads
  FOR ALL
  USING (
    has_intake_access(intake_id, current_setting('app.user_id', true))
  );

-- Policy for intake_parties
DROP POLICY IF EXISTS intake_parties_access_policy ON intake_parties;
CREATE POLICY intake_parties_access_policy ON intake_parties
  FOR ALL
  USING (
    has_intake_access(intake_id, current_setting('app.user_id', true))
  );

-- Policy for intake_pi_details
DROP POLICY IF EXISTS intake_pi_details_access_policy ON intake_pi_details;
CREATE POLICY intake_pi_details_access_policy ON intake_pi_details
  FOR ALL
  USING (
    has_intake_access(intake_id, current_setting('app.user_id', true))
  );

-- Policy for intake_criminal_details
DROP POLICY IF EXISTS intake_criminal_details_access_policy ON intake_criminal_details;
CREATE POLICY intake_criminal_details_access_policy ON intake_criminal_details
  FOR ALL
  USING (
    has_intake_access(intake_id, current_setting('app.user_id', true))
  );

-- Policy for intake_employment_details
DROP POLICY IF EXISTS intake_employment_details_access_policy ON intake_employment_details;
CREATE POLICY intake_employment_details_access_policy ON intake_employment_details
  FOR ALL
  USING (
    has_intake_access(intake_id, current_setting('app.user_id', true))
  );

-- Policy for intake_tenant_details
DROP POLICY IF EXISTS intake_tenant_details_access_policy ON intake_tenant_details;
CREATE POLICY intake_tenant_details_access_policy ON intake_tenant_details
  FOR ALL
  USING (
    has_intake_access(intake_id, current_setting('app.user_id', true))
  );

-- Policy for intake_civil_details
DROP POLICY IF EXISTS intake_civil_details_access_policy ON intake_civil_details;
CREATE POLICY intake_civil_details_access_policy ON intake_civil_details
  FOR ALL
  USING (
    has_intake_access(intake_id, current_setting('app.user_id', true))
  );

-- Policy for terminal_sessions
DROP POLICY IF EXISTS terminal_sessions_access_policy ON terminal_sessions;
CREATE POLICY terminal_sessions_access_policy ON terminal_sessions
  FOR ALL
  USING (
    has_intake_access(intake_id, current_setting('app.user_id', true))
  );

-- Policy for terminal_messages (via session)
DROP POLICY IF EXISTS terminal_messages_access_policy ON terminal_messages;
CREATE POLICY terminal_messages_access_policy ON terminal_messages
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM terminal_sessions ts 
      WHERE ts.id = terminal_messages.session_id 
      AND has_intake_access(ts.intake_id, current_setting('app.user_id', true))
    )
  );

-- Policy for discovery_tasks
DROP POLICY IF EXISTS discovery_tasks_access_policy ON discovery_tasks;
CREATE POLICY discovery_tasks_access_policy ON discovery_tasks
  FOR ALL
  USING (
    has_intake_access(intake_id, current_setting('app.user_id', true))
  );

-- Policy for discovery_drafts
DROP POLICY IF EXISTS discovery_drafts_access_policy ON discovery_drafts;
CREATE POLICY discovery_drafts_access_policy ON discovery_drafts
  FOR ALL
  USING (
    has_intake_access(intake_id, current_setting('app.user_id', true))
  );

-- Policy for upload_text
DROP POLICY IF EXISTS upload_text_access_policy ON upload_text;
CREATE POLICY upload_text_access_policy ON upload_text
  FOR ALL
  USING (
    has_intake_access(intake_id, current_setting('app.user_id', true))
  );

-- Policy for case_memory (if exists)
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'case_memory') THEN
    EXECUTE 'DROP POLICY IF EXISTS case_memory_access_policy ON case_memory';
    EXECUTE 'CREATE POLICY case_memory_access_policy ON case_memory
      FOR ALL
      USING (
        has_intake_access(intake_id, current_setting(''app.user_id'', true))
      )';
  END IF;
END $$;

-- =====================================================
-- 6) GRANT SERVICE ROLE BYPASS
-- Service role should bypass RLS for admin operations
-- =====================================================

-- Note: In Supabase, the service_role key automatically bypasses RLS.
-- The anon key and authenticated users are subject to RLS policies.

-- =====================================================
-- 7) AUTO-GRANT ACCESS TO INTAKE CREATOR
-- When an intake is created, auto-grant access to the owner
-- =====================================================

-- Note: This would typically be handled in application code
-- since intakes can be created by anonymous users (public intake form)
-- and we may not have a user_id at creation time.

-- For admin users, access is granted via the is_admin() check.
-- For specific user assignments, use the intake_access table directly.

COMMENT ON TABLE intake_access IS 'Tracks which users have access to which intakes. Admins bypass this via is_admin() function.';
COMMENT ON FUNCTION is_admin(TEXT) IS 'Returns true if the user has admin role in the users table.';
COMMENT ON FUNCTION has_intake_access(INTEGER, TEXT) IS 'Returns true if user is admin OR has explicit access to the intake.';
