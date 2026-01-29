# Remediation Plan

**Project:** Gurovich Law Group  
**Audit Date:** January 29, 2026  
**Total Items:** 25 tasks across 4 priority levels

---

## Priority Levels

| Level | Description | SLA |
|-------|-------------|-----|
| **P0** | Security/Data Isolation | Immediate (24h) |
| **P1** | Stability/Performance Critical | This Sprint |
| **P2** | Performance/Optimization | Next Sprint |
| **P3** | DX/Cleanup | Backlog |

---

## P0: Security & Data Isolation

### P0-1: Switch Storage to Signed URLs

| Attribute | Value |
|-----------|-------|
| **Impact** | HIGH - Prevents unauthorized file access |
| **Risk** | LOW - Straightforward implementation |
| **Effort** | 2 hours |
| **Owner** | server/intake-storage.ts |
| **Acceptance** | All file URLs expire after 1 hour |

**Implementation:**
```typescript
// Change getPublicUrl to createSignedUrl
const { data } = await supabase.storage
  .from('Gurovich')
  .createSignedUrl(filePath, 3600);
```

---

### P0-2: Delete Duplicate Storage Bucket

| Attribute | Value |
|-----------|-------|
| **Impact** | MEDIUM - Prevents confusion and data fragmentation |
| **Risk** | LOW - Bucket is empty |
| **Effort** | 15 minutes |
| **Owner** | Supabase Dashboard |
| **Acceptance** | Only "Gurovich" bucket exists |

**Implementation:**
```javascript
await supabase.storage.deleteBucket('GUROVICH');
```

---

### P0-3: Add RLS to intake_access Table

| Attribute | Value |
|-----------|-------|
| **Impact** | HIGH - Prevents unauthorized access grants |
| **Risk** | MEDIUM - May affect existing queries |
| **Effort** | 1 hour |
| **Owner** | supabase/migrations/ |
| **Acceptance** | Users can only see their own access records |

**Implementation:**
```sql
ALTER TABLE intake_access ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own access"
ON intake_access FOR SELECT
USING (user_id = current_setting('request.jwt.claims')::json->>'sub');
```

---

## P1: Stability & Critical Performance

### P1-1: Implement Code Splitting for Admin Routes

| Attribute | Value |
|-----------|-------|
| **Impact** | CRITICAL - Reduces initial load from 2.59 MB to ~400 KB |
| **Risk** | LOW - Standard React pattern |
| **Effort** | 4 hours |
| **Owner** | client/src/App.tsx |
| **Acceptance** | Initial bundle < 500 KB, admin loads on demand |

**Implementation:**
```typescript
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const Terminal = lazy(() => import("./pages/Terminal"));
```

---

### P1-2: Dynamic Import for Mermaid/Streamdown

| Attribute | Value |
|-----------|-------|
| **Impact** | HIGH - Removes ~1 MB from initial bundle |
| **Risk** | MEDIUM - Requires loading state handling |
| **Effort** | 3 hours |
| **Owner** | client/src/pages/Terminal.tsx |
| **Acceptance** | Streamdown loads only when Terminal is accessed |

**Implementation:**
```typescript
const Streamdown = lazy(() => 
  import('streamdown').then(mod => ({ default: mod.Streamdown }))
);
```

---

### P1-3: Add Missing Database Indexes

| Attribute | Value |
|-----------|-------|
| **Impact** | MEDIUM - Improves query performance |
| **Risk** | LOW - Additive change |
| **Effort** | 1 hour |
| **Owner** | supabase/migrations/009_add_indexes.sql |
| **Acceptance** | All FK columns have indexes |

**Implementation:**
```sql
CREATE INDEX idx_terminal_sessions_user_id ON terminal_sessions(user_id);
CREATE INDEX idx_terminal_sessions_intake_id ON terminal_sessions(intake_id);
CREATE INDEX idx_terminal_messages_session_created 
  ON terminal_messages(session_id, created_at DESC);
```

---

### P1-4: Fix TypeScript `any` Types in Terminal

