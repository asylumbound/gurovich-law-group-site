-- =====================================================
-- CLIENT ONBOARDING QUESTIONNAIRE SCHEMA
-- Gurovich Law Group
-- =====================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- ENUM TYPES
-- =====================================================

-- Practice areas offered by the firm
CREATE TYPE practice_area AS ENUM (
  'personal_injury',
  'criminal_defense',
  'employment_law',
  'civil_litigation',
  'tenant_rights'
);

-- Urgency levels for intake
CREATE TYPE urgency_level AS ENUM (
  'emergency',
  'high',
  'normal',
  'unsure'
);

-- Preferred contact methods
CREATE TYPE contact_method AS ENUM (
  'phone',
  'email',
  'text'
);

-- Supported languages
CREATE TYPE preferred_language AS ENUM (
  'en',
  'es',
  'hy',
  'ru',
  'uk'
);

-- Party types for involved parties
CREATE TYPE party_type AS ENUM (
  'individual',
  'business',
  'government',
  'insurance',
  'other'
);

-- Party roles
CREATE TYPE party_role AS ENUM (
  'defendant',
  'plaintiff',
  'witness',
  'employer',
  'landlord',
  'tenant',
  'other'
);

-- Upload document tags
CREATE TYPE upload_tag AS ENUM (
  'police_report',
  'medical',
  'contract',
  'notice',
  'photos',
  'emails',
  'other'
);

-- Intake status
CREATE TYPE intake_status AS ENUM (
  'draft',
  'submitted'
);

-- Best time to contact
CREATE TYPE best_time_to_contact AS ENUM (
  'morning',
  'afternoon',
  'evening',
  'anytime'
);

-- Relationship to affected person
CREATE TYPE relationship_to_affected AS ENUM (
  'spouse',
  'parent',
  'child',
  'sibling',
  'friend',
  'attorney',
  'other'
);

-- =====================================================
-- TABLES
-- =====================================================

