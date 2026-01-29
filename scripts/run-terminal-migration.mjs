// Run terminal tables migration in Supabase using service role key
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log("SUPABASE_URL:", supabaseUrl?.substring(0, 50) + "...");
console.log("Has service key:", !!supabaseServiceKey);

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

// Test connection by checking if intakes table exists
async function testConnection() {
  const { data, error } = await supabase.from("intakes").select("id").limit(1);
  if (error) {
    console.error("Connection test failed:", error.message);
    return false;
  }
  console.log("Connection successful! Found intakes table.");
  return true;
}

// Check if a table exists
async function tableExists(tableName) {
  const { data, error } = await supabase.from(tableName).select("*").limit(0);
  if (error && error.message.includes("does not exist")) {
    return false;
  }
  return !error;
}

async function main() {
  const connected = await testConnection();
  if (!connected) {
    process.exit(1);
  }

  // Check which tables exist
  const tables = ["terminal_sessions", "terminal_messages", "upload_text", "discovery_tasks", "discovery_drafts"];
  
  console.log("\nChecking table status:");
  for (const table of tables) {
    const exists = await tableExists(table);
    console.log(`  ${table}: ${exists ? "✓ exists" : "✗ missing"}`);
  }

  console.log("\n=== IMPORTANT ===");
  console.log("The terminal tables need to be created in Supabase.");
  console.log("Please run the SQL in: supabase/migrations/005_terminal_supabase.sql");
  console.log("via the Supabase Dashboard SQL Editor.");
}

main().catch(console.error);