| Attribute | Value |
|-----------|-------|
| **Impact** | MEDIUM - Prevents runtime type errors |
| **Risk** | LOW - Type-only changes |
| **Effort** | 2 hours |
| **Owner** | client/src/pages/Terminal.tsx, shared/types/ |
| **Acceptance** | Zero `any` types in Terminal component |

**Implementation:**
```typescript
// shared/types/terminal.ts
export interface Citation {
  type: "INTAKE" | "NOTE" | "UPLOAD" | "STATUTE" | "CASELAW";
  id: number | string;
  file_name?: string;
  citation?: string;
  url?: string;
}

export interface SuggestedAction {
  action: string;
  label: string;
  payload?: Record<string, unknown>;
}
```

---

### P1-5: Add Rate Limiting to API

| Attribute | Value |
|-----------|-------|
| **Impact** | HIGH - Prevents DoS attacks |
| **Risk** | LOW - Standard middleware |
| **Effort** | 2 hours |
| **Owner** | server/_core/index.ts |
| **Acceptance** | 100 requests/15 min per IP |

**Implementation:**
```typescript
import rateLimit from 'express-rate-limit';

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

app.use('/api/trpc', apiLimiter, trpcMiddleware);
```

---

### P1-6: Add Health Check Endpoint

| Attribute | Value |
|-----------|-------|
| **Impact** | MEDIUM - Enables monitoring |
| **Risk** | LOW - New endpoint |
| **Effort** | 1 hour |
| **Owner** | server/_core/index.ts |
| **Acceptance** | /health returns 200 with status JSON |

**Implementation:**
```typescript
app.get('/health', async (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version,
  });
});
```

---

## P2: Performance & Optimization

### P2-1: Configure Vite Manual Chunks

| Attribute | Value |
|-----------|-------|
| **Impact** | MEDIUM - Better caching, smaller updates |
| **Risk** | LOW - Build configuration |
| **Effort** | 2 hours |
| **Owner** | vite.config.ts |
| **Acceptance** | Vendor chunks separated from app code |

---

### P2-2: Add React.memo to Message List

| Attribute | Value |
|-----------|-------|
| **Impact** | MEDIUM - Reduces unnecessary rerenders |
| **Risk** | LOW - Standard optimization |
| **Effort** | 1 hour |
| **Owner** | client/src/pages/Terminal.tsx |
| **Acceptance** | Message items don't rerender on new messages |

---

### P2-3: Add useMemo for Filtered Lists

| Attribute | Value |
|-----------|-------|
| **Impact** | LOW - Minor performance improvement |
| **Risk** | LOW - Standard optimization |
| **Effort** | 1 hour |
| **Owner** | Terminal.tsx, AdminDashboard.tsx |
| **Acceptance** | Filtered lists memoized |

---

### P2-4: Paginate Terminal Messages

| Attribute | Value |
|-----------|-------|
| **Impact** | MEDIUM - Reduces payload size |
| **Risk** | MEDIUM - Requires UI changes |
| **Effort** | 4 hours |
| **Owner** | terminal-router.ts, Terminal.tsx |
| **Acceptance** | Messages load in batches of 50 |

---

### P2-5: Add Upload Retry Logic

| Attribute | Value |
|-----------|-------|
| **Impact** | MEDIUM - Improves reliability |
| **Risk** | LOW - Additive change |
| **Effort** | 2 hours |
| **Owner** | server/intake-storage.ts |
| **Acceptance** | Uploads retry 3 times with backoff |

---

### P2-6: Fix N+1 Query in Admin Router

| Attribute | Value |
|-----------|-------|
| **Impact** | MEDIUM - Reduces database queries |
| **Risk** | LOW - Query optimization |
| **Effort** | 2 hours |
| **Owner** | server/admin-router.ts |
| **Acceptance** | getIntake uses single query with joins |

---

### P2-7: Exclude ComponentShowcase from Production

| Attribute | Value |
|-----------|-------|
| **Impact** | LOW - Removes demo code from bundle |
| **Risk** | LOW - Dev-only page |
| **Effort** | 30 minutes |
| **Owner** | vite.config.ts |
| **Acceptance** | ComponentShowcase not in prod build |

---

## P3: Developer Experience & Cleanup

### P3-1: Split Terminal Router into Sub-modules

