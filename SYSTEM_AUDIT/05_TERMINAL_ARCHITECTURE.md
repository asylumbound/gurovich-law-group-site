# Terminal RAG Architecture

**Component:** Admin Terminal / Legal Research Assistant  
**Location:** `/terminal` route  
**Backend:** `server/terminal-router.ts`, `server/terminal-legal-tools.ts`

---

## Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                         TERMINAL UI                                  │
│  ┌──────────────┐  ┌──────────────────┐  ┌───────────────────────┐ │
│  │   Sidebar    │  │   Chat Panel     │  │   Citations Panel     │ │
│  │  - Intakes   │  │  - Messages      │  │  - INTAKE refs        │ │
│  │  - Sessions  │  │  - Quick Actions │  │  - NOTE refs          │ │
│  │  - Favorites │  │  - Input         │  │  - UPLOAD refs        │ │
│  └──────────────┘  └──────────────────┘  │  - STATUTE refs       │ │
│                                          │  - CASELAW refs       │ │
│                                          └───────────────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      tRPC TERMINAL ROUTER                           │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  terminal.query                                              │   │
│  │  1. Verify intake access (user_id + role check)             │   │
│  │  2. Get/create session (pinned to intake)                   │   │
│  │  3. Save user message                                       │   │
│  │  4. Build context pack (intake + notes + uploads)           │   │
│  │  5. Search tools (statutes, caselaw, uploads)               │   │
│  │  6. Invoke LLM with context                                 │   │
│  │  7. Save assistant message                                  │   │
│  │  8. Return response + citations                             │   │
│  └─────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      DATA SOURCES                                   │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌────────────┐   │
│  │  Intakes   │  │   Notes    │  │  Uploads   │  │  Statutes  │   │
│  │ (Supabase) │  │ (Supabase) │  │ (Supabase) │  │ (Supabase) │   │
│  └────────────┘  └────────────┘  └────────────┘  └────────────┘   │
│                                                                     │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │                    CourtListener API                        │   │
│  │  - Case law search (authenticated)                          │   │
│  │  - Returns: title, court, date, excerpt, URL                │   │
│  └────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Retrieval Strategy

### Context Pack Builder

```typescript
// server/terminal-router.ts - buildContextPack()
async function buildContextPack(intakeId: number, userId: string) {
  // 1. Fetch intake record
  const intake = await supabase.from('intakes').select('*').eq('id', intakeId);
  
  // 2. Fetch related notes
  const notes = await supabase.from('intake_notes').select('*').eq('intake_id', intakeId);
  
  // 3. Fetch uploads with extracted text
  const uploads = await supabase.from('intake_uploads').select('*').eq('intake_id', intakeId);
  const uploadText = await supabase.from('upload_text').select('*').eq('intake_id', intakeId);
  
  return { intake, notes, uploads, uploadText };
}
```

### Tool Selection

| Tool | Trigger | Source |
|------|---------|--------|
| Statutes | `tools.includes('statutes')` OR query matches `/statute\|law\|code/i` | Local DB |
| Case Law | `tools.includes('caselaw')` OR query matches `/case law\|precedent/i` | CourtListener API |
| Uploads | `tools.includes('uploads')` | Local DB (upload_text) |

### Search Implementations

**Statute Search:**
```typescript
// server/terminal-legal-tools.ts
async function searchStatutes(query: string, practiceArea?: string) {
  const { data } = await supabase
    .from('statutes')
    .select('*')
    .or(`title.ilike.%${query}%,content.ilike.%${query}%`)
    .limit(5);
  return data;
}
```

**Case Law Search:**
```typescript
// server/terminal-legal-tools.ts
async function searchCourtListener(query: string, court?: string) {
  const url = `https://www.courtlistener.com/api/rest/v4/search/?q=${encodeURIComponent(query)}&type=o&order_by=score+desc`;
  const response = await fetch(url, {
    headers: { 'Authorization': `Token ${process.env.COURTLISTENER_API_TOKEN}` }
  });
  return response.json();
}
```

---

## Session Scoping & Pinning

### Session Model

```typescript
interface TerminalSession {
  id: string;           // UUID
  user_id: string;      // Owner
  intake_id: number;    // Pinned intake
  title: string;        // Auto-generated from first query
  is_favorite: boolean; // User preference
  deleted_at: string;   // Soft delete timestamp
  created_at: string;
  updated_at: string;
}
```

### Scoping Rules

| Rule | Implementation | Location |
|------|----------------|----------|
| Session belongs to user | `WHERE user_id = ctx.user.id` | getSessions |
| Session pinned to intake | `WHERE intake_id = input.intakeId` | query |
| Cross-intake blocked | Throw error if session.intake_id ≠ input.intakeId | query |

### Access Verification

```typescript
// server/terminal-router.ts
async function verifyIntakeAccess(intakeId: number, userId: string, role: string) {
  // Admins have access to all intakes
  if (role === 'admin') return true;
  
  // Check intake_access table for explicit grants
  const { data } = await supabase
    .from('intake_access')
    .select('*')
    .eq('intake_id', intakeId)
    .eq('user_id', userId)
    .single();
  
  return !!data;
}
```

---

## Citation Strategy

### Citation Types

| Type | Source | Fields |
|------|--------|--------|
| INTAKE | Context pack | `{ type, id }` |
| NOTE | Context pack | `{ type, id }` |
| UPLOAD | Context pack | `{ type, id, file_name }` |
| STATUTE | Statute search | `{ type, id, citation }` |
| CASELAW | CourtListener | `{ type, id, citation, url }` |

### Citation Collection

```typescript
// During query processing
const citations: Citation[] = [];

