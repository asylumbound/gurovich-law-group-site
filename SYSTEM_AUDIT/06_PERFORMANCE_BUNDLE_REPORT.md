# Performance & Bundle Report

**Build Tool:** Vite 7.1.7  
**Bundler:** Rollup (via Vite)  
**Audit Date:** January 29, 2026

---

## Bundle Size Analysis

### Build Command

```bash
pnpm build
```

### Output Summary

| Metric | Value | Target | Status |
|--------|-------|--------|--------|
| **Main Bundle** | 2,588 KB (669 KB gzip) | < 500 KB | ❌ CRITICAL |
| **Total Assets** | ~15 MB | < 5 MB | ⚠️ HIGH |
| **Build Time** | 24.44s | < 30s | ✅ OK |
| **Server Bundle** | 118.7 KB | < 500 KB | ✅ OK |

### Top Contributors (Largest Chunks)

| File | Size | Gzip | Source |
|------|------|------|--------|
| index-CYhjv-0O.js | 2,588 KB | 669 KB | **Main app bundle** |
| emacs-lisp-C9XAeP06.js | 780 KB | 196 KB | Syntax highlighting |
| cpp-CofmeUqb.js | 626 KB | 45 KB | Syntax highlighting |
| wasm-CG6Dc4jp.js | 622 KB | 230 KB | WebAssembly support |
| mermaid.core-De5DBa7O.js | 452 KB | 126 KB | Diagram rendering |
| cytoscape.esm-DtBltrT8.js | 442 KB | 142 KB | Graph visualization |
| treemap-KMMF4GRG-DTqatVyj.js | 330 KB | 80 KB | Chart component |
| wolfram-lXgVvXCa.js | 262 KB | 77 KB | Syntax highlighting |

### Analysis

The main bundle (2.59 MB) is **5x larger than recommended**. Primary causes:

1. **Streamdown/Mermaid** - Markdown rendering with diagram support (~1 MB)
2. **Syntax Highlighting** - Multiple language parsers (~2 MB total)
3. **No Code Splitting** - All pages loaded upfront
4. **No Lazy Loading** - Admin/Terminal loaded on initial page

---

## Route-Level Lazy Load Plan

### Current State (App.tsx)

```tsx
// All imports are static - loaded immediately
import Home from "./pages/Home";
import Blog from "./pages/Blog";
import AdminDashboard from "./pages/AdminDashboard";
import Terminal from "./pages/Terminal";
import ComponentShowcase from "./pages/ComponentShowcase";
// ... 14 more pages
```

### Recommended Implementation

```tsx
import { lazy, Suspense } from 'react';

// Public pages - keep static (SEO important)
import Home from "./pages/Home";
import Blog from "./pages/Blog";
import Contact from "./pages/Contact";

// Admin pages - lazy load (auth required anyway)
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const Terminal = lazy(() => import("./pages/Terminal"));
const ComponentShowcase = lazy(() => import("./pages/ComponentShowcase"));

// Onboarding - lazy load (separate flow)
const Onboarding = lazy(() => import("./pages/Onboarding"));

// Loading fallback
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <Loader2 className="h-8 w-8 animate-spin" />
  </div>
);

// In Router component
<Route path="/admin">
  <Suspense fallback={<PageLoader />}>
    <AdminDashboard />
  </Suspense>
</Route>
```

### Expected Impact

| Route | Current Load | After Lazy | Savings |
|-------|--------------|------------|---------|
| / (Home) | 2,588 KB | ~400 KB | 85% |
| /admin | Included | ~300 KB (on demand) | Deferred |
| /terminal | Included | ~500 KB (on demand) | Deferred |
| /onboarding | Included | ~200 KB (on demand) | Deferred |

---

## Code Splitting Recommendation

### Verdict: **YES - Code Splitting Required**

### What to Split

| Module | Size | Strategy | Priority |
|--------|------|----------|----------|
| **Mermaid/Streamdown** | ~1 MB | Dynamic import in Terminal only | P0 |
| **Syntax Highlighters** | ~2 MB | Load on demand per language | P0 |
| **AdminDashboard** | ~300 KB | Route-level lazy | P1 |
| **Terminal** | ~500 KB | Route-level lazy | P1 |
| **ComponentShowcase** | ~100 KB | Exclude from prod OR lazy | P1 |
| **Onboarding** | ~200 KB | Route-level lazy | P2 |
| **Recharts** | ~150 KB | Dynamic import in charts | P2 |

### How to Split

#### 1. Vite Manual Chunks Configuration

```typescript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks
          'vendor-react': ['react', 'react-dom'],
          'vendor-radix': [
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            // ... other radix packages
          ],
          'vendor-charts': ['recharts'],
          
          // Feature chunks
          'feature-mermaid': ['mermaid'],
          'feature-streamdown': ['streamdown'],
        },
      },
    },
  },
});
```

