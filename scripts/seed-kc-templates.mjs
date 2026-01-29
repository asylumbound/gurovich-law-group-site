import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

// KC Templates data
const kcTemplates = [
  {
    template_id: "T_CIV_CA_FRAUD",
    name: "CA Civil Fraud / Misrepresentation (general)",
    domain: "civil",
    jurisdiction: "CA",
    elements: [
      { element_key: "FRAUD_REPRESENTATION_OR_CONCEALMENT", element_text: "Misrepresentation (false statement) or concealment of a material fact", evidence_type_codes: ["EVID_DOCS_COMMUNICATIONS", "EVID_DOCS_CONTRACTS", "EVID_DIGITAL_FORENSICS", "EVID_WITNESS_LAY", "EVID_CHAIN_CUSTODY"] },
      { element_key: "FRAUD_KNOWLEDGE_INTENT", element_text: "Knowledge of falsity (or reckless disregard) and intent to induce reliance", evidence_type_codes: ["EVID_DOCS_COMMUNICATIONS", "EVID_DOCS_FINANCIAL", "EVID_WITNESS_LAY", "EVID_DIGITAL_FORENSICS"] },
      { element_key: "FRAUD_JUSTIFIABLE_RELIANCE", element_text: "Justifiable reliance", evidence_type_codes: ["EVID_DOCS_CONTRACTS", "EVID_DOCS_COMMUNICATIONS", "EVID_WITNESS_LAY"] },
      { element_key: "FRAUD_DAMAGES_CAUSATION", element_text: "Damages and causation (loss caused by reliance)", evidence_type_codes: ["EVID_DOCS_FINANCIAL", "EVID_WITNESS_EXPERT", "EVID_DOCS_COMMUNICATIONS"] }
    ]
  },
  {
    template_id: "T_CIV_CA_UCL_FAL",
    name: "CA UCL/FAL (17200/17500) (general)",
    domain: "civil",
    jurisdiction: "CA",
    elements: [
      { element_key: "UCL_UNLAWFUL_UNFAIR_FRAUDULENT", element_text: "Unlawful, unfair, or fraudulent business act/practice; or false/misleading advertising", evidence_type_codes: ["EVID_DOCS_COMMUNICATIONS", "EVID_DOCS_POLICIES", "EVID_DOCS_CONTRACTS", "EVID_DIGITAL_FORENSICS", "EVID_WITNESS_LAY"] },
      { element_key: "UCL_STANDING_LOSS", element_text: "Standing and economic injury / loss of money or property", evidence_type_codes: ["EVID_DOCS_FINANCIAL", "EVID_DOCS_COMMUNICATIONS"] },
      { element_key: "UCL_REMEDY_RESTITUTION_INJUNCTION", element_text: "Appropriate equitable remedy (restitution / injunction) supported by facts", evidence_type_codes: ["EVID_DOCS_FINANCIAL", "EVID_WITNESS_EXPERT"] }
    ]
  },
  {
    template_id: "T_CIV_CA_CONTRACT",
    name: "CA Contract (breach / implied covenant / promissory estoppel)",
    domain: "civil",
    jurisdiction: "CA",
    elements: [
      { element_key: "CONTRACT_FORMATION", element_text: "Existence of contract (or enforceable promise) and plaintiff performance/excuse", evidence_type_codes: ["EVID_DOCS_CONTRACTS", "EVID_DOCS_COMMUNICATIONS", "EVID_WITNESS_LAY", "EVID_CHAIN_CUSTODY"] },
      { element_key: "CONTRACT_BREACH", element_text: "Breach (failure to perform / interference)", evidence_type_codes: ["EVID_DOCS_COMMUNICATIONS", "EVID_DOCS_CONTRACTS", "EVID_DOCS_POLICIES", "EVID_WITNESS_LAY"] },
      { element_key: "CONTRACT_DAMAGES", element_text: "Damages caused by breach", evidence_type_codes: ["EVID_DOCS_FINANCIAL", "EVID_WITNESS_EXPERT"] }
    ]
  },
  {
    template_id: "T_CIV_CA_NEGLIGENCE",
    name: "CA Negligence / Premises (general)",
    domain: "civil",
    jurisdiction: "CA",
    elements: [
      { element_key: "NEGL_DUTY", element_text: "Duty of care owed", evidence_type_codes: ["EVID_DOCS_POLICIES", "EVID_WITNESS_LAY", "EVID_GOV_RECORDS"] },
      { element_key: "NEGL_BREACH", element_text: "Breach of duty (act/omission below standard of care)", evidence_type_codes: ["EVID_SURVEILLANCE", "EVID_PHYSICAL", "EVID_CONDITION_INSPECTION", "EVID_WITNESS_LAY", "EVID_DOCS_POLICIES"] },
      { element_key: "NEGL_CAUSATION", element_text: "Causation (actual + proximate)", evidence_type_codes: ["EVID_WITNESS_EXPERT", "EVID_DOCS_MEDICAL", "EVID_SURVEILLANCE", "EVID_WITNESS_LAY"] },
      { element_key: "NEGL_DAMAGES", element_text: "Damages (economic and/or non-economic)", evidence_type_codes: ["EVID_DOCS_MEDICAL", "EVID_DOCS_FINANCIAL", "EVID_WITNESS_EXPERT"] }
    ]
  },
  {
    template_id: "T_CIV_CA_PRODUCT_LIAB",
    name: "CA Product Liability (strict liability) (general)",
    domain: "civil",
    jurisdiction: "CA",
    elements: [
      { element_key: "PROD_DEFECT", element_text: "Product defect (design/manufacture/failure-to-warn theory)", evidence_type_codes: ["EVID_PHYSICAL", "EVID_WITNESS_EXPERT", "EVID_DOCS_POLICIES", "EVID_CHAIN_CUSTODY"] },
      { element_key: "PROD_USE_FORESEEABLE", element_text: "Foreseeable use or misuse", evidence_type_codes: ["EVID_WITNESS_LAY", "EVID_DOCS_COMMUNICATIONS"] },
      { element_key: "PROD_CAUSATION_DAMAGES", element_text: "Causation and damages", evidence_type_codes: ["EVID_DOCS_MEDICAL", "EVID_WITNESS_EXPERT", "EVID_DOCS_FINANCIAL"] }
    ]
  },
  {
    template_id: "T_CIV_CA_MED_MAL",
    name: "CA Medical Malpractice (general)",
    domain: "civil",
    jurisdiction: "CA",
    elements: [
      { element_key: "MEDMAL_DUTY_STANDARD", element_text: "Provider duty and applicable standard of care", evidence_type_codes: ["EVID_DOCS_MEDICAL", "EVID_WITNESS_EXPERT"] },
      { element_key: "MEDMAL_BREACH", element_text: "Breach of standard of care", evidence_type_codes: ["EVID_DOCS_MEDICAL", "EVID_WITNESS_EXPERT"] },
      { element_key: "MEDMAL_CAUSATION", element_text: "Causation", evidence_type_codes: ["EVID_DOCS_MEDICAL", "EVID_WITNESS_EXPERT"] },
      { element_key: "MEDMAL_DAMAGES", element_text: "Damages", evidence_type_codes: ["EVID_DOCS_MEDICAL", "EVID_DOCS_FINANCIAL", "EVID_WITNESS_EXPERT"] }
    ]
  },
  {
    template_id: "T_CIV_CA_TENANT_HABITABILITY",
    name: "CA Habitability / Substandard Conditions (general)",
    domain: "civil",
    jurisdiction: "CA",
    elements: [
      { element_key: "TENANT_CONDITIONS_SUBSTANDARD", element_text: "Substandard / untenantable conditions existed", evidence_type_codes: ["EVID_DOCS_HOUSING", "EVID_CONDITION_INSPECTION", "EVID_PHYSICAL", "EVID_GOV_RECORDS"] },
      { element_key: "TENANT_NOTICE", element_text: "Landlord had notice or should have known; opportunity to repair", evidence_type_codes: ["EVID_NOTICE_DEMANDS", "EVID_DOCS_COMMUNICATIONS", "EVID_WITNESS_LAY"] },
      { element_key: "TENANT_FAILURE_TO_REPAIR", element_text: "Failure to repair / remediate within reasonable time", evidence_type_codes: ["EVID_DOCS_HOUSING", "EVID_DOCS_COMMUNICATIONS", "EVID_WITNESS_LAY"] },
      { element_key: "TENANT_DAMAGES", element_text: "Damages (rent abatement, out-of-pocket, relocation, distress, etc.)", evidence_type_codes: ["EVID_DOCS_FINANCIAL", "EVID_WITNESS_LAY", "EVID_WITNESS_EXPERT"] }
    ]
  },
  {
    template_id: "T_CIV_CA_EMPLOYMENT_FEHA",
    name: "CA FEHA (discrimination/harassment/retaliation) (general)",
    domain: "civil",
    jurisdiction: "CA",
    elements: [
      { element_key: "EMP_PROTECTED_CLASS_OR_ACTIVITY", element_text: "Protected characteristic and/or protected activity", evidence_type_codes: ["EVID_DOCS_EMPLOYMENT", "EVID_WITNESS_LAY", "EVID_DOCS_COMMUNICATIONS"] },
      { element_key: "EMP_ADVERSE_ACTION_OR_HARASSMENT", element_text: "Adverse employment action and/or severe/pervasive harassment", evidence_type_codes: ["EVID_DOCS_EMPLOYMENT", "EVID_DOCS_COMMUNICATIONS", "EVID_WITNESS_LAY"] },
      { element_key: "EMP_CAUSATION", element_text: "Causation (link between protected status/activity and adverse action)", evidence_type_codes: ["EVID_DOCS_COMMUNICATIONS", "EVID_DOCS_EMPLOYMENT", "EVID_DIGITAL_FORENSICS", "EVID_WITNESS_LAY"] },
      { element_key: "EMP_DAMAGES", element_text: "Damages (back pay, emotional distress, etc.)", evidence_type_codes: ["EVID_DOCS_FINANCIAL", "EVID_DOCS_EMPLOYMENT", "EVID_WITNESS_EXPERT"] }
    ]
  },
  {
    template_id: "T_CIV_CA_WAGE_HOUR",
    name: "CA Wage & Hour (general)",
    domain: "civil",
    jurisdiction: "CA",
    elements: [
      { element_key: "WH_EMPLOYMENT_RELATIONSHIP", element_text: "Employment relationship and coverage/non-exempt status (or misclassification)", evidence_type_codes: ["EVID_DOCS_EMPLOYMENT", "EVID_DOCS_POLICIES", "EVID_WITNESS_LAY"] },
      { element_key: "WH_HOURS_WORKED", element_text: "Hours worked (timekeeping reliability; off-the-clock issues)", evidence_type_codes: ["EVID_DOCS_EMPLOYMENT", "EVID_DIGITAL_FORENSICS", "EVID_WITNESS_LAY"] },
      { element_key: "WH_VIOLATION", element_text: "Violation (OT, meal/rest, wage statements, minimum wage, etc.)", evidence_type_codes: ["EVID_DOCS_EMPLOYMENT", "EVID_DOCS_POLICIES", "EVID_WITNESS_EXPERT"] },
      { element_key: "WH_DAMAGES_PENALTIES", element_text: "Damages/penalties (wages owed, premiums, statutory penalties)", evidence_type_codes: ["EVID_DOCS_FINANCIAL", "EVID_WITNESS_EXPERT", "EVID_DOCS_EMPLOYMENT"] }
    ]
  },
  {
    template_id: "T_CIV_CA_CIVIL_RIGHTS_UNRUH",
    name: "CA Unruh Act (general)",
    domain: "civil",
    jurisdiction: "CA",
    elements: [
      { element_key: "UNRUH_BUSINESS_ESTABLISHMENT", element_text: "Defendant is a business establishment offering goods/services", evidence_type_codes: ["EVID_GOV_RECORDS", "EVID_DOCS_CONTRACTS", "EVID_DOCS_COMMUNICATIONS"] },
      { element_key: "UNRUH_DENIAL_OR_DISCRIMINATION", element_text: "Denial of full and equal accommodations due to protected status", evidence_type_codes: ["EVID_WITNESS_LAY", "EVID_SURVEILLANCE", "EVID_DOCS_COMMUNICATIONS"] },
      { element_key: "UNRUH_DAMAGES", element_text: "Damages/statutory damages as applicable", evidence_type_codes: ["EVID_DOCS_FINANCIAL", "EVID_WITNESS_LAY"] }
    ]
  },
  {
    template_id: "T_CIV_CA_BANE",
    name: "CA Bane Act (general)",
    domain: "civil",
    jurisdiction: "CA",
    elements: [
      { element_key: "BANE_RIGHTS_INTERFERENCE", element_text: "Interference or attempted interference with rights", evidence_type_codes: ["EVID_WITNESS_LAY", "EVID_SURVEILLANCE", "EVID_GOV_RECORDS"] },
      { element_key: "BANE_THREATS_INTIMIDATION_COERCION", element_text: "Threats, intimidation, or coercion (separate from underlying violation, as applicable)", evidence_type_codes: ["EVID_DOCS_COMMUNICATIONS", "EVID_SURVEILLANCE", "EVID_WITNESS_LAY"] },
      { element_key: "BANE_DAMAGES", element_text: "Damages", evidence_type_codes: ["EVID_DOCS_FINANCIAL", "EVID_WITNESS_EXPERT"] }
    ]
  },
  {
    template_id: "T_CIV_CA_CLRA",
    name: "CA CLRA (general)",
    domain: "civil",
    jurisdiction: "CA",
    elements: [
      { element_key: "CLRA_CONSUMER_TRANSACTION", element_text: "Consumer transaction (goods/services for personal/family/household use)", evidence_type_codes: ["EVID_DOCS_CONTRACTS", "EVID_DOCS_COMMUNICATIONS"] },
      { element_key: "CLRA_PROHIBITED_PRACTICE", element_text: "Prohibited unfair/deceptive practice", evidence_type_codes: ["EVID_DOCS_COMMUNICATIONS", "EVID_DIGITAL_FORENSICS", "EVID_WITNESS_LAY"] },
      { element_key: "CLRA_CAUSATION_DAMAGES", element_text: "Causation and damages", evidence_type_codes: ["EVID_DOCS_FINANCIAL", "EVID_WITNESS_EXPERT"] }
    ]
  },
  {
    template_id: "T_CIV_CA_ANTISLAPP",
    name: "CA Anti-SLAPP (procedural) (general)",
    domain: "civil",
    jurisdiction: "CA",
    elements: [
      { element_key: "ASLAPP_PROTECTED_ACTIVITY", element_text: "Challenged claim arises from protected activity", evidence_type_codes: ["EVID_DOCS_COMMUNICATIONS", "EVID_GOV_RECORDS", "EVID_WITNESS_LAY"] },
      { element_key: "ASLAPP_PROBABILITY_OF_PREVAILING", element_text: "Plaintiff can/cannot show probability of prevailing (merits snapshot)", evidence_type_codes: ["EVID_DOCS_CONTRACTS", "EVID_DOCS_FINANCIAL", "EVID_WITNESS_LAY", "EVID_WITNESS_EXPERT"] }
    ]
  },
  {
    template_id: "T_CIV_FED_1983",
    name: "Federal §1983 (general)",
    domain: "civil",
    jurisdiction: "FED",
    elements: [
      { element_key: "1983_UNDER_COLOR_OF_LAW", element_text: "Defendant acted under color of state law", evidence_type_codes: ["EVID_GOV_RECORDS", "EVID_SURVEILLANCE", "EVID_WITNESS_LAY"] },
      { element_key: "1983_RIGHT_DEPRIVATION", element_text: "Deprivation of a constitutional/federal right", evidence_type_codes: ["EVID_GOV_RECORDS", "EVID_SURVEILLANCE", "EVID_DOCS_COMMUNICATIONS", "EVID_WITNESS_LAY"] },
      { element_key: "1983_CAUSATION_DAMAGES", element_text: "Causation and damages", evidence_type_codes: ["EVID_DOCS_FINANCIAL", "EVID_DOCS_MEDICAL", "EVID_WITNESS_EXPERT"] }
    ]
  },
  {
    template_id: "T_CIV_FED_TITLEVII",
    name: "Federal Title VII (general)",
    domain: "civil",
    jurisdiction: "FED",
    elements: [
      { element_key: "TVII_PROTECTED_CLASS", element_text: "Protected class membership", evidence_type_codes: ["EVID_DOCS_EMPLOYMENT", "EVID_WITNESS_LAY"] },
      { element_key: "TVII_ADVERSE_ACTION", element_text: "Adverse employment action (or hostile work environment theory)", evidence_type_codes: ["EVID_DOCS_EMPLOYMENT", "EVID_DOCS_COMMUNICATIONS", "EVID_WITNESS_LAY"] },
      { element_key: "TVII_CAUSATION", element_text: "Causation / discriminatory motive indicators", evidence_type_codes: ["EVID_DOCS_COMMUNICATIONS", "EVID_DIGITAL_FORENSICS", "EVID_WITNESS_LAY"] },
      { element_key: "TVII_DAMAGES", element_text: "Damages", evidence_type_codes: ["EVID_DOCS_FINANCIAL", "EVID_WITNESS_EXPERT"] }
    ]
  },
  {
    template_id: "T_CIV_FED_ADA",
    name: "Federal ADA Title I (general)",
    domain: "civil",
    jurisdiction: "FED",
    elements: [
      { element_key: "ADA_DISABILITY_QUALIFIED", element_text: "Disability and qualified individual", evidence_type_codes: ["EVID_DOCS_MEDICAL", "EVID_DOCS_EMPLOYMENT", "EVID_WITNESS_LAY"] },
      { element_key: "ADA_ACCOMMODATION", element_text: "Accommodation request / interactive process / denial", evidence_type_codes: ["EVID_DOCS_COMMUNICATIONS", "EVID_DOCS_EMPLOYMENT", "EVID_DOCS_POLICIES"] },
      { element_key: "ADA_ADVERSE_ACTION", element_text: "Adverse action because of disability or failure to accommodate", evidence_type_codes: ["EVID_DOCS_EMPLOYMENT", "EVID_DOCS_COMMUNICATIONS", "EVID_WITNESS_LAY"] }
    ]
  },
  {
    template_id: "T_CIV_FED_FLSA",
    name: "Federal FLSA (general)",
    domain: "civil",
    jurisdiction: "FED",
    elements: [
      { element_key: "FLSA_COVERAGE_EMPLOYMENT", element_text: "Employment relationship and FLSA coverage", evidence_type_codes: ["EVID_DOCS_EMPLOYMENT", "EVID_DOCS_POLICIES"] },
      { element_key: "FLSA_HOURS_PAY", element_text: "Hours worked and compensation paid", evidence_type_codes: ["EVID_DOCS_EMPLOYMENT", "EVID_DOCS_FINANCIAL", "EVID_DIGITAL_FORENSICS", "EVID_WITNESS_LAY"] },
      { element_key: "FLSA_VIOLATION", element_text: "Minimum wage and/or overtime violation", evidence_type_codes: ["EVID_DOCS_EMPLOYMENT", "EVID_WITNESS_EXPERT"] }
    ]
  },
  {
    template_id: "T_CIV_FED_CIVIL_RICO",
    name: "Federal Civil RICO (general)",
    domain: "civil",
    jurisdiction: "FED",
    elements: [
      { element_key: "RICO_ENTERPRISE", element_text: "Enterprise (structure/association) affecting interstate commerce", evidence_type_codes: ["EVID_DOCS_CONTRACTS", "EVID_DOCS_COMMUNICATIONS", "EVID_DOCS_FINANCIAL", "EVID_WITNESS_LAY"] },
      { element_key: "RICO_PATTERN", element_text: "Pattern of racketeering activity (predicate acts)", evidence_type_codes: ["EVID_GOV_RECORDS", "EVID_DOCS_FINANCIAL", "EVID_DOCS_COMMUNICATIONS", "EVID_DIGITAL_FORENSICS", "EVID_WITNESS_EXPERT"] },
      { element_key: "RICO_INJURY_CAUSATION", element_text: "Injury to business/property and causation", evidence_type_codes: ["EVID_DOCS_FINANCIAL", "EVID_WITNESS_EXPERT"] }
    ]
  },
  {
    template_id: "T_CRIM_CA_MURDER",
    name: "CA Murder (general)",
    domain: "criminal",
    jurisdiction: "CA",
    elements: [
      { element_key: "MURDER_UNLAWFUL_KILLING", element_text: "Unlawful killing of a human being", evidence_type_codes: ["EVID_GOV_RECORDS", "EVID_DOCS_MEDICAL", "EVID_WITNESS_LAY", "EVID_SURVEILLANCE", "EVID_CHAIN_CUSTODY"] },
      { element_key: "MURDER_MALICE", element_text: "Malice aforethought / required mental state (degree-specific)", evidence_type_codes: ["EVID_DOCS_COMMUNICATIONS", "EVID_DIGITAL_FORENSICS", "EVID_WITNESS_LAY", "EVID_SURVEILLANCE"] },
      { element_key: "MURDER_IDENTITY", element_text: "Identity of perpetrator", evidence_type_codes: ["EVID_DIGITAL_FORENSICS", "EVID_SURVEILLANCE", "EVID_WITNESS_LAY", "EVID_GOV_RECORDS"] }
    ]
  },
  {
    template_id: "T_CRIM_CA_ROBBERY",
    name: "CA Robbery (general)",
    domain: "criminal",
    jurisdiction: "CA",
    elements: [
      { element_key: "ROBBERY_TAKING", element_text: "Taking personal property from person/immediate presence", evidence_type_codes: ["EVID_WITNESS_LAY", "EVID_SURVEILLANCE", "EVID_GOV_RECORDS"] },
      { element_key: "ROBBERY_FORCE_FEAR", element_text: "Accomplished by force or fear", evidence_type_codes: ["EVID_WITNESS_LAY", "EVID_SURVEILLANCE", "EVID_DOCS_MEDICAL"] },
      { element_key: "ROBBERY_INTENT", element_text: "Intent to permanently deprive", evidence_type_codes: ["EVID_DOCS_COMMUNICATIONS", "EVID_DIGITAL_FORENSICS", "EVID_WITNESS_LAY"] }
    ]
  },
  {
    template_id: "T_CRIM_CA_ASSAULT_DW",
    name: "CA Assault w/ Deadly Weapon (general)",
    domain: "criminal",
    jurisdiction: "CA",
    elements: [
      { element_key: "ADW_ASSAULT", element_text: "Assault (unlawful attempt + present ability)", evidence_type_codes: ["EVID_WITNESS_LAY", "EVID_SURVEILLANCE", "EVID_GOV_RECORDS"] },
      { element_key: "ADW_WEAPON_OR_FORCE", element_text: "Use of deadly weapon or force likely to produce great bodily injury", evidence_type_codes: ["EVID_PHYSICAL", "EVID_DOCS_MEDICAL", "EVID_SURVEILLANCE", "EVID_CHAIN_CUSTODY"] }
    ]
  },
  {
    template_id: "T_CRIM_CA_DV_2735",
    name: "CA DV 273.5 (general)",
    domain: "criminal",
    jurisdiction: "CA",
    elements: [
      { element_key: "DV_RELATIONSHIP", element_text: "Qualifying relationship (spouse/cohabitant/etc.)", evidence_type_codes: ["EVID_DOCS_COMMUNICATIONS", "EVID_WITNESS_LAY", "EVID_GOV_RECORDS"] },
      { element_key: "DV_INJURY", element_text: "Willful infliction of corporal injury resulting in traumatic condition", evidence_type_codes: ["EVID_DOCS_MEDICAL", "EVID_SURVEILLANCE", "EVID_WITNESS_LAY", "EVID_GOV_RECORDS"] }
    ]
  },
  {
    template_id: "T_CRIM_CA_BURGLARY",
    name: "CA Burglary (general)",
    domain: "criminal",
    jurisdiction: "CA",
    elements: [
      { element_key: "BURG_ENTRY", element_text: "Entry into building/structure/vehicle (as applicable)", evidence_type_codes: ["EVID_SURVEILLANCE", "EVID_DIGITAL_FORENSICS", "EVID_WITNESS_LAY", "EVID_GOV_RECORDS"] },
      { element_key: "BURG_INTENT_AT_ENTRY", element_text: "Intent to commit theft or felony at time of entry", evidence_type_codes: ["EVID_DOCS_COMMUNICATIONS", "EVID_DIGITAL_FORENSICS", "EVID_WITNESS_LAY"] }
    ]
  },
  {
    template_id: "T_CRIM_CA_THEFT",
    name: "CA Theft (general)",
    domain: "criminal",
    jurisdiction: "CA",
    elements: [
      { element_key: "THEFT_TAKING", element_text: "Taking/appropriation of property without consent", evidence_type_codes: ["EVID_WITNESS_LAY", "EVID_SURVEILLANCE", "EVID_GOV_RECORDS"] },
      { element_key: "THEFT_INTENT", element_text: "Intent to permanently deprive", evidence_type_codes: ["EVID_DOCS_COMMUNICATIONS", "EVID_DIGITAL_FORENSICS", "EVID_WITNESS_LAY"] }
    ]
  },
  {
    template_id: "T_CRIM_CA_FORGERY",
    name: "CA Forgery (general)",
    domain: "criminal",
    jurisdiction: "CA",
    elements: [
      { element_key: "FORG_MAKE_ALTER", element_text: "Make/alter/possess/use forged instrument (variant-dependent)", evidence_type_codes: ["EVID_DOCS_FINANCIAL", "EVID_DOCS_COMMUNICATIONS", "EVID_DIGITAL_FORENSICS", "EVID_CHAIN_CUSTODY"] },
      { element_key: "FORG_INTENT_DEFRAUD", element_text: "Intent to defraud", evidence_type_codes: ["EVID_DOCS_COMMUNICATIONS", "EVID_DOCS_FINANCIAL", "EVID_WITNESS_LAY"] }
    ]
  },
  {
    template_id: "T_CRIM_CA_IDTHEFT",
    name: "CA Identity Theft (general)",
    domain: "criminal",
    jurisdiction: "CA",
    elements: [
      { element_key: "IDINFO_USE", element_text: "Use/possession of personal identifying information of another", evidence_type_codes: ["EVID_DIGITAL_FORENSICS", "EVID_DOCS_FINANCIAL", "EVID_DOCS_COMMUNICATIONS", "EVID_CHAIN_CUSTODY"] },
      { element_key: "IDINFO_UNLAWFUL_PURPOSE", element_text: "Unlawful purpose / fraud component", evidence_type_codes: ["EVID_DOCS_FINANCIAL", "EVID_DOCS_COMMUNICATIONS", "EVID_WITNESS_LAY"] }
    ]
  },
  {
    template_id: "T_CRIM_CA_DRUG_POSSESSION",
    name: "CA Drug Possession (general)",
    domain: "criminal",
    jurisdiction: "CA",
    elements: [
      { element_key: "DRUG_POSSESSION", element_text: "Possession of controlled substance", evidence_type_codes: ["EVID_PHYSICAL", "EVID_GOV_RECORDS", "EVID_CHAIN_CUSTODY", "EVID_WITNESS_LAY"] },
      { element_key: "DRUG_KNOWLEDGE", element_text: "Knowledge of presence and nature of substance (as required)", evidence_type_codes: ["EVID_WITNESS_LAY", "EVID_DOCS_COMMUNICATIONS", "EVID_DIGITAL_FORENSICS"] }
    ]
  },
  {
    template_id: "T_CRIM_CA_DUI",
    name: "CA DUI (general)",
    domain: "criminal",
    jurisdiction: "CA",
    elements: [
      { element_key: "DUI_DRIVING", element_text: "Driving", evidence_type_codes: ["EVID_SURVEILLANCE", "EVID_GOV_RECORDS", "EVID_WITNESS_LAY"] },
      { element_key: "DUI_IMPAIRMENT_OR_BAC", element_text: "Impairment and/or BAC at/over limit (subdivision-dependent)", evidence_type_codes: ["EVID_GOV_RECORDS", "EVID_DOCS_MEDICAL", "EVID_WITNESS_LAY", "EVID_CHAIN_CUSTODY"] }
    ]
  },
  {
    template_id: "T_CRIM_FED_FRAUD",
    name: "Federal Fraud (Mail/Wire) (general)",
    domain: "criminal",
    jurisdiction: "FED",
    elements: [
      { element_key: "FRAUD_SCHEME", element_text: "Scheme or artifice to defraud", evidence_type_codes: ["EVID_DOCS_COMMUNICATIONS", "EVID_DOCS_FINANCIAL", "EVID_DIGITAL_FORENSICS", "EVID_WITNESS_LAY"] },
      { element_key: "FRAUD_INTENT", element_text: "Intent to defraud", evidence_type_codes: ["EVID_DOCS_COMMUNICATIONS", "EVID_DOCS_FINANCIAL", "EVID_WITNESS_LAY"] },
      { element_key: "FRAUD_JURISDICTIONAL_HOOK", element_text: "Use of mails or interstate wire communications", evidence_type_codes: ["EVID_DIGITAL_FORENSICS", "EVID_DOCS_COMMUNICATIONS", "EVID_GOV_RECORDS"] }
    ]
  },
  {
    template_id: "T_CRIM_FED_CONSPIRACY",
    name: "Federal Conspiracy (general)",
    domain: "criminal",
    jurisdiction: "FED",
    elements: [
      { element_key: "CONSP_AGREEMENT", element_text: "Agreement to commit an offense", evidence_type_codes: ["EVID_DOCS_COMMUNICATIONS", "EVID_DIGITAL_FORENSICS", "EVID_WITNESS_LAY"] },
      { element_key: "CONSP_OVERT_ACT", element_text: "Overt act in furtherance (where required)", evidence_type_codes: ["EVID_DOCS_FINANCIAL", "EVID_DOCS_COMMUNICATIONS", "EVID_GOV_RECORDS", "EVID_WITNESS_LAY"] },
      { element_key: "CONSP_INTENT", element_text: "Intent to achieve unlawful objective", evidence_type_codes: ["EVID_DOCS_COMMUNICATIONS", "EVID_WITNESS_LAY"] }
    ]
  },
  {
    template_id: "T_CRIM_FED_IDENTITY",
    name: "Federal Identity (1028/1028A) (general)",
    domain: "criminal",
    jurisdiction: "FED",
    elements: [
      { element_key: "FED_ID_MEANS_OR_DOC", element_text: "Possession/transfer/use of means of identification or identity document (variant-dependent)", evidence_type_codes: ["EVID_DIGITAL_FORENSICS", "EVID_DOCS_FINANCIAL", "EVID_CHAIN_CUSTODY", "EVID_GOV_RECORDS"] },
      { element_key: "FED_ID_KNOWINGLY", element_text: "Knowing/intent component (and predicate offense for 1028A)", evidence_type_codes: ["EVID_DOCS_COMMUNICATIONS", "EVID_WITNESS_LAY", "EVID_GOV_RECORDS"] }
    ]
  },
  {
    template_id: "T_CRIM_FED_MONEY_LAUNDERING",
    name: "Federal Money Laundering (general)",
    domain: "criminal",
    jurisdiction: "FED",
    elements: [
      { element_key: "ML_PROCEEDS", element_text: "Financial transaction involving proceeds of specified unlawful activity", evidence_type_codes: ["EVID_DOCS_FINANCIAL", "EVID_WITNESS_EXPERT", "EVID_CHAIN_CUSTODY"] },
      { element_key: "ML_KNOWLEDGE_INTENT", element_text: "Knowledge and intent (concealment/promotion/avoid reporting depending)", evidence_type_codes: ["EVID_DOCS_COMMUNICATIONS", "EVID_DIGITAL_FORENSICS", "EVID_WITNESS_LAY"] }
    ]
  },
  {
    template_id: "T_CRIM_FED_RICO",
    name: "Federal Criminal RICO (general)",
    domain: "criminal",
    jurisdiction: "FED",
    elements: [
      { element_key: "RICO_ENTERPRISE", element_text: "Enterprise affecting interstate commerce", evidence_type_codes: ["EVID_DOCS_COMMUNICATIONS", "EVID_DOCS_CONTRACTS", "EVID_DOCS_FINANCIAL", "EVID_WITNESS_LAY"] },
      { element_key: "RICO_PATTERN_PREDICATES", element_text: "Pattern of racketeering activity (predicate acts)", evidence_type_codes: ["EVID_GOV_RECORDS", "EVID_DOCS_FINANCIAL", "EVID_DIGITAL_FORENSICS", "EVID_WITNESS_EXPERT"] },
      { element_key: "RICO_PARTICIPATION", element_text: "Participation in conduct of enterprise affairs through the pattern", evidence_type_codes: ["EVID_DOCS_COMMUNICATIONS", "EVID_WITNESS_LAY", "EVID_DIGITAL_FORENSICS"] }
    ]
  },
  {
    template_id: "T_CRIM_FED_DRUG_841",
    name: "Federal Drug Distribution/PWID (general)",
    domain: "criminal",
    jurisdiction: "FED",
    elements: [
      { element_key: "DRUG_KNOWING_POSSESSION", element_text: "Knowing possession of controlled substance", evidence_type_codes: ["EVID_PHYSICAL", "EVID_CHAIN_CUSTODY", "EVID_GOV_RECORDS"] },
      { element_key: "DRUG_INTENT_DISTRIBUTE", element_text: "Intent to distribute or distribution", evidence_type_codes: ["EVID_DOCS_COMMUNICATIONS", "EVID_DIGITAL_FORENSICS", "EVID_DOCS_FINANCIAL", "EVID_WITNESS_LAY"] }
    ]
  },
  {
    template_id: "T_CRIM_FED_922G",
    name: "Federal 922(g) Prohibited Person in Possession (general)",
    domain: "criminal",
    jurisdiction: "FED",
    elements: [
      { element_key: "922G_STATUS", element_text: "Prohibited status (category-dependent)", evidence_type_codes: ["EVID_GOV_RECORDS"] },
      { element_key: "922G_POSSESSION", element_text: "Knowing possession of firearm/ammunition", evidence_type_codes: ["EVID_PHYSICAL", "EVID_CHAIN_CUSTODY", "EVID_GOV_RECORDS", "EVID_SURVEILLANCE", "EVID_WITNESS_LAY"] },
      { element_key: "922G_INTERSTATE_NEXUS", element_text: "Interstate commerce nexus (typ.)", evidence_type_codes: ["EVID_GOV_RECORDS", "EVID_WITNESS_EXPERT"] }
    ]
  }
];

