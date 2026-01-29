-- KC Library Tables for Supabase
-- Migration 008: Knowledge Concepts, Templates, and Evidence Types

-- Evidence Types table
CREATE TABLE IF NOT EXISTS evidence_types (
  id SERIAL PRIMARY KEY,
  code VARCHAR(100) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  examples JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- KC Library table (Knowledge Concepts)
CREATE TABLE IF NOT EXISTS kc_library (
  id SERIAL PRIMARY KEY,
  kc_id VARCHAR(100) UNIQUE NOT NULL,
  name VARCHAR(500) NOT NULL,
  domain VARCHAR(50) NOT NULL CHECK (domain IN ('civil', 'criminal')),
  jurisdiction VARCHAR(50) NOT NULL CHECK (jurisdiction IN ('CA', 'FED')),
  category VARCHAR(255) NOT NULL,
  authority_type VARCHAR(50) CHECK (authority_type IN ('statute', 'common_law', 'procedural')),
  authority_cite TEXT,
  authority_notes TEXT,
  tags JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- KC Templates table
CREATE TABLE IF NOT EXISTS kc_templates (
  id SERIAL PRIMARY KEY,
  template_id VARCHAR(100) UNIQUE NOT NULL,
  name VARCHAR(500) NOT NULL,
  domain VARCHAR(50) NOT NULL CHECK (domain IN ('civil', 'criminal')),
  jurisdiction VARCHAR(50) NOT NULL CHECK (jurisdiction IN ('CA', 'FED')),
  elements JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- KC Template Assignments (links KCs to templates)
CREATE TABLE IF NOT EXISTS kc_template_assignments (
  id SERIAL PRIMARY KEY,
  kc_id VARCHAR(100) NOT NULL REFERENCES kc_library(kc_id) ON DELETE CASCADE,
  template_id VARCHAR(100) NOT NULL REFERENCES kc_templates(template_id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(kc_id, template_id)
);

-- Matter KCs (KCs selected for a specific intake/matter)
CREATE TABLE IF NOT EXISTS matter_kcs (
  id SERIAL PRIMARY KEY,
  intake_id INTEGER NOT NULL,
  kc_id VARCHAR(100) NOT NULL REFERENCES kc_library(kc_id) ON DELETE CASCADE,
  created_by VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(intake_id, kc_id)
);

-- Matter Proof Matrix (evidence tracking per element)
CREATE TABLE IF NOT EXISTS matter_proof_matrix (
  id SERIAL PRIMARY KEY,
  intake_id INTEGER NOT NULL,
  kc_id VARCHAR(100) NOT NULL REFERENCES kc_library(kc_id) ON DELETE CASCADE,
  element_key VARCHAR(255) NOT NULL,
  element_text TEXT NOT NULL,
  evidence_type_code VARCHAR(100) NOT NULL,
  status VARCHAR(50) DEFAULT 'MISSING' CHECK (status IN ('MISSING', 'PARTIAL', 'SATISFIED')),
  linked_evidence_ids JSONB DEFAULT '[]'::jsonb,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_kc_library_domain ON kc_library(domain);
CREATE INDEX IF NOT EXISTS idx_kc_library_jurisdiction ON kc_library(jurisdiction);
CREATE INDEX IF NOT EXISTS idx_kc_library_category ON kc_library(category);
CREATE INDEX IF NOT EXISTS idx_kc_templates_domain ON kc_templates(domain);
CREATE INDEX IF NOT EXISTS idx_matter_kcs_intake ON matter_kcs(intake_id);
CREATE INDEX IF NOT EXISTS idx_matter_proof_matrix_intake ON matter_proof_matrix(intake_id);
CREATE INDEX IF NOT EXISTS idx_matter_proof_matrix_status ON matter_proof_matrix(status);

-- Seed Evidence Types
INSERT INTO evidence_types (code, name, examples) VALUES
('EVID_DOCS_CONTRACTS', 'Contracts / Agreements', '["signed agreements", "terms", "addenda", "SOWs"]'),
('EVID_DOCS_COMMUNICATIONS', 'Communications', '["emails", "texts", "DMs", "call logs"]'),
('EVID_DOCS_FINANCIAL', 'Financial Records', '["bank statements", "wire records", "invoices", "ledgers"]'),
('EVID_DOCS_POLICIES', 'Policies / Procedures', '["employee handbook", "SOPs", "training materials"]'),
('EVID_DOCS_MEDICAL', 'Medical Records', '["chart notes", "imaging", "billing", "treatment plans"]'),
('EVID_DOCS_EMPLOYMENT', 'Employment Records', '["pay stubs", "timecards", "offer letters", "performance reviews"]'),
('EVID_DOCS_HOUSING', 'Housing / Condition Evidence', '["inspection reports", "repair invoices", "code enforcement notices"]'),
('EVID_WITNESS_LAY', 'Lay Witness Testimony', '["party testimony", "bystanders", "coworkers"]'),
('EVID_WITNESS_EXPERT', 'Expert Testimony', '["medical expert", "forensic accountant", "industry expert"]'),
('EVID_PHYSICAL', 'Physical Evidence', '["defective product", "weapon", "damage photos"]'),
('EVID_SURVEILLANCE', 'Video / Audio / Surveillance', '["CCTV", "bodycam", "dashcam", "911 audio"]'),
('EVID_GOV_RECORDS', 'Government / Official Records', '["police report", "CAD logs", "permits", "court records"]'),
('EVID_DIGITAL_FORENSICS', 'Digital Forensics / Metadata', '["device extraction", "IP logs", "metadata", "hashes"]'),
('EVID_CONDITION_INSPECTION', 'Inspection / Site Condition', '["expert inspection", "photos with timestamps", "measurements"]'),
('EVID_NOTICE_DEMANDS', 'Notice / Demand / Complaints', '["demand letters", "repair requests", "HR complaints"]'),
('EVID_CHAIN_CUSTODY', 'Authenticity / Chain of Custody', '["custodian declaration", "business records affidavit", "collection logs"]')
ON CONFLICT (code) DO NOTHING;