#### 2. Dynamic Import for Heavy Components

```typescript
// Terminal.tsx
const Streamdown = lazy(() => 
  import('streamdown').then(mod => ({ default: mod.Streamdown }))
);

// Usage
<Suspense fallback={<div>Loading...</div>}>
  <Streamdown>{content}</Streamdown>
</Suspense>
```

#### 3. Conditional Syntax Highlighting

```typescript
// Only load syntax highlighting when needed
const loadHighlighter = async (language: string) => {
  const { highlight } = await import(`shiki/langs/${language}`);
  return highlight;
};
```

### Expected Results

| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| Initial Bundle | 2,588 KB | ~400 KB | **85%** |
| Time to Interactive | ~5s | ~1.5s | **70%** |
| Lighthouse Score | ~60 | ~85 | **+25 pts** |

---

## Rendering Performance Hotspots

### Giant Pages

| Page | Lines | Issue | Fix |
|------|-------|-------|-----|
| ComponentShowcase | 1,437 | Demo page, not needed in prod | Exclude or lazy |
| AdminDashboard | 1,028 | Large table renders | Virtualize list |
| Terminal | 996 | Complex chat UI | Extract components |

### Expensive Rerenders

| Component | Issue | Fix |
|-----------|-------|-----|
| Terminal message list | Re-renders on every message | Add `React.memo` |
| Admin intake list | Full list re-render on filter | Use `useMemo` for filtered data |
| Citations panel | Re-renders on every query | Memoize citation list |

### Missing Memoization

```typescript
// Terminal.tsx - Current
const filteredSessions = sessions.filter(s => 
  s.intake_id === selectedIntakeId
);

// Recommended
const filteredSessions = useMemo(() => 
  sessions.filter(s => s.intake_id === selectedIntakeId),
  [sessions, selectedIntakeId]
);
```

### Large JSON Payloads

| Endpoint | Payload Size | Issue | Fix |
|----------|--------------|-------|-----|
| getIntakes | ~50 KB | Returns all fields | Select specific columns |
| getSession | ~20 KB | Full message history | Paginate messages |
| query | ~10 KB | Full context in response | Stream response |

---

## Routing Strategy

### Current: Static Imports

```tsx
// All routes loaded synchronously
<Route path="/" component={Home} />
<Route path="/admin" component={AdminDashboard} />
```

### Recommended: Hybrid Approach

```tsx
// Public routes - static (SEO)
<Route path="/" component={Home} />
<Route path="/blog" component={Blog} />
<Route path="/contact" component={Contact} />

// Protected routes - lazy (no SEO needed)
<Route path="/admin">
  <Suspense fallback={<PageLoader />}>
    <AdminDashboard />
  </Suspense>
</Route>

<Route path="/terminal">
  <Suspense fallback={<PageLoader />}>
    <Terminal />
  </Suspense>
</Route>
```

---

## Implementation Checklist

### Phase 1: Quick Wins (Day 1)

- [ ] Add `React.lazy()` for AdminDashboard, Terminal, ComponentShowcase
- [ ] Add `Suspense` wrappers with loading states
- [ ] Exclude ComponentShowcase from production build

### Phase 2: Vendor Splitting (Day 2)

- [ ] Configure `manualChunks` in vite.config.ts
- [ ] Split Radix UI into separate chunk
- [ ] Split Recharts into separate chunk

### Phase 3: Feature Splitting (Day 3-4)

- [ ] Dynamic import for Streamdown/Mermaid
- [ ] Lazy load syntax highlighting
- [ ] Add loading states for heavy components

### Phase 4: Optimization (Day 5)

- [ ] Add `React.memo` to message list items
- [ ] Add `useMemo` for filtered lists
- [ ] Paginate large data responses

---

## Risk Assessment

| Change | Risk | Mitigation |
|--------|------|------------|
| Lazy loading | LOW | Suspense fallbacks prevent blank screens |
| Manual chunks | LOW | Test all routes after change |
| Dynamic imports | MEDIUM | Ensure error boundaries catch load failures |
| Removing ComponentShowcase | LOW | Only affects dev environment |

---

## Summary

| Finding | Severity | Action |
|---------|----------|--------|
| 2.59 MB main bundle | CRITICAL | Implement code splitting |
| No lazy loading | HIGH | Add React.lazy for admin routes |
| Mermaid/syntax bloat | HIGH | Dynamic import only when needed |
| Missing memoization | MEDIUM | Add useMemo/React.memo |
| Large JSON payloads | MEDIUM | Paginate and select columns |

**Code Splitting Required:** ✅ **YES**

Expected improvement: **85% reduction in initial bundle size**