// KC Template Assignments
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

async function seedKCTemplates() {
  console.log('Seeding KC Templates with ' + kcTemplates.length + ' templates...');
  
  for (const template of kcTemplates) {
    const { error } = await supabase.from('kc_templates').upsert({
      template_id: template.template_id,
      name: template.name,
      domain: template.domain,
      jurisdiction: template.jurisdiction,
      elements: template.elements
    }, { onConflict: 'template_id' });
    
    if (error) {
      console.error('Error inserting template ' + template.template_id + ': ' + error.message);
    }
  }
  
  // Verify count
  const { count: templateCount } = await supabase.from('kc_templates').select('*', { count: 'exact', head: true });
  console.log('KC Templates now has ' + templateCount + ' entries');
  
  console.log('Seeding KC Template Assignments with ' + kcTemplateAssignments.length + ' assignments...');
  
  for (const assignment of kcTemplateAssignments) {
    const { error } = await supabase.from('kc_template_assignments').upsert({
      kc_id: assignment.kc_id,
      template_id: assignment.template_id
    }, { onConflict: 'kc_id' });
    
    if (error) {
      console.error('Error inserting assignment for ' + assignment.kc_id + ': ' + error.message);
    }
  }
  
  // Verify count
  const { count: assignmentCount } = await supabase.from('kc_template_assignments').select('*', { count: 'exact', head: true });
  console.log('KC Template Assignments now has ' + assignmentCount + ' entries');
}

seedKCTemplates();
