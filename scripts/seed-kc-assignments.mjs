import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

// KC Template Assignments - only include KCs that exist in kc_library
const kcTemplateAssignments = [
  { kc_id: "CIV_CA_FRAUD_INTENTIONAL", template_id: "T_CIV_CA_FRAUD" },
  { kc_id: "CIV_CA_FRAUD_NEGLIGENT_MISREP", template_id: "T_CIV_CA_FRAUD" },
  { kc_id: "CIV_CA_FRAUD_CONCEALMENT", template_id: "T_CIV_CA_FRAUD" },
  { kc_id: "CIV_CA_UCL_17200", template_id: "T_CIV_CA_UCL_FAL" },
  { kc_id: "CIV_CA_FAL_17500", template_id: "T_CIV_CA_UCL_FAL" },
  { kc_id: "CIV_CA_UNJUST_ENRICHMENT", template_id: "T_CIV_CA_CONTRACT" },
  { kc_id: "CIV_CA_QUANTUM_MERUIT", template_id: "T_CIV_CA_CONTRACT" },
  { kc_id: "CIV_CA_CONVERSION", template_id: "T_CIV_CA_CONTRACT" },
  { kc_id: "CIV_CA_TRESPASS_TO_CHATTELS", template_id: "T_CIV_CA_CONTRACT" },
  { kc_id: "CIV_CA_BREACH_CONTRACT", template_id: "T_CIV_CA_CONTRACT" },
  { kc_id: "CIV_CA_BREACH_IMPLIED_COVENANT", template_id: "T_CIV_CA_CONTRACT" },
  { kc_id: "CIV_CA_PROMISSORY_ESTOPPEL", template_id: "T_CIV_CA_CONTRACT" },
  { kc_id: "CIV_CA_NEGLIGENCE", template_id: "T_CIV_CA_NEGLIGENCE" },
  { kc_id: "CIV_CA_NEGLIGENCE_PER_SE", template_id: "T_CIV_CA_NEGLIGENCE" },
  { kc_id: "CIV_CA_PREMISES_LIABILITY", template_id: "T_CIV_CA_NEGLIGENCE" },
  { kc_id: "CIV_CA_PRODUCT_LIABILITY", template_id: "T_CIV_CA_PRODUCT_LIAB" },
  { kc_id: "CIV_CA_MEDICAL_MALPRACTICE", template_id: "T_CIV_CA_MED_MAL" },
  { kc_id: "CIV_CA_WRONGFUL_DEATH", template_id: "T_CIV_CA_NEGLIGENCE" },
  { kc_id: "CIV_CA_ASSAULT_CIVIL", template_id: "T_CIV_CA_NEGLIGENCE" },
  { kc_id: "CIV_CA_BATTERY_CIVIL", template_id: "T_CIV_CA_NEGLIGENCE" },
  { kc_id: "CIV_CA_FALSE_IMPRISONMENT_CIVIL", template_id: "T_CIV_CA_NEGLIGENCE" },
  { kc_id: "CIV_CA_IIED", template_id: "T_CIV_CA_NEGLIGENCE" },
  { kc_id: "CIV_CA_NIED", template_id: "T_CIV_CA_NEGLIGENCE" },
  { kc_id: "CIV_CA_NEGLIGENT_HIRING", template_id: "T_CIV_CA_NEGLIGENCE" },
  { kc_id: "CIV_CA_HABITABILITY_1941_1", template_id: "T_CIV_CA_TENANT_HABITABILITY" },
  { kc_id: "CIV_CA_RENT_DEMAND_1942_4", template_id: "T_CIV_CA_TENANT_HABITABILITY" },
  { kc_id: "CIV_CA_FEHA_12940", template_id: "T_CIV_CA_EMPLOYMENT_FEHA" },
  { kc_id: "CIV_CA_WHISTLEBLOWER_1102_5", template_id: "T_CIV_CA_EMPLOYMENT_FEHA" },
  { kc_id: "CIV_CA_PAGA_2698", template_id: "T_CIV_CA_WAGE_HOUR" },
  { kc_id: "CIV_CA_WAGE_HOUR", template_id: "T_CIV_CA_WAGE_HOUR" },
  { kc_id: "CIV_CA_WRONGFUL_TERMINATION_PP", template_id: "T_CIV_CA_EMPLOYMENT_FEHA" },
  { kc_id: "CIV_CA_DEFAMATION", template_id: "T_CIV_CA_FRAUD" },
  { kc_id: "CIV_CA_INVASION_PRIVACY", template_id: "T_CIV_CA_FRAUD" },
  { kc_id: "CIV_CA_CIVIL_RIGHTS_51_52", template_id: "T_CIV_CA_CIVIL_RIGHTS_UNRUH" },
  { kc_id: "CIV_FED_TITLE_VII", template_id: "T_CIV_FED_TITLEVII" },
  { kc_id: "CIV_FED_ADA", template_id: "T_CIV_FED_ADA" },
  { kc_id: "CIV_FED_ADEA", template_id: "T_CIV_FED_TITLEVII" },
  { kc_id: "CIV_FED_FMLA", template_id: "T_CIV_FED_TITLEVII" },
  { kc_id: "CIV_FED_FLSA", template_id: "T_CIV_FED_FLSA" },
  { kc_id: "CIV_FED_1983", template_id: "T_CIV_FED_1983" },
  { kc_id: "CIV_FED_1981", template_id: "T_CIV_FED_1983" },
  { kc_id: "CRIM_CA_MURDER_187", template_id: "T_CRIM_CA_MURDER" },
  { kc_id: "CRIM_CA_MANSLAUGHTER_192", template_id: "T_CRIM_CA_MURDER" },
  { kc_id: "CRIM_CA_ASSAULT_240", template_id: "T_CRIM_CA_ASSAULT_DW" },
  { kc_id: "CRIM_CA_BATTERY_242", template_id: "T_CRIM_CA_ASSAULT_DW" },
  { kc_id: "CRIM_CA_ADW_245", template_id: "T_CRIM_CA_ASSAULT_DW" },
  { kc_id: "CRIM_CA_ROBBERY_211", template_id: "T_CRIM_CA_ROBBERY" },
  { kc_id: "CRIM_CA_BURGLARY_459", template_id: "T_CRIM_CA_BURGLARY" },
  { kc_id: "CRIM_CA_THEFT_484", template_id: "T_CRIM_CA_THEFT" },
  { kc_id: "CRIM_CA_DUI_23152", template_id: "T_CRIM_CA_DUI" },
  { kc_id: "CRIM_CA_DRUG_POSS_11350", template_id: "T_CRIM_CA_DRUG_POSSESSION" },
  { kc_id: "CRIM_CA_DRUG_SALES_11351", template_id: "T_CRIM_FED_DRUG_841" },
  { kc_id: "CRIM_FED_CONSPIRACY_371", template_id: "T_CRIM_FED_CONSPIRACY" },
  { kc_id: "CRIM_FED_WIRE_FRAUD_1343", template_id: "T_CRIM_FED_FRAUD" },
  { kc_id: "CRIM_FED_DRUG_841", template_id: "T_CRIM_FED_DRUG_841" },
  { kc_id: "CRIM_FED_FIREARM_922", template_id: "T_CRIM_FED_922G" }
];

