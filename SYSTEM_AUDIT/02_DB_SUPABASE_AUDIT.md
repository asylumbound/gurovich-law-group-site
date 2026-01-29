# Supabase Database Audit

**Database:** Supabase PostgreSQL  
**Project:** Gurovich Law Group  
**Audit Date:** January 29, 2026

---

## Database Size & Growth

### Table Row Counts

```sql
-- Query used:
SELECT schemaname, relname, n_live_tup 
FROM pg_stat_user_tables 
ORDER BY n_live_tup DESC;
```

| Table | Row Count | Growth Potential |
|-------|-----------|------------------|
| issue_types | 79 | Static (seeded data) |
| kc_library | 56 | Static (knowledge concepts) |
| kc_template_assignments | 56 | Static |
| statutes | 38 | Low (manual additions) |
| kc_templates | 35 | Static |
| terminal_messages | 20 | High (per session) |
| evidence_types | 16 | Static |
| terminal_sessions | 5 | Medium (per user/intake) |
| discovery_tasks | 2 | Medium |
| discovery_drafts | 1 | Medium |
| intake_uploads | 0 | High (file metadata) |
| intake_notes | 0 | Medium |
| upload_text | 0 | High (extracted text) |
| case_memory | 0 | Medium |
| matter_kcs | 0 | High (per intake) |
| matter_proof_matrix | 0 | High (per KC element) |
| users | null* | Low |
| intake | null* | High |
| intake_access | null* | Medium |

*Note: `null` indicates RLS may be blocking count or table uses different access pattern.

### Estimated Database Size

```sql
-- Query to check:
SELECT pg_size_pretty(pg_database_size(current_database()));
```

**Estimated Size:** < 10 MB (early stage, minimal data)

---

## Schema Structure

### Tables by Domain

| Domain | Tables | Purpose |
|--------|--------|---------|
| **Intake/Onboarding** | 7 | Client questionnaire data |
| **Terminal/RAG** | 6 | Chat sessions, messages, search |
| **KC Library** | 6 | Knowledge concepts, templates |
| **Reference** | 2 | Issue types, statutes |

### Key Relationships

```
intakes (1) ─────┬───── (N) intake_uploads
                 ├───── (N) intake_parties
                 ├───── (N) intake_notes
                 ├───── (1) intake_pi_details
                 ├───── (1) intake_criminal_details
                 ├───── (1) intake_employment_details
                 ├───── (1) intake_tenant_details
                 └───── (1) intake_civil_details

terminal_sessions (1) ─── (N) terminal_messages

kc_library (1) ─────┬───── (N) kc_template_assignments
                    ├───── (N) matter_kcs
                    └───── (N) matter_proof_matrix

kc_templates (1) ─── (N) kc_template_assignments
```

### Enum Types

| Enum | Values | Used In |
|------|--------|---------|
| practice_area | 5 values | intakes, issue_types |
| urgency_level | 4 values | intakes |
| contact_method | 3 values | intakes |
| preferred_language | 5 values | intakes |
| party_type | 5 values | intake_parties |
| party_role | 7 values | intake_parties |
| upload_tag | 7 values | intake_uploads |
| intake_status | 2 values | intakes |

### JSONB Usage

| Table | Column | Content |
|-------|--------|---------|
| kc_library | tags | Array of string tags |
| kc_templates | elements | Array of element objects |
| evidence_types | examples | Array of example strings |
| matter_proof_matrix | linked_evidence_ids | Array of evidence IDs |

---

## Index Analysis

### Existing Indexes

```sql
-- Query used:
SELECT indexname, tablename FROM pg_indexes WHERE schemaname = 'public';
```

| Table | Index | Columns |
|-------|-------|---------|
| intakes | idx_intakes_draft_token | draft_token |
| intakes | idx_intakes_status | status |
| intake_parties | idx_intake_parties_intake_id | intake_id |
| intake_uploads | idx_intake_uploads_intake_id | intake_id |
| issue_types | idx_issue_types_practice_area | practice_area |
| kc_library | idx_kc_library_domain | domain |
| kc_library | idx_kc_library_jurisdiction | jurisdiction |
| kc_library | idx_kc_library_category | category |
| kc_templates | idx_kc_templates_domain | domain |
| matter_kcs | idx_matter_kcs_intake | intake_id |
| matter_proof_matrix | idx_matter_proof_matrix_intake | intake_id |
| matter_proof_matrix | idx_matter_proof_matrix_status | status |

### Missing Indexes (Recommended)

```sql
-- Terminal performance
CREATE INDEX idx_terminal_sessions_user_id ON terminal_sessions(user_id);
CREATE INDEX idx_terminal_sessions_intake_id ON terminal_sessions(intake_id);
CREATE INDEX idx_terminal_messages_session_id ON terminal_messages(session_id);
CREATE INDEX idx_terminal_messages_created_at ON terminal_messages(created_at DESC);

-- Composite index for session message ordering
CREATE INDEX idx_terminal_messages_session_created 
ON terminal_messages(session_id, created_at DESC);

-- Upload text search
CREATE INDEX idx_upload_text_intake_id ON upload_text(intake_id);

-- Discovery
CREATE INDEX idx_discovery_tasks_intake_id ON discovery_tasks(intake_id);
CREATE INDEX idx_discovery_drafts_intake_id ON discovery_drafts(intake_id);
```

---

## Query Pattern Analysis

