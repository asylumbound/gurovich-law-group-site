-- Migration: Move all TiDB tables to Supabase PostgreSQL
-- This migration creates tables in Supabase that mirror the TiDB schema
-- Data will be migrated separately

-- 1. Users table (replaces TiDB users table)
CREATE TABLE IF NOT EXISTS public.users (
  id BIGSERIAL PRIMARY KEY,
  open_id VARCHAR(64) NOT NULL UNIQUE,
  name TEXT,
  email VARCHAR(320),
  login_method VARCHAR(64),
  role VARCHAR(20) NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  last_signed_in TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_users_open_id ON public.users(open_id);
CREATE INDEX idx_users_role ON public.users(role);

-- 2. Terminal Sessions table
CREATE TABLE IF NOT EXISTS public.terminal_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR(255) NOT NULL,
  intake_id INTEGER NOT NULL,
  title VARCHAR(500),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_terminal_sessions_user_id ON public.terminal_sessions(user_id);
CREATE INDEX idx_terminal_sessions_intake_id ON public.terminal_sessions(intake_id);

-- 3. Terminal Messages table
CREATE TABLE IF NOT EXISTS public.terminal_messages (
  id BIGSERIAL PRIMARY KEY,
  session_id UUID NOT NULL REFERENCES public.terminal_sessions(id) ON DELETE CASCADE,
  role VARCHAR(20) NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  citations JSONB,
  suggested_actions JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_terminal_messages_session_id ON public.terminal_messages(session_id);

-- 4. Upload Text table
CREATE TABLE IF NOT EXISTS public.upload_text (
  id BIGSERIAL PRIMARY KEY,
  intake_id INTEGER NOT NULL,
  upload_id INTEGER NOT NULL,
  file_name VARCHAR(500),
  extracted_text TEXT,
  word_count INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_upload_text_intake_id ON public.upload_text(intake_id);
CREATE INDEX idx_upload_text_upload_id ON public.upload_text(upload_id);

-- 5. Discovery Tasks table
CREATE TABLE IF NOT EXISTS public.discovery_tasks (
  id BIGSERIAL PRIMARY KEY,
  intake_id INTEGER NOT NULL,
  user_id VARCHAR(255) NOT NULL,
  title VARCHAR(500) NOT NULL,
  description TEXT,
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
  due_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_discovery_tasks_intake_id ON public.discovery_tasks(intake_id);
CREATE INDEX idx_discovery_tasks_user_id ON public.discovery_tasks(user_id);
CREATE INDEX idx_discovery_tasks_status ON public.discovery_tasks(status);

-- 6. Discovery Drafts table
CREATE TABLE IF NOT EXISTS public.discovery_drafts (
  id BIGSERIAL PRIMARY KEY,
  intake_id INTEGER NOT NULL,
  user_id VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL,
  title VARCHAR(500),
  content JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_discovery_drafts_intake_id ON public.discovery_drafts(intake_id);
CREATE INDEX idx_discovery_drafts_user_id ON public.discovery_drafts(user_id);

-- 7. Intake Access table
CREATE TABLE IF NOT EXISTS public.intake_access (
  id BIGSERIAL PRIMARY KEY,
  intake_id INTEGER NOT NULL,
  user_id VARCHAR(255) NOT NULL,
  access_level VARCHAR(20) NOT NULL DEFAULT 'read',
  granted_by VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_intake_access_intake_id ON public.intake_access(intake_id);
CREATE INDEX idx_intake_access_user_id ON public.intake_access(user_id);

-- Enable RLS on all new tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.terminal_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.terminal_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.upload_text ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.discovery_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.discovery_drafts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.intake_access ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can view their own profile"
  ON public.users FOR SELECT
  USING (auth.uid()::text = open_id);

CREATE POLICY "Admins can view all users"
  ON public.users FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE open_id = auth.uid()::text AND role = 'admin'
    )
  );

-- RLS Policies for terminal_sessions
CREATE POLICY "Users can view their own sessions"
  ON public.terminal_sessions FOR SELECT
  USING (user_id = auth.uid()::text);

CREATE POLICY "Users can create sessions"
  ON public.terminal_sessions FOR INSERT
  WITH CHECK (user_id = auth.uid()::text);

-- RLS Policies for terminal_messages
CREATE POLICY "Users can view messages in their sessions"
  ON public.terminal_messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.terminal_sessions
      WHERE id = session_id AND user_id = auth.uid()::text
    )
  );

CREATE POLICY "Users can create messages in their sessions"
  ON public.terminal_messages FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.terminal_sessions
      WHERE id = session_id AND user_id = auth.uid()::text
    )
  );

-- RLS Policies for discovery_tasks
CREATE POLICY "Users can view their own tasks"
  ON public.discovery_tasks FOR SELECT
  USING (user_id = auth.uid()::text);

CREATE POLICY "Users can create tasks"
  ON public.discovery_tasks FOR INSERT
  WITH CHECK (user_id = auth.uid()::text);

-- RLS Policies for discovery_drafts
CREATE POLICY "Users can view their own drafts"
  ON public.discovery_drafts FOR SELECT
  USING (user_id = auth.uid()::text);

CREATE POLICY "Users can create drafts"
  ON public.discovery_drafts FOR INSERT
  WITH CHECK (user_id = auth.uid()::text);

-- RLS Policies for intake_access
CREATE POLICY "Users can view their access records"
  ON public.intake_access FOR SELECT
  USING (user_id = auth.uid()::text);

CREATE POLICY "Admins can manage access"
  ON public.intake_access FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE open_id = auth.uid()::text AND role = 'admin'
    )
  );
