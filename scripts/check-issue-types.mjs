import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function checkIssueTypes() {
  console.log("Checking issue_types table...\n");

  // First, check if the table exists
  const { data, error } = await supabase
    .from("issue_types")
    .select("*")
    .order("practice_area")
    .order("name");

  if (error) {
    console.error("Error querying issue_types:", error.message);
    return;
  }

  console.log(`Found ${data.length} issue types total\n`);

  // Group by practice area
  const byPracticeArea = {};
  for (const item of data) {
    if (!byPracticeArea[item.practice_area]) {
      byPracticeArea[item.practice_area] = [];
    }
    byPracticeArea[item.practice_area].push(item);
  }

  // Print summary
  const practiceAreas = ["personal_injury", "criminal_defense", "employment_law", "tenant_rights", "civil_litigation"];
  
  for (const area of practiceAreas) {
    const items = byPracticeArea[area] || [];
    console.log(`${area}: ${items.length} issue types`);
    if (items.length > 0) {
      for (const item of items) {
        console.log(`  - ${item.name} (id: ${item.id})`);
      }
    }
    console.log("");
  }
}

checkIssueTypes();
