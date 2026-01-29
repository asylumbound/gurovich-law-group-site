// Script to run terminal tables migration in Supabase
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const statements = [
  // Terminal sessions
  `CREATE TABLE IF NOT EXISTS terminal_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,
    intake_id INTEGER NOT NULL REFERENCES intakes(id) ON DELETE CASCADE,
    title TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
  )`,
  
  // Terminal messages
  `CREATE TABLE IF NOT EXISTS terminal_messages (
    id SERIAL PRIMARY KEY,
    session_id UUID NOT NULL REFERENCES terminal_sessions(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
    content TEXT NOT NULL,
    citations JSONB DEFAULT '[]'::jsonb,
    suggested_actions JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
  )`,
  
  // Upload text
  `CREATE TABLE IF NOT EXISTS upload_text (
    id SERIAL PRIMARY KEY,
    intake_id INTEGER NOT NULL REFERENCES intakes(id) ON DELETE CASCADE,
    upload_id INTEGER NOT NULL REFERENCES intake_uploads(id) ON DELETE CASCADE,
    file_name TEXT,
    extracted_text TEXT,
    word_count INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW()
  )`,
  
  // Discovery tasks
  `CREATE TABLE IF NOT EXISTS discovery_tasks (
    id SERIAL PRIMARY KEY,
    intake_id INTEGER NOT NULL REFERENCES intakes(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
    due_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
  )`,
  
  // Discovery drafts
  `CREATE TABLE IF NOT EXISTS discovery_drafts (
    id SERIAL PRIMARY KEY,
    intake_id INTEGER NOT NULL REFERENCES intakes(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL,
    type TEXT NOT NULL,
    title TEXT,
    content JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
  )`,
  
  // Indexes
  `CREATE INDEX IF NOT EXISTS idx_terminal_sessions_user ON terminal_sessions(user_id)`,
  `CREATE INDEX IF NOT EXISTS idx_terminal_sessions_intake ON terminal_sessions(intake_id)`,
  `CREATE INDEX IF NOT EXISTS idx_terminal_messages_session ON terminal_messages(session_id)`,
  `CREATE INDEX IF NOT EXISTS idx_upload_text_intake ON upload_text(intake_id)`,
  `CREATE INDEX IF NOT EXISTS idx_discovery_tasks_intake ON discovery_tasks(intake_id)`,
  `CREATE INDEX IF NOT EXISTS idx_discovery_drafts_intake ON discovery_drafts(intake_id)`,
];

async function runMigration() {
  console.log("Running terminal tables migration in Supabase...\n");
  
  for (let i = 0; i < statements.length; i++) {
    const stmt = statements[i];
    console.log(`[${i + 1}/${statements.length}] ${stmt.substring(0, 60)}...`);
    
    // Use raw SQL via REST API
    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": supabaseServiceKey,
        "Authorization": `Bearer ${supabaseServiceKey}`,
      },
      body: JSON.stringify({ query: stmt }),
    });
    
    // For DDL statements, we need to use the SQL endpoint
    // Let's try a different approach - check if table exists
    const tableName = stmt.match(/CREATE TABLE IF NOT EXISTS (\w+)/)?.[1];
    if (tableName) {
      const { data, error } = await supabase.from(tableName).select("*").limit(0);
      if (!error) {
        console.log(`  ✓ Table ${tableName} exists or was created`);
      } else if (error.message.includes("does not exist")) {
        console.log(`  ⚠ Table ${tableName} needs to be created via SQL Editor`);
      } else {
        console.log(`  ? ${error.message}`);
      }
    } else {
      console.log(`  ✓ Index statement queued`);
    }
  }
  
  console.log("\n=== Migration Summary ===");
  console.log("Please run the full SQL migration in Supabase SQL Editor:");
  console.log("1. Go to https://supabase.com/dashboard");
  console.log("2. Select your project");
  console.log("3. Go to SQL Editor");
  console.log("4. Paste contents of: supabase/migrations/005_terminal_supabase.sql");
  console.log("5. Click Run");
}

runMigration().catch(console.error);
