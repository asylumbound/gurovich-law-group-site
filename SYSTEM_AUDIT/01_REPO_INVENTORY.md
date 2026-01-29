# Repository Inventory

**Project:** gurovich-law-group-site  
**Total Files:** 167 TypeScript/TSX files  
**Total Lines:** ~29,132 lines of code

---

## File Tree Overview

```
gurovich-law-group-site/
├── client/
│   ├── public/                    # Static assets (images, fonts, robots.txt)
│   └── src/
│       ├── components/            # 75 component files
│       │   ├── ui/               # 50 shadcn/ui components
│       │   └── onboarding/       # 6 onboarding step components
│       ├── pages/                # 19 page components
│       ├── contexts/             # 3 React contexts
│       ├── hooks/                # 4 custom hooks
│       ├── data/                 # Static data files
│       ├── i18n/                 # Internationalization (en, es)
│       └── lib/                  # Utilities (trpc, utils)
├── server/
│   ├── _core/                    # Framework plumbing (18 files)
│   ├── routers.ts               # Main router aggregation
│   ├── onboard-router.ts        # Client onboarding (583 lines)
│   ├── admin-router.ts          # Admin dashboard (528 lines)
│   ├── terminal-router.ts       # Terminal RAG (1,022 lines)
│   ├── terminal-legal-tools.ts  # Legal search tools (387 lines)
│   └── *.test.ts                # Test files (8 test suites)
├── drizzle/                      # Drizzle ORM schema (MySQL)
├── supabase/migrations/          # 8 PostgreSQL migrations
├── shared/                       # Shared types and constants
└── scripts/                      # Seeding scripts
```

---

## Key Modules

| Module | Files | Lines | Purpose |
|--------|-------|-------|---------|
| **Pages** | 19 | ~5,500 | Route components |
| **UI Components** | 50 | ~4,000 | shadcn/ui primitives |
| **Onboarding** | 6 | ~2,500 | Multi-step intake form |
| **Server Routers** | 4 | ~2,500 | tRPC API endpoints |
| **Terminal** | 3 | ~2,400 | RAG assistant |
| **Contexts** | 3 | ~700 | State management |

---

## Dependency Audit

### Production Dependencies (68 total)

| Category | Count | Notable Packages |
|----------|-------|------------------|
| **UI/Radix** | 25 | @radix-ui/* components |
| **Data/API** | 8 | @trpc/*, @tanstack/react-query, axios |
| **Database** | 4 | @supabase/supabase-js, drizzle-orm, mysql2 |
| **Utilities** | 15 | date-fns, zod, nanoid, clsx |
| **Visualization** | 4 | recharts, framer-motion, mermaid (via streamdown) |
| **PDF** | 2 | jspdf, pdf-parse |

### Dev Dependencies (24 total)

| Category | Count | Notable Packages |
|----------|-------|------------------|
| **Build** | 6 | vite, esbuild, tsx |
| **Types** | 6 | @types/* |
| **Testing** | 1 | vitest |
| **Linting** | 2 | prettier, typescript |

### Potentially Unused Dependencies

```
Command: grep -r "from 'add'" --include="*.ts" --include="*.tsx" . | wc -l
Result: 0 matches
```

| Package | Status | Recommendation |
|---------|--------|----------------|
| `add` (devDep) | Unused | Remove from package.json |
| `embla-carousel-react` | Used in BadgeCarousel | Keep |
| `react-resizable-panels` | Used in Terminal | Keep |

---

## Bloat Findings

### 1. Large Files (>500 lines)

| File | Lines | Issue | Recommendation |
|------|-------|-------|----------------|
| ComponentShowcase.tsx | 1,437 | Demo page, not needed in prod | Exclude from build or lazy load |
| AdminDashboard.tsx | 1,028 | Large but functional | Consider splitting into sub-components |
| terminal-router.ts | 1,022 | Complex but necessary | Extract helpers to separate files |
| Terminal.tsx | 996 | Complex UI | Extract chat/sidebar components |

### 2. Duplicate Utilities

```
Command: grep -rn "function cn(" --include="*.ts" --include="*.tsx" . | wc -l
Result: 1 (only in lib/utils.ts - good)
```

No significant duplicate utilities found.

### 3. TypeScript `any` Hotspots

| File | Line | Issue |
|------|------|-------|
| Terminal.tsx | 64-65 | `citations?: any[]`, `suggestedActions?: any[]` |
| Terminal.tsx | 306-309 | Multiple `as any` casts |
| AdminDashboard.tsx | 65 | `downloadCSV(data: any[])` |
| AdminDashboard.tsx | 828, 844, 989 | `party: any`, `upload: any`, `note: any` |
| Onboarding.tsx | 244-260 | Multiple `as any` casts for step data |
| terminal-legal-tools.ts | 191 | `result: any` in map |

**Total `any` usage:** 17 instances  
**Recommendation:** Create proper interfaces for citations, actions, and step data

### 4. Non-Deterministic Behavior

No significant non-deterministic behavior found. All IDs use:
- `randomUUID()` for session IDs
- `nanoid()` for draft tokens
- Sequential database IDs

---

## Tech Debt Assessment

### High Risk

| Issue | Location | Impact |
|-------|----------|--------|
| No code splitting | App.tsx | 2.59 MB initial load |
| `any` types in Terminal | Terminal.tsx | Runtime type errors possible |
| Large router files | terminal-router.ts | Maintainability |

### Medium Risk

| Issue | Location | Impact |
|-------|----------|--------|
| Inline styles | Various components | Inconsistent styling |
| Missing error boundaries | Page components | Crash propagation |
| No request rate limiting | Server routers | DoS vulnerability |

### Low Risk

| Issue | Location | Impact |
|-------|----------|--------|
| Unused dev dependency | package.json (`add`) | Minor bloat |
| Console.log statements | Various | Debug noise in prod |

---

## Lint/TS Config

```json
// tsconfig.json (verified)
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true
  }
}
```

**Status:** TypeScript strict mode enabled, 0 compilation errors.

---

## Recommendations

1. **Remove unused `add` dependency**
   ```bash
   pnpm remove add
   ```

2. **Create proper types for Terminal**
   ```typescript
   // shared/types/terminal.ts
   interface Citation {
     type: "INTAKE" | "NOTE" | "UPLOAD" | "STATUTE" | "CASELAW";
     id: number | string;
     file_name?: string;
     citation?: string;
     url?: string;
   }
   ```

3. **Split large components**
   - Extract `TerminalSidebar` from Terminal.tsx
   - Extract `IntakeDetailView` from AdminDashboard.tsx

4. **Exclude ComponentShowcase from production**
   ```typescript
   // vite.config.ts
   build: {
     rollupOptions: {
       external: process.env.NODE_ENV === 'production' 
         ? ['./pages/ComponentShowcase'] 
         : []
     }
   }
   ```