async function seedAssignments() {
  // First, get all existing kc_ids from kc_library
  const { data: existingKcs, error: kcErr } = await supabase.from('kc_library').select('kc_id');
  if (kcErr) {
    console.error('Error fetching kc_library: ' + kcErr.message);
    return;
  }
  
  const existingKcIds = new Set(existingKcs.map(kc => kc.kc_id));
  console.log('Found ' + existingKcIds.size + ' KCs in kc_library');
  
  // Filter assignments to only include KCs that exist
  const validAssignments = kcTemplateAssignments.filter(a => existingKcIds.has(a.kc_id));
  console.log('Valid assignments: ' + validAssignments.length + ' out of ' + kcTemplateAssignments.length);
  
  // Clear existing assignments
  const { error: delErr } = await supabase.from('kc_template_assignments').delete().neq('id', 0);
  if (delErr) {
    console.error('Error clearing assignments: ' + delErr.message);
  }
  
  // Insert valid assignments
  let successCount = 0;
  for (const assignment of validAssignments) {
    const { error } = await supabase.from('kc_template_assignments').insert({
      kc_id: assignment.kc_id,
      template_id: assignment.template_id
    });
    
    if (error) {
      console.error('Error inserting assignment for ' + assignment.kc_id + ': ' + error.message);
    } else {
      successCount++;
    }
  }
  
  console.log('Successfully inserted ' + successCount + ' assignments');
  
  // Verify count
  const { count } = await supabase.from('kc_template_assignments').select('*', { count: 'exact', head: true });
  console.log('KC Template Assignments now has ' + count + ' entries');
}

seedAssignments();