| Attribute | Value |
|-----------|-------|
| **Impact** | LOW - Better maintainability |
| **Risk** | LOW - Refactoring |
| **Effort** | 4 hours |
| **Owner** | server/terminal/ |
| **Acceptance** | Router split into 4 files < 300 lines each |

---

### P3-2: Remove Unused `add` Dependency

| Attribute | Value |
|-----------|-------|
| **Impact** | LOW - Minor cleanup |
| **Risk** | LOW - Unused package |
| **Effort** | 5 minutes |
| **Owner** | package.json |
| **Acceptance** | `add` removed from devDependencies |

---

### P3-3: Add Terminal Audit Logging Table

| Attribute | Value |
|-----------|-------|
| **Impact** | MEDIUM - Enables compliance tracking |
| **Risk** | LOW - New table |
| **Effort** | 3 hours |
| **Owner** | supabase/migrations/, terminal-router.ts |
| **Acceptance** | All Terminal actions logged |

---

### P3-4: Standardize Error Messages

| Attribute | Value |
|-----------|-------|
| **Impact** | LOW - Better UX |
| **Risk** | LOW - String changes |
| **Effort** | 2 hours |
| **Owner** | All routers |
| **Acceptance** | Consistent error format across API |

---

### P3-5: Add Structured Logging

| Attribute | Value |
|-----------|-------|
| **Impact** | MEDIUM - Better debugging |
| **Risk** | LOW - Additive change |
| **Effort** | 3 hours |
| **Owner** | server/_core/logger.ts |
| **Acceptance** | JSON logs with request IDs |

---

### P3-6: Add GitHub Actions CI

| Attribute | Value |
|-----------|-------|
| **Impact** | MEDIUM - Automated testing |
| **Risk** | LOW - New workflow |
| **Effort** | 2 hours |
| **Owner** | .github/workflows/ci.yml |
| **Acceptance** | Tests run on every PR |

---

### P3-7: Create Staging Environment

| Attribute | Value |
|-----------|-------|
| **Impact** | MEDIUM - Safer deployments |
| **Risk** | LOW - New project |
| **Effort** | 4 hours |
| **Owner** | Manus Platform |
| **Acceptance** | Staging project mirrors production |

---

### P3-8: Document API Endpoints

| Attribute | Value |
|-----------|-------|
| **Impact** | LOW - Better DX |
| **Risk** | LOW - Documentation |
| **Effort** | 4 hours |
| **Owner** | docs/API.md |
| **Acceptance** | All endpoints documented with examples |

---

## Sprint Planning

### Sprint 1 (This Week)

| Task | Priority | Effort | Owner |
|------|----------|--------|-------|
| P0-1: Signed URLs | P0 | 2h | Backend |
| P0-2: Delete bucket | P0 | 15m | DevOps |
| P0-3: RLS policies | P0 | 1h | Backend |
| P1-1: Code splitting | P1 | 4h | Frontend |
| P1-2: Dynamic imports | P1 | 3h | Frontend |
| P1-3: Add indexes | P1 | 1h | Backend |

**Total: ~11 hours**

### Sprint 2 (Next Week)

| Task | Priority | Effort | Owner |
|------|----------|--------|-------|
| P1-4: Fix any types | P1 | 2h | Frontend |
| P1-5: Rate limiting | P1 | 2h | Backend |
| P1-6: Health endpoint | P1 | 1h | Backend |
| P2-1: Manual chunks | P2 | 2h | Frontend |
| P2-2: React.memo | P2 | 1h | Frontend |
| P2-5: Upload retry | P2 | 2h | Backend |

**Total: ~10 hours**

### Backlog

All P3 items + remaining P2 items

---

## Success Metrics

| Metric | Current | Target | Timeline |
|--------|---------|--------|----------|
| Initial Bundle | 2,588 KB | < 500 KB | Sprint 1 |
| Time to Interactive | ~5s | < 2s | Sprint 1 |
| TypeScript `any` | 17 | 0 | Sprint 2 |
| Test Coverage | 60 tests | 80 tests | Sprint 3 |
| Lighthouse Score | ~60 | > 85 | Sprint 2 |
