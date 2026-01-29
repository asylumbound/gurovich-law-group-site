# API Router Architecture Map

**Framework:** tRPC 11 + Express 4  
**Transport:** HTTP Batch Link  
**Base Path:** `/api/trpc`

---

## Router Structure

```
appRouter
├── system (systemRouter)
│   └── notifyOwner
├── auth
│   ├── me
│   └── logout
├── onboard (onboardRouter)
│   ├── getIssueTypes
│   ├── createDraft
│   ├── getByToken
│   ├── updateStep1
│   ├── updateStep2
│   ├── updateStep3
│   ├── updateStep4
│   ├── updateStep5
│   ├── uploadFile
│   └── submit
├── admin (adminRouter)
│   ├── getIntakes
│   ├── getIntake
│   ├── updateStatus
│   ├── getNotes
│   ├── createNote
│   ├── deleteNote
│   └── exportPDF
└── terminal (terminalRouter)
    ├── query
    ├── saveSession
    ├── getSessions
    ├── getSession
    ├── toggleFavorite
    ├── softDelete
    ├── restoreSession
    ├── exportSessionPDF
    ├── processUploads
    ├── searchDocuments
    ├── getUploadStatus
    └── commitToMemory
```

---

## Procedure Inventory

### System Router (`server/_core/systemRouter.ts`)

| Procedure | Type | Auth | Input | Output |
|-----------|------|------|-------|--------|
| notifyOwner | mutation | protected | `{ title, content }` | `{ success: boolean }` |

### Auth Router (`server/routers.ts`)

| Procedure | Type | Auth | Input | Output |
|-----------|------|------|-------|--------|
| me | query | public | none | `User \| null` |
| logout | mutation | public | none | `{ success: true }` |

### Onboard Router (`server/onboard-router.ts`)

| Procedure | Type | Auth | Input | Output |
|-----------|------|------|-------|--------|
| getIssueTypes | query | public | `{ practiceArea }` | `IssueType[]` |
| createDraft | mutation | public | consent fields | `{ draftToken, id }` |
| getByToken | query | public | `{ draftToken }` | `Intake` |
| updateStep1 | mutation | public | `{ draftToken, data }` | `{ success }` |
| updateStep2 | mutation | public | `{ draftToken, data }` | `{ success }` |
| updateStep3 | mutation | public | `{ draftToken, data }` | `{ success }` |
| updateStep4 | mutation | public | `{ draftToken, practiceArea, data }` | `{ success }` |
| updateStep5 | mutation | public | `{ draftToken, data }` | `{ success }` |
| uploadFile | mutation | public | `{ draftToken, file, tag }` | `Upload` |
| submit | mutation | public | `{ draftToken }` | `{ success, id }` |

### Admin Router (`server/admin-router.ts`)

| Procedure | Type | Auth | Input | Output |
|-----------|------|------|-------|--------|
| getIntakes | query | admin | filters, pagination | `{ intakes, total, pages }` |
| getIntake | query | admin | `{ id }` | `IntakeDetail` |
| updateStatus | mutation | admin | `{ id, status }` | `{ success }` |
| getNotes | query | admin | `{ intakeId }` | `{ notes }` |
| createNote | mutation | admin | `{ intakeId, content }` | `{ note }` |
| deleteNote | mutation | admin | `{ noteId }` | `{ success }` |
| exportPDF | mutation | admin | `{ intakeId }` | `{ pdfBase64 }` |

### Terminal Router (`server/terminal-router.ts`)

| Procedure | Type | Auth | Input | Output |
|-----------|------|------|-------|--------|
| query | mutation | admin | `{ intakeId, sessionId?, query, tools? }` | `TerminalQueryOutput` |
| saveSession | mutation | admin | `{ sessionId, title }` | `{ success }` |
| getSessions | query | admin | `{ intakeId? }` | `Session[]` |
| getSession | query | admin | `{ sessionId }` | `SessionWithMessages` |
| toggleFavorite | mutation | admin | `{ sessionId }` | `{ isFavorite }` |
| softDelete | mutation | admin | `{ sessionId }` | `{ success }` |
| restoreSession | mutation | admin | `{ sessionId }` | `{ success }` |
| exportSessionPDF | mutation | admin | `{ sessionId }` | `{ pdfBase64 }` |
| processUploads | mutation | admin | `{ intakeId }` | `{ processed, failed }` |
| searchDocuments | query | admin | `{ intakeId, query }` | `SearchResult[]` |
| getUploadStatus | query | admin | `{ intakeId }` | `UploadStatus[]` |
| commitToMemory | mutation | admin | `{ sessionId, summary }` | `{ success }` |

---

## Auth Coverage Analysis

### Public Procedures (No Auth Required)

| Router | Procedure | Risk | Justification |
|--------|-----------|------|---------------|
| auth | me | LOW | Returns null if not logged in |
| auth | logout | LOW | No-op if not logged in |
| onboard | all | LOW | Draft token acts as auth |