// Add intake citation
citations.push({ type: "INTAKE", id: contextPack.intake.id });

// Add note citations
contextPack.notes.forEach(note => {
  citations.push({ type: "NOTE", id: note.id });
});

// Add statute citations from search
statutes.forEach(s => {
  citations.push({ type: "STATUTE", id: s.id, citation: s.citation });
});

// Add caselaw citations from search
cases.forEach(c => {
  citations.push({ type: "CASELAW", id: c.id, citation: c.citation, url: c.url });
});
```

### Citation Display

```tsx
// Terminal.tsx - Citations Panel
{citations.map((citation, idx) => (
  <Badge key={idx} variant={citationColors[citation.type]}>
    {citation.type}: {citation.citation || citation.file_name || citation.id}
  </Badge>
))}
```

---

## Audit Logging

### Current Logging

| Event | Logged | Location |
|-------|--------|----------|
| Session created | ✅ | terminal_sessions table |
| Message saved | ✅ | terminal_messages table |
| Query errors | ✅ | console.error |
| Access denied | ❌ | Not logged |
| Tool invocations | ❌ | Not logged |

### Recommended Audit Table

```sql
CREATE TABLE terminal_audit_log (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  session_id UUID,
  intake_id INTEGER,
  action VARCHAR(50) NOT NULL,
  details JSONB,
  ip_address VARCHAR(45),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_terminal_audit_user ON terminal_audit_log(user_id);
CREATE INDEX idx_terminal_audit_intake ON terminal_audit_log(intake_id);
```

### Audit Events to Log

| Event | Action | Details |
|-------|--------|---------|
| Query submitted | `QUERY` | `{ query_length, tools_used }` |
| Session created | `SESSION_CREATE` | `{ session_id, intake_id }` |
| Access denied | `ACCESS_DENIED` | `{ intake_id, reason }` |
| Tool invoked | `TOOL_INVOKE` | `{ tool, query, result_count }` |
| PDF exported | `PDF_EXPORT` | `{ session_id }` |

---

## Tool Boundaries

### Statute Search

| Boundary | Current | Recommended |
|----------|---------|-------------|
| Max results | 5 | Keep |
| Search fields | title, content | Add citation |
| Practice area filter | ✅ Implemented | Keep |

### Case Law Search (CourtListener)

| Boundary | Current | Recommended |
|----------|---------|-------------|
| Max results | 10 | Keep |
| Rate limit | None | Add 10 req/min |
| Court filter | ✅ Implemented | Keep |
| Date range | None | Add optional |

### Upload Search

| Boundary | Current | Recommended |
|----------|---------|-------------|
| Max results | 10 | Keep |
| Search type | Full text | Consider semantic |
| File types | PDF only | Add Word, text |

---

## Data Isolation Analysis

### Cross-Client Pollution Risks

| Risk | Severity | Current Mitigation | Status |
|------|----------|-------------------|--------|
| Session leakage | HIGH | `WHERE user_id = ctx.user.id` | ✅ Mitigated |
| Intake data leakage | HIGH | `verifyIntakeAccess()` check | ✅ Mitigated |
| Note leakage | MEDIUM | Filtered by intake_id | ✅ Mitigated |
| Upload leakage | MEDIUM | Filtered by intake_id | ✅ Mitigated |
| Search result leakage | LOW | Statutes/caselaw are public | N/A |

### Potential Vulnerabilities

| Issue | Location | Fix |
|-------|----------|-----|
| Admin bypass | verifyIntakeAccess | Intentional - admins need full access |
| Session enumeration | getSessions | Add pagination limit |
| Message history exposure | getSession | Already scoped to user |

---

## Risk List & Fixes

### P0: Critical

| Risk | Description | Fix |
|------|-------------|-----|
| None identified | Data isolation is properly implemented | - |

### P1: High

| Risk | Description | Fix |
|------|-------------|-----|
| No audit logging | Cannot trace who accessed what | Add terminal_audit_log table |
| No rate limiting | DoS on CourtListener API | Add request throttling |

### P2: Medium

| Risk | Description | Fix |
|------|-------------|-----|
| `any` types | Runtime type errors | Define proper interfaces |
| Large router file | Maintainability | Split into sub-modules |
| No retry logic | API failures not handled | Add exponential backoff |

### P3: Low

| Risk | Description | Fix |
|------|-------------|-----|
| Console.log in prod | Debug noise | Use proper logger |
| Hardcoded limits | Not configurable | Move to env vars |

---

## Summary

| Category | Status | Notes |
|----------|--------|-------|
| Data Isolation | ✅ Good | Proper user/intake scoping |
| Session Pinning | ✅ Good | Sessions locked to intakes |
| Citation Strategy | ✅ Good | All sources tracked |
| Audit Logging | ⚠️ Partial | Need dedicated audit table |
| Tool Boundaries | ✅ Good | Reasonable limits |
| Error Handling | ⚠️ Needs Work | Add retry logic |
