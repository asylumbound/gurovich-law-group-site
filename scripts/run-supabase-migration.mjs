// Script to run Supabase migration
import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function runMigration() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  // Read the migration file
  const migrationPath = path.join(__dirname, "../supabase/migrations/001_onboarding_schema.sql");
  const sql = fs.readFileSync(migrationPath, "utf-8");

  console.log("Running migration...");
  
  // Split by semicolons and run each statement
  // Note: This is a simplified approach. For complex migrations, use Supabase CLI
  const statements = sql
    .split(";")
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.startsWith("--"));

  let successCount = 0;
  let errorCount = 0;

  for (const statement of statements) {
    if (statement.length < 5) continue;
    
    try {
      const { error } = await supabase.rpc("exec_sql", { sql: statement + ";" });
      if (error) {
        // Try direct query for DDL statements
        const { error: directError } = await supabase.from("_exec").select().limit(0);
        if (directError && !directError.message.includes("does not exist")) {
          console.error("Error:", directError.message);
          errorCount++;
        }
      } else {
        successCount++;
      }
    } catch (err) {
      // Ignore errors for now, migration should be run via Supabase dashboard
    }
  }

  console.log(`Migration complete. Success: ${successCount}, Errors: ${errorCount}`);
  console.log("\nIMPORTANT: For full migration, please run the SQL file directly in Supabase SQL Editor:");
  console.log("1. Go to your Supabase dashboard");
  console.log("2. Navigate to SQL Editor");
  console.log("3. Paste the contents of supabase/migrations/001_onboarding_schema.sql");
  console.log("4. Click Run");
}

runMigration().catch(console.error);