### Protected Procedures (Requires Login)

| Router | Procedure | Auth Check |
|--------|-----------|------------|
| system | notifyOwner | `protectedProcedure` |

### Admin Procedures (Requires Admin Role)

| Router | Procedure | Auth Check |
|--------|-----------|------------|
| admin | all | `adminProcedure` (role check) |
| terminal | all | `adminProcedure` (role check) |

### Auth Implementation

```typescript
// server/admin-router.ts
const adminProcedure = publicProcedure.use(({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  if (ctx.user.role !== "admin") {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Admin access required",
    });
  }
  return next({ ctx: { ...ctx, user: ctx.user } });
});
```

---

## Input Validation

### Zod Schemas Used

| Router | Schema | Fields |
|--------|--------|--------|
| onboard | step1Schema | firstName, lastName, phone, email, etc. |
| onboard | step2Schema | practiceArea, issueTypeId, urgency, summary |
| onboard | step3Schema | incidentDate, city, state, agency fields |
| admin | intakeStatusSchema | enum values |
| terminal | citationSchema | type, id, file_name, citation, url |
| terminal | suggestedActionSchema | action, payload |

### Missing Validation

| Location | Issue | Recommendation |
|----------|-------|----------------|
| terminal.query | `tools` array not validated for length | Add `.max(3)` |
| admin.getIntakes | `search` not sanitized | Add SQL injection protection |

---

## Router Modularization Plan

### Current State

| Router | Lines | Procedures | Status |
|--------|-------|------------|--------|
| onboard-router.ts | 583 | 10 | ✅ Acceptable |
| admin-router.ts | 528 | 7 | ✅ Acceptable |
| terminal-router.ts | 1,022 | 12 | ⚠️ Should split |

### Recommended Split for Terminal Router

```
server/
├── terminal/
│   ├── index.ts           # Main router aggregation
│   ├── query.ts           # RAG query procedure
│   ├── sessions.ts        # Session CRUD procedures
│   ├── documents.ts       # Upload processing procedures
│   └── memory.ts          # Case memory procedures
```

### Implementation

```typescript
// server/terminal/index.ts
import { router } from "../_core/trpc";
import { queryProcedure } from "./query";
import { sessionProcedures } from "./sessions";
import { documentProcedures } from "./documents";
import { memoryProcedures } from "./memory";

export const terminalRouter = router({
  query: queryProcedure,
  ...sessionProcedures,
  ...documentProcedures,
  ...memoryProcedures,
});
```

---

## Express Middleware

### Current Middleware Stack

```typescript
// server/_core/index.ts
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/api/trpc', trpcExpress.createExpressMiddleware({ ... }));
app.use('/api/oauth', oauthRouter);
```

### REST Endpoints

| Path | Method | Handler | Purpose |
|------|--------|---------|---------|
| /api/oauth/callback | GET | oauthRouter | OAuth callback |
| /api/oauth/login | GET | oauthRouter | Initiate OAuth |

---

## Inconsistencies Found

### 1. Naming Conventions

| Issue | Location | Current | Recommended |
|-------|----------|---------|-------------|
| camelCase vs snake_case | terminal-router | Mixed | Standardize on camelCase |
| Procedure naming | admin.getIntakes | Plural | Keep consistent |

### 2. Error Handling

| Issue | Location | Fix |
|-------|----------|-----|
| Generic error messages | terminal-router | Add specific error codes |
| Missing error logging | onboard-router | Add console.error |

### 3. Duplicated Logic

| Logic | Locations | Recommendation |
|-------|-----------|----------------|
| Admin check | admin-router, terminal-router | Extract to shared middleware |
| Intake access check | terminal-router (2 places) | Extract to helper |

---

## Recommendations

### P1: Extract Admin Middleware

```typescript
// server/_core/adminProcedure.ts
export const adminProcedure = publicProcedure.use(({ ctx, next }) => {
  if (!ctx.user || ctx.user.role !== "admin") {
    throw new TRPCError({ code: "FORBIDDEN" });
  }
  return next({ ctx });
});
```

### P2: Split Terminal Router

See modularization plan above.

### P3: Add Rate Limiting

```typescript
// server/_core/rateLimiter.ts
import rateLimit from 'express-rate-limit';

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
});

// Apply to tRPC endpoint
app.use('/api/trpc', apiLimiter, trpcMiddleware);
```

---

## Summary

| Category | Status | Action |
|----------|--------|--------|
| Router Organization | ⚠️ Terminal too large | Split into sub-routers |
| Auth Coverage | ✅ Good | None |
| Input Validation | ✅ Good | Minor additions |
| Error Handling | ⚠️ Inconsistent | Standardize |
| Rate Limiting | ❌ Missing | Add express-rate-limit |