### N+1 Patterns Detected

**Location:** `admin-router.ts` - `getIntake` procedure

```typescript
// Current pattern (potential N+1):
const { data: parties } = await supabase
  .from("intake_parties")
  .select("*")
  .eq("intake_id", id);

const { data: uploads } = await supabase
  .from("intake_uploads")
  .select("*")
  .eq("intake_id", id);
```

**Recommendation:** Use Supabase joins or batch queries:

```typescript
const { data: intake } = await supabase
  .from("intakes")
  .select(`
    *,
    parties:intake_parties(*),
    uploads:intake_uploads(*)
  `)
  .eq("id", id)
  .single();
```

### Wide Selects

| Location | Query | Issue |
|----------|-------|-------|
| admin-router.ts | `select("*")` on intakes | Returns all columns |
| terminal-router.ts | `select("*")` on sessions | Returns all columns |

**Recommendation:** Select only needed columns for list views.

---

## RLS Policy Audit

### Tables WITH RLS Enabled

| Table | Policies | Status |
|-------|----------|--------|
| intakes | SELECT, INSERT, UPDATE | ✅ Proper |
| intake_uploads | SELECT, INSERT | ✅ Proper |
| intake_notes | SELECT, INSERT | ✅ Proper |
| terminal_sessions | SELECT, INSERT, UPDATE | ✅ Proper |
| terminal_messages | SELECT, INSERT | ✅ Proper |

### Tables WITHOUT RLS (Potential Risk)

| Table | Risk Level | Recommendation |
|-------|------------|----------------|
| users | MEDIUM | Add RLS for user self-access |
| intake_access | HIGH | Add RLS for access control |
| kc_library | LOW | Read-only reference data |
| kc_templates | LOW | Read-only reference data |
| statutes | LOW | Read-only reference data |
| evidence_types | LOW | Read-only reference data |

### Recommended RLS Policies

```sql
-- Enable RLS on intake_access
ALTER TABLE intake_access ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own access"
ON intake_access FOR SELECT
USING (user_id = auth.uid()::text);

CREATE POLICY "Admins can manage all access"
ON intake_access FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE id = auth.uid()::text 
    AND role = 'admin'
  )
);
```

---

## Data Integrity Analysis

### Foreign Key Constraints

| Table | FK Column | References | ON DELETE |
|-------|-----------|------------|-----------|
| intake_parties | intake_id | intakes(id) | CASCADE |
| intake_uploads | intake_id | intakes(id) | CASCADE |
| intake_notes | intake_id | intakes(id) | CASCADE |
| kc_template_assignments | kc_id | kc_library(kc_id) | CASCADE |
| kc_template_assignments | template_id | kc_templates(template_id) | CASCADE |
| matter_kcs | kc_id | kc_library(kc_id) | CASCADE |
| matter_proof_matrix | kc_id | kc_library(kc_id) | CASCADE |

### Missing Foreign Keys

| Table | Column | Should Reference |
|-------|--------|------------------|
| terminal_sessions | intake_id | intakes(id) |
| terminal_messages | session_id | terminal_sessions(id) |
| upload_text | intake_id | intakes(id) |
| discovery_tasks | intake_id | intakes(id) |
| discovery_drafts | intake_id | intakes(id) |

**Note:** These may be intentional to allow flexibility, but adds orphan risk.

### Unique Constraints

| Table | Constraint | Columns |
|-------|------------|---------|
| intakes | draft_token_unique | draft_token |
| kc_library | kc_id_unique | kc_id |
| kc_templates | template_id_unique | template_id |
| kc_template_assignments | kc_template_unique | (kc_id, template_id) |
| matter_kcs | intake_kc_unique | (intake_id, kc_id) |

---

## Recommended Migrations

### Migration 009: Add Missing Indexes

```sql
-- 009_add_indexes.sql
CREATE INDEX IF NOT EXISTS idx_terminal_sessions_user_id 
ON terminal_sessions(user_id);

CREATE INDEX IF NOT EXISTS idx_terminal_sessions_intake_id 
ON terminal_sessions(intake_id);

CREATE INDEX IF NOT EXISTS idx_terminal_messages_session_created 
ON terminal_messages(session_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_upload_text_intake_id 
ON upload_text(intake_id);

CREATE INDEX IF NOT EXISTS idx_discovery_tasks_intake_id 
ON discovery_tasks(intake_id);

CREATE INDEX IF NOT EXISTS idx_discovery_drafts_intake_id 
ON discovery_drafts(intake_id);
```

### Migration 010: Add RLS to Critical Tables

```sql
-- 010_add_rls.sql
ALTER TABLE intake_access ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own access"
ON intake_access FOR SELECT
USING (user_id = current_setting('request.jwt.claims')::json->>'sub');

CREATE POLICY "Admins can manage all access"
ON intake_access FOR ALL
USING (
  current_setting('request.jwt.claims')::json->>'role' = 'admin'
);
```

---

## Summary

| Category | Status | Action Required |
|----------|--------|-----------------|
| Schema Design | ✅ Good | None |
| Indexes | ⚠️ Partial | Add 6 indexes |
| RLS Policies | ⚠️ Partial | Add to 2 tables |
| Foreign Keys | ⚠️ Partial | Consider adding to terminal tables |
| Data Integrity | ✅ Good | None |
| Query Patterns | ⚠️ Needs Review | Fix N+1 in admin-router |