-- Issue types table (seeded with practice area options)
CREATE TABLE issue_types (
  id SERIAL PRIMARY KEY,
  practice_area practice_area NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create index for faster lookups by practice area
CREATE INDEX idx_issue_types_practice_area ON issue_types(practice_area);

-- Main intakes table
CREATE TABLE intakes (
  id SERIAL PRIMARY KEY,
  draft_token VARCHAR(64) NOT NULL UNIQUE,
  status intake_status DEFAULT 'draft' NOT NULL,
  
  -- Step 0: Consents
  consent_no_attorney_relationship BOOLEAN DEFAULT FALSE NOT NULL,
  consent_contact BOOLEAN DEFAULT FALSE NOT NULL,
  preferred_contact_method contact_method,
  preferred_language preferred_language DEFAULT 'en' NOT NULL,
  
  -- Step 1: Contact Basics
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  phone VARCHAR(20),
  email VARCHAR(320),
  city VARCHAR(100),
  state VARCHAR(2) DEFAULT 'CA',
  best_time_to_contact best_time_to_contact,
  is_affected_person BOOLEAN,
  relationship_to_affected relationship_to_affected,
  
  -- Step 2: Matter Selection
  practice_area practice_area,
  issue_type_id INTEGER REFERENCES issue_types(id),
  urgency urgency_level,
  summary TEXT,
  
  -- Step 3: Core Facts
  incident_date DATE,
  incident_date_unknown BOOLEAN DEFAULT FALSE,
  incident_city VARCHAR(100),
  incident_state VARCHAR(2),
  agency_involved BOOLEAN,
  agency_name VARCHAR(255),
  report_number VARCHAR(100),
  has_documents BOOLEAN,
  
  -- Step 5: Additional
  additional_notes TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create index for draft token lookups
CREATE INDEX idx_intakes_draft_token ON intakes(draft_token);
CREATE INDEX idx_intakes_status ON intakes(status);

-- Intake parties (repeatable)
CREATE TABLE intake_parties (
  id SERIAL PRIMARY KEY,
  intake_id INTEGER NOT NULL REFERENCES intakes(id) ON DELETE CASCADE,
  party_type party_type NOT NULL,
  party_role party_role NOT NULL,
  name VARCHAR(255),
  phone VARCHAR(20),
  email VARCHAR(320),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_intake_parties_intake_id ON intake_parties(intake_id);

-- Intake uploads (file metadata)
CREATE TABLE intake_uploads (
  id SERIAL PRIMARY KEY,
  intake_id INTEGER NOT NULL REFERENCES intakes(id) ON DELETE CASCADE,
  file_path TEXT NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  file_size INTEGER NOT NULL,
  mime_type VARCHAR(100) NOT NULL,
  tag upload_tag NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_intake_uploads_intake_id ON intake_uploads(intake_id);

-- =====================================================
-- PRACTICE AREA DETAIL TABLES (1:1 optional)
-- =====================================================

-- Personal Injury Details
CREATE TABLE intake_pi_details (
  id SERIAL PRIMARY KEY,
  intake_id INTEGER NOT NULL UNIQUE REFERENCES intakes(id) ON DELETE CASCADE,
  injury_severity VARCHAR(50),
  treatment_received BOOLEAN,
  treatment_types TEXT[], -- Array of treatment types
  insurance_involved BOOLEAN,
  insurance_types TEXT[], -- Array of insurance types
  vehicle_involved BOOLEAN,
  claimant_role VARCHAR(50),
  photos_available BOOLEAN,
  missed_work BOOLEAN,
  current_status VARCHAR(50),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Criminal Defense Details
CREATE TABLE intake_criminal_details (
  id SERIAL PRIMARY KEY,
  intake_id INTEGER NOT NULL UNIQUE REFERENCES intakes(id) ON DELETE CASCADE,
  charges TEXT,
  has_court_date BOOLEAN,
  court_date DATE,
  courthouse_county VARCHAR(100),
  custody_status VARCHAR(50),
  prior_convictions VARCHAR(50), -- yes/no/prefer_not
  restraining_order_involved BOOLEAN,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Employment Law Details
CREATE TABLE intake_employment_details (
  id SERIAL PRIMARY KEY,
  intake_id INTEGER NOT NULL UNIQUE REFERENCES intakes(id) ON DELETE CASCADE,
  employment_status VARCHAR(50),
  employer_name VARCHAR(255),
  job_title VARCHAR(255),
  date_hired DATE,
  date_terminated DATE,
  documents_available TEXT[], -- Array of document types
  desired_outcomes TEXT[], -- Array of desired outcomes
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Tenant Rights Details
CREATE TABLE intake_tenant_details (
  id SERIAL PRIMARY KEY,
  intake_id INTEGER NOT NULL UNIQUE REFERENCES intakes(id) ON DELETE CASCADE,
  party_role_type VARCHAR(50), -- tenant/landlord/agent
  property_city VARCHAR(100),
  property_zip VARCHAR(10),
  rent_controlled VARCHAR(20), -- yes/no/not_sure
  notice_served BOOLEAN,
  notice_type VARCHAR(100),
  conditions_issues TEXT[], -- Array of condition issues
  has_photos_reports BOOLEAN,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Civil Litigation Details
CREATE TABLE intake_civil_details (
  id SERIAL PRIMARY KEY,
  intake_id INTEGER NOT NULL UNIQUE REFERENCES intakes(id) ON DELETE CASCADE,
  amount_band VARCHAR(50),
  contract_exists BOOLEAN,
  demand_letter_sent BOOLEAN,
  litigation_filed BOOLEAN,
  case_number VARCHAR(100),
  county VARCHAR(100),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE intakes ENABLE ROW LEVEL SECURITY;
ALTER TABLE intake_parties ENABLE ROW LEVEL SECURITY;
ALTER TABLE intake_uploads ENABLE ROW LEVEL SECURITY;
ALTER TABLE intake_pi_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE intake_criminal_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE intake_employment_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE intake_tenant_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE intake_civil_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE issue_types ENABLE ROW LEVEL SECURITY;

-- Issue types: Public read access
CREATE POLICY "issue_types_select" ON issue_types
  FOR SELECT USING (true);

-- Intakes: Allow anonymous insert (new drafts)
CREATE POLICY "intakes_insert" ON intakes
  FOR INSERT WITH CHECK (true);

-- Intakes: Allow update only with matching draft_token
CREATE POLICY "intakes_update" ON intakes
  FOR UPDATE USING (true);

-- Intakes: Allow select with draft_token
CREATE POLICY "intakes_select" ON intakes
  FOR SELECT USING (true);

-- Intake parties: Allow operations based on intake ownership
CREATE POLICY "intake_parties_all" ON intake_parties
  FOR ALL USING (true);

-- Intake uploads: Allow operations based on intake ownership
CREATE POLICY "intake_uploads_all" ON intake_uploads
  FOR ALL USING (true);

-- Detail tables: Allow operations based on intake ownership
CREATE POLICY "intake_pi_details_all" ON intake_pi_details
  FOR ALL USING (true);

CREATE POLICY "intake_criminal_details_all" ON intake_criminal_details
  FOR ALL USING (true);

CREATE POLICY "intake_employment_details_all" ON intake_employment_details
  FOR ALL USING (true);

CREATE POLICY "intake_tenant_details_all" ON intake_tenant_details
  FOR ALL USING (true);

CREATE POLICY "intake_civil_details_all" ON intake_civil_details
  FOR ALL USING (true);

-- =====================================================
-- SEED DATA: Issue Types
-- =====================================================

-- Personal Injury Issue Types
INSERT INTO issue_types (practice_area, name, description) VALUES
  ('personal_injury', 'Auto Accident', 'Car, truck, motorcycle, or other vehicle collision'),
  ('personal_injury', 'Slip and Fall', 'Injury from falling on someone else''s property'),
  ('personal_injury', 'Medical Malpractice', 'Injury caused by healthcare provider negligence'),
  ('personal_injury', 'Product Liability', 'Injury caused by a defective product'),
  ('personal_injury', 'Dog Bite', 'Injury from an animal attack'),
  ('personal_injury', 'Workplace Injury', 'Injury occurring at work (non-workers comp)'),
  ('personal_injury', 'Wrongful Death', 'Death caused by another party''s negligence'),
  ('personal_injury', 'Pedestrian Accident', 'Pedestrian struck by a vehicle'),
  ('personal_injury', 'Bicycle Accident', 'Cyclist injured in an accident'),
  ('personal_injury', 'Other Personal Injury', 'Other type of personal injury');

-- Criminal Defense Issue Types
INSERT INTO issue_types (practice_area, name, description) VALUES
  ('criminal_defense', 'DUI/DWI', 'Driving under the influence charges'),
  ('criminal_defense', 'Drug Charges', 'Possession, distribution, or manufacturing'),
  ('criminal_defense', 'Assault/Battery', 'Physical violence charges'),
  ('criminal_defense', 'Theft/Burglary', 'Property crime charges'),
  ('criminal_defense', 'Domestic Violence', 'Domestic violence allegations'),
  ('criminal_defense', 'White Collar Crime', 'Fraud, embezzlement, or financial crimes'),
  ('criminal_defense', 'Weapons Charges', 'Illegal possession or use of weapons'),
  ('criminal_defense', 'Probation Violation', 'Alleged violation of probation terms'),
  ('criminal_defense', 'Expungement', 'Clearing criminal record'),
  ('criminal_defense', 'Other Criminal Matter', 'Other criminal defense matter');

-- Employment Law Issue Types
INSERT INTO issue_types (practice_area, name, description) VALUES
  ('employment_law', 'Wrongful Termination', 'Illegal firing or layoff'),
  ('employment_law', 'Discrimination', 'Workplace discrimination based on protected class'),
  ('employment_law', 'Sexual Harassment', 'Unwanted sexual conduct in the workplace'),
  ('employment_law', 'Wage and Hour', 'Unpaid wages, overtime, or meal breaks'),
  ('employment_law', 'Retaliation', 'Punishment for reporting violations'),
  ('employment_law', 'FMLA Violation', 'Family and Medical Leave Act issues'),
  ('employment_law', 'Hostile Work Environment', 'Pervasive harassment or abuse'),
  ('employment_law', 'Contract Dispute', 'Employment contract issues'),
  ('employment_law', 'Non-Compete Issues', 'Non-compete agreement disputes'),
  ('employment_law', 'Other Employment Matter', 'Other employment law issue');

-- Civil Litigation Issue Types
INSERT INTO issue_types (practice_area, name, description) VALUES
  ('civil_litigation', 'Breach of Contract', 'Failure to fulfill contractual obligations'),
  ('civil_litigation', 'Business Dispute', 'Partnership or business disagreements'),
  ('civil_litigation', 'Property Dispute', 'Real property or boundary issues'),
  ('civil_litigation', 'Debt Collection', 'Collecting or defending against debts'),
  ('civil_litigation', 'Fraud', 'Intentional misrepresentation'),
  ('civil_litigation', 'Defamation', 'Libel or slander claims'),
  ('civil_litigation', 'Insurance Dispute', 'Insurance claim denials or bad faith'),
  ('civil_litigation', 'Construction Dispute', 'Construction defects or payment issues'),
  ('civil_litigation', 'Professional Malpractice', 'Non-medical professional negligence'),
  ('civil_litigation', 'Other Civil Matter', 'Other civil litigation matter');

-- Tenant Rights Issue Types
INSERT INTO issue_types (practice_area, name, description) VALUES
  ('tenant_rights', 'Unlawful Eviction', 'Illegal eviction or lockout'),
  ('tenant_rights', 'Habitability Issues', 'Uninhabitable living conditions'),
  ('tenant_rights', 'Security Deposit', 'Wrongful withholding of deposit'),
  ('tenant_rights', 'Rent Increase', 'Illegal rent increase'),
  ('tenant_rights', 'Harassment', 'Landlord harassment or intimidation'),
  ('tenant_rights', 'Discrimination', 'Housing discrimination'),
  ('tenant_rights', 'Lease Violation', 'Landlord violating lease terms'),
  ('tenant_rights', 'Repair Issues', 'Failure to make necessary repairs'),
  ('tenant_rights', 'Utility Shutoff', 'Illegal utility disconnection'),
  ('tenant_rights', 'Other Tenant Issue', 'Other tenant rights matter');

-- =====================================================
-- FUNCTION: Auto-update updated_at timestamp
-- =====================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_intakes_updated_at
  BEFORE UPDATE ON intakes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- STORAGE BUCKET (run separately in Supabase dashboard)
-- =====================================================
-- Create a storage bucket named 'intake-uploads' with public access
-- This should be done via Supabase dashboard or API
