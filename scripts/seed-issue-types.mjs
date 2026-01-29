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

// Required issue types per practice area (as specified in requirements)
const REQUIRED_ISSUE_TYPES = {
  criminal_defense: [
    { name: "DUI/DWI Defense", description: "Driving under the influence charges" },
    { name: "Drug Crimes", description: "Drug possession, distribution, or manufacturing" },
    { name: "Theft Crimes", description: "Theft, burglary, robbery charges" },
    { name: "Assault & Battery", description: "Physical violence charges" },
    { name: "Domestic Violence", description: "Domestic violence allegations" },
    { name: "Weapons Charges", description: "Illegal possession or use of weapons" },
    { name: "Fraud & White Collar Crimes", description: "Fraud, embezzlement, or financial crimes" },
    { name: "Expungement", description: "Clearing criminal record" },
    { name: "Juvenile Crimes", description: "Criminal matters involving minors" },
    { name: "Probation Violations", description: "Alleged violation of probation terms" },
    { name: "Traffic Violations", description: "Traffic-related criminal charges" },
    { name: "Federal Crimes", description: "Federal criminal charges" },
    { name: "Restraining Order Defense", description: "Defense against restraining orders" },
    { name: "Other Criminal Matter", description: "Other criminal defense matter" },
  ],
  personal_injury: [
    { name: "Car Accidents", description: "Car, truck, or vehicle collision" },
    { name: "Motorcycle Accidents", description: "Motorcycle collision injuries" },
    { name: "Pedestrian & Crosswalk Accidents", description: "Pedestrian struck by vehicle" },
    { name: "Truck Accidents", description: "Commercial truck collision" },
    { name: "Premises Liability / Slip and Fall", description: "Injury from falling on someone else's property" },
    { name: "Ride Share Accidents", description: "Uber, Lyft, or other rideshare accidents" },
    { name: "Hit & Run Accidents", description: "Accidents involving fleeing drivers" },
    { name: "Wrongful Death", description: "Death caused by another party's negligence" },
    { name: "Other Personal Injury", description: "Other type of personal injury" },
  ],
  employment_law: [
    { name: "Wrongful Termination", description: "Illegal firing or layoff" },
    { name: "Wage & Hour Claims", description: "Unpaid wages, overtime, or meal breaks" },
    { name: "Sexual Harassment", description: "Unwanted sexual conduct in the workplace" },
    { name: "Discrimination", description: "Workplace discrimination based on protected class" },
    { name: "Retaliation", description: "Punishment for reporting violations" },
    { name: "Severance Negotiation", description: "Negotiating severance packages" },
    { name: "Other Employment Matter", description: "Other employment law issue" },
  ],
  tenant_rights: [
    { name: "Unlawful Eviction", description: "Illegal eviction or lockout" },
    { name: "Illegal Rent Increases", description: "Rent increases violating law" },
    { name: "Housing Discrimination", description: "Discrimination in housing" },
    { name: "Lease Violations & Disputes", description: "Landlord violating lease terms" },
    { name: "Uninhabitable Conditions", description: "Unsafe or uninhabitable living conditions" },
    { name: "Rent Control Violations", description: "Violations of rent control laws" },
    { name: "Other Tenant Issue", description: "Other tenant rights matter" },
  ],
  civil_litigation: [
    { name: "Civil Disputes", description: "General civil disputes" },
    { name: "Business Disputes", description: "Partnership or business disagreements" },
    { name: "Landlord/Tenant Disputes", description: "Disputes between landlords and tenants" },
    { name: "Restraining Orders", description: "Obtaining or defending restraining orders" },
    { name: "Administrative Hearings", description: "Government administrative proceedings" },
    { name: "Other Civil Matter", description: "Other civil litigation matter" },
  ],
};

async function seedIssueTypes() {
  console.log("Seeding issue types...\n");

  // First, get existing issue types
  const { data: existing, error: fetchError } = await supabase
    .from("issue_types")
    .select("*");

  if (fetchError) {
    console.error("Error fetching existing issue types:", fetchError.message);
    return;
  }

  console.log(`Found ${existing.length} existing issue types\n`);

  // Create a map of existing types by practice_area + name
  const existingMap = new Map();
  for (const item of existing) {
    const key = `${item.practice_area}:${item.name.toLowerCase()}`;
    existingMap.set(key, item);
  }

  // Insert missing issue types
  let insertCount = 0;
  for (const [practiceArea, types] of Object.entries(REQUIRED_ISSUE_TYPES)) {
    console.log(`Processing ${practiceArea}...`);
    
    for (const type of types) {
      const key = `${practiceArea}:${type.name.toLowerCase()}`;
      
      if (!existingMap.has(key)) {
        console.log(`  Adding: ${type.name}`);
        
        const { error: insertError } = await supabase
          .from("issue_types")
          .insert({
            practice_area: practiceArea,
            name: type.name,
            description: type.description,
          });

        if (insertError) {
          console.error(`  Error inserting ${type.name}:`, insertError.message);
        } else {
          insertCount++;
        }
      } else {
        console.log(`  Already exists: ${type.name}`);
      }
    }
    console.log("");
  }

  console.log(`\nInserted ${insertCount} new issue types`);

  // Verify final counts
  console.log("\n=== Final Issue Type Counts ===\n");
  
  const { data: final } = await supabase
    .from("issue_types")
    .select("*")
    .order("practice_area")
    .order("name");

  const byPracticeArea = {};
  for (const item of final) {
    if (!byPracticeArea[item.practice_area]) {
      byPracticeArea[item.practice_area] = [];
    }
    byPracticeArea[item.practice_area].push(item);
  }

  for (const [area, items] of Object.entries(byPracticeArea)) {
    console.log(`${area}: ${items.length} issue types`);
    for (const item of items) {
      console.log(`  - ${item.name} (id: ${item.id})`);
    }
    console.log("");
  }
}

seedIssueTypes();
