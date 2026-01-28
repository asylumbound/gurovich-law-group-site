# Stack and Tooling Brief

## Gurovich Law Group — Code-First Rebuild

**Document Version:** 1.0  
**Date:** January 28, 2026  
**Status:** LOCKED — Do not begin design or coding until this document is approved

---

## 1. Recommended Stack

### Framework: Next.js 15 (App Router)

Next.js with the App Router is the recommended framework for this project. The App Router provides React Server Components by default, enabling better performance through server-side rendering and streaming. It offers a file-system based routing approach that maps directly to the site's information architecture, making route management intuitive and maintainable.

| Consideration | Decision | Justification |
|---------------|----------|---------------|
| Rendering Strategy | Static Site Generation (SSG) with ISR | Law firm content is largely static; ISR allows blog updates without full rebuilds |
| React Version | React 19 | Latest stable with improved performance and concurrent features |
| Router | App Router | Modern routing with layouts, loading states, and error boundaries built-in |

### Language: TypeScript

TypeScript is mandatory for this project. It provides compile-time type safety, improved developer experience through IDE autocompletion, and serves as living documentation for component props and data structures. This reduces runtime errors and makes the codebase more maintainable.

```typescript
// Example: Practice Area type definition
interface PracticeArea {
  slug: string;
  title: string;
  description: string;
  icon: string;
  subPages: SubPage[];
}
```

### Styling: Tailwind CSS 4 + CSS Variables

Tailwind CSS 4 is the styling solution, leveraging utility-first classes for rapid development and consistent design. CSS custom properties (variables) will define the design tokens, enabling theme consistency and easy updates.

| Token Category | Implementation |
|----------------|----------------|
| Colors | CSS variables in `:root` (e.g., `--color-primary: oklch(0.5 0.2 25)`) |
| Typography | Tailwind `fontFamily` config with Google Fonts |
| Spacing | Tailwind default scale with custom additions as needed |
| Shadows | Custom shadow tokens for cards and elevated elements |

**Design Tokens (from Phase 2 Design System):**

| Token | Value | Usage |
|-------|-------|-------|
| `--color-primary` | `#C41E3A` | CTAs, accents, logo pillar |
| `--color-secondary` | `#1A1A1A` | Text, dark backgrounds |
| `--color-accent` | `#D4AF37` | Gold highlights |
| `--color-background` | `#FFFFFF` | Page backgrounds |
| `--color-muted` | `#F5F5F5` | Section backgrounds |

### Content System: MDX for Pages and Blog

MDX (Markdown + JSX) is the recommended content system. It allows content to be authored in Markdown while embedding React components when needed. This approach keeps content portable, version-controlled, and developer-friendly without requiring a separate CMS.

| Content Type | Location | Format |
|--------------|----------|--------|
| Practice Area Pages | `/content/practice-areas/` | MDX with frontmatter |
| Blog Posts | `/content/blog/` | MDX with frontmatter |
| Static Pages | `/content/pages/` | MDX or direct TSX |

**Frontmatter Schema Example:**

```yaml
---
title: "Car Accidents"
description: "Experienced car accident attorneys in Los Angeles"
parentSlug: "personal-injury"
order: 5
lastUpdated: "2026-01-28"
---
```

**Why not a headless CMS?** For a law firm site with infrequent content updates, MDX provides sufficient flexibility without the operational overhead of a CMS. Content lives in the repository, enabling version control, PR-based reviews, and zero external dependencies.

### Internationalization (i18n): Client-Side Locale Context

The site supports five languages: English (default), Spanish, Armenian, Russian, and Ukrainian. Implementation uses a client-side locale context with localStorage persistence.

| Feature | Implementation |
|---------|----------------|
| Locale Codes | `en`, `es`, `hy`, `ru`, `uk` |
| Routing | Locale-prefixed URLs (e.g., `/es/contact-us`) |
| Persistence | localStorage + cookie fallback |
| Fallback | Missing keys fall back to English |
| Translation Files | JSON files in `client/src/i18n/locales/` |

See `/docs/I18N.md` for complete implementation details.

### Forms Handling: Server Actions + React Hook Form + Zod

Forms will use a layered approach combining client-side validation with server-side processing.

| Layer | Technology | Purpose |
|-------|------------|---------|
| Client Validation | React Hook Form + Zod | Real-time validation, UX feedback |
| Server Processing | Next.js Server Actions | Secure form submission, email sending |
| Email Delivery | Resend or SendGrid API | Transactional email for contact form |

**Validation Schema Example:**

```typescript
const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().regex(/^\d{10}$/, "Please enter a 10-digit phone number"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});
```

### Hosting/Deployment: Manus Built-in Hosting

The project will use Manus's built-in hosting platform, which provides integrated deployment, custom domain support, and SSL certificates. This eliminates the need for external hosting configuration and provides a streamlined deployment workflow.

| Feature | Manus Hosting |
|---------|---------------|
| SSL | Automatic |
| CDN | Included |
| Custom Domains | Supported |
| Preview Deployments | Per checkpoint |
| Analytics | Built-in |

---

## 2. Tooling and Build Pipeline

### Package Manager: pnpm

pnpm is the package manager for this project. It provides faster installation times through content-addressable storage, strict dependency resolution that prevents phantom dependencies, and efficient disk space usage.

| Metric | pnpm Advantage |
|--------|----------------|
| Install Speed | 2-3x faster than npm |
| Disk Usage | Shared store reduces duplication |
| Strictness | Prevents accessing undeclared dependencies |

### Linting and Formatting

| Tool | Configuration | Purpose |
|------|---------------|---------|
| ESLint | `eslint-config-next` + custom rules | Code quality, error prevention |
| Prettier | `.prettierrc` with Tailwind plugin | Consistent formatting |
| TypeScript | `strict: true` in tsconfig | Maximum type safety |

**ESLint Rules (Key):**

```json
{
  "extends": ["next/core-web-vitals", "next/typescript"],
  "rules": {
    "react/no-unescaped-entities": "off",
    "@typescript-eslint/no-unused-vars": "error",
    "prefer-const": "error"
  }
}
```

### Type Checking Conventions

TypeScript strict mode is enabled with the following conventions:

1. **Explicit return types** for exported functions
2. **Interface over type** for object shapes (extendable)
3. **Zod schemas** for runtime validation of external data
4. **No `any`** — use `unknown` with type guards instead

### Testing Plan

| Test Type | Tool | Scope |
|-----------|------|-------|
| Unit Tests | Vitest | Utility functions, hooks |
| Component Tests | Vitest + Testing Library | UI components in isolation |
| E2E Tests | Playwright | Critical user flows (optional) |

**Priority Test Coverage:**

1. Contact form submission flow
2. Navigation and routing
3. Responsive breakpoints
4. Accessibility (axe-core integration)

### Git Workflow Conventions

| Branch | Purpose | Merge Strategy |
|--------|---------|----------------|
| `main` | Production-ready code | Protected, requires PR |
| `develop` | Integration branch | Feature branches merge here |
| `feature/*` | New features | Squash merge to develop |
| `fix/*` | Bug fixes | Squash merge to develop |

**Commit Message Format:**

```
type(scope): description

feat(hero): add animated statistics counter
fix(nav): correct mobile menu z-index
docs(readme): update deployment instructions
```

### CI Recommendations

| Check | Tool | Trigger |
|-------|------|---------|
| Type Check | `tsc --noEmit` | Every push |
| Lint | `eslint .` | Every push |
| Format | `prettier --check .` | Every push |
| Build | `next build` | PR to main |
| Lighthouse | CI action | PR to main |

---

## 3. Site Architecture

### Route Map

The following route structure maps to the canonical sitemap:

```
/                                    → Home (Landing Page)
├── /practice-areas                  → Practice Areas Hub
│   ├── /personal-injury             → Personal Injury Hub
│   │   ├── /car-accidents
│   │   ├── /motorcycle-accidents
│   │   ├── /truck-accidents
│   │   ├── /bicycle-accidents
│   │   ├── /pedestrian-accidents
│   │   ├── /bus-accidents
│   │   ├── /lyft-accidents
│   │   ├── /hit-and-run
│   │   ├── /wrongful-death
│   │   ├── /burn-injuries
│   │   └── /premises-liability
│   ├── /criminal-defense            → Criminal Defense Hub
│   │   ├── /dui-dwi
│   │   ├── /drug-crimes
│   │   ├── /theft-crimes
│   │   ├── /assault-battery
│   │   ├── /domestic-violence
│   │   ├── /weapons-charges
│   │   ├── /fraud-white-collar
│   │   ├── /expungement
│   │   ├── /juvenile-crimes
│   │   ├── /probation-violations
│   │   ├── /traffic-violations
│   │   ├── /federal-crimes
│   │   └── /restraining-orders
│   ├── /employment-law              → Employment Law Hub
│   │   ├── /workplace-harassment
│   │   ├── /discrimination
│   │   ├── /wage-hour-disputes
│   │   ├── /wrongful-termination
│   │   ├── /severance-negotiation
│   │   └── /labor-relations
│   ├── /civil-litigation            → Civil Litigation Hub
│   │   ├── /contract-disputes
│   │   ├── /business-litigation
│   │   ├── /real-estate-disputes
│   │   ├── /partnership-disputes
│   │   └── /collections
│   └── /tenant-rights               → Tenant Rights Hub
│       ├── /unlawful-eviction
│       ├── /illegal-rent-increases
│       ├── /housing-discrimination
│       ├── /lease-violations
│       ├── /uninhabitable-conditions
│       └── /rent-control-violations
├── /our-team                        → Team/About Page
├── /testimonials                    → Testimonials Page
├── /blog                            → Blog Archive
│   └── /[slug]                      → Individual Blog Post
├── /contact-us                      → Contact Page
├── /privacy-policy                  → Privacy Policy
├── /terms-of-service                → Terms of Service
└── /disclaimer                      → Legal Disclaimer
```

### Component Architecture

**Layout Components:**

| Component | Location | Purpose |
|-----------|----------|---------|
| `RootLayout` | `app/layout.tsx` | HTML shell, fonts, global providers |
| `Header` | `components/layout/Header.tsx` | Navigation, logo, contact CTA |
| `Footer` | `components/layout/Footer.tsx` | Links, contact info, legal |
| `PageLayout` | `components/layout/PageLayout.tsx` | Standard page wrapper with hero |

**Section Components:**

| Component | Purpose |
|-----------|---------|
| `Hero` | Full-width hero with background, headline, CTAs |
| `PracticeAreasGrid` | 4-column grid of practice area cards |
| `StatsSection` | Animated counters for firm statistics |
| `AboutSection` | Two-column layout with image and text |
| `TestimonialsCarousel` | Client testimonial slider |
| `ContactSection` | Contact form with info sidebar |
| `CTABanner` | Full-width call-to-action strip |

**UI Primitives (from shadcn/ui):**

| Component | Usage |
|-----------|-------|
| `Button` | Primary and secondary actions |
| `Card` | Practice area cards, blog cards |
| `Dialog` | Mobile navigation, modals |
| `Form` | Contact form with validation |
| `Input` | Form fields |
| `Textarea` | Message input |
| `Select` | Dropdown selections |

### Content Folder Structure

```
content/
├── practice-areas/
│   ├── personal-injury/
│   │   ├── _index.mdx           → Hub page content
│   │   ├── car-accidents.mdx
│   │   ├── motorcycle-accidents.mdx
│   │   └── ...
│   ├── criminal-defense/
│   │   ├── _index.mdx
│   │   ├── dui-dwi.mdx
│   │   └── ...
│   ├── employment-law/
│   │   ├── _index.mdx
│   │   └── ...
│   ├── civil-litigation/
│   │   ├── _index.mdx
│   │   └── ...
│   └── tenant-rights/
│       ├── _index.mdx
│       └── ...
├── blog/
│   ├── hidden-penalties-criminal-conviction.mdx
│   ├── tips-dealing-insurance-adjusters.mdx
│   └── accused-crime-california.mdx
└── pages/
    ├── privacy-policy.mdx
    ├── terms-of-service.mdx
    └── disclaimer.mdx
```

---

## 4. SEO, Accessibility, and Performance

### SEO Strategy

| Feature | Implementation |
|---------|----------------|
| Sitemap | Auto-generated via `next-sitemap` |
| Robots.txt | Static file in `/public` |
| Metadata | Next.js `generateMetadata` per route |
| Structured Data | JSON-LD for LocalBusiness, LegalService |
| OG Images | Dynamic generation via `@vercel/og` or static per page |
| Canonical URLs | Automatic via Next.js |

**Metadata Template:**

```typescript
export async function generateMetadata({ params }): Promise<Metadata> {
  return {
    title: `${pageTitle} | Gurovich Law Group`,
    description: pageDescription,
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      images: [{ url: `/og/${params.slug}.png` }],
    },
  };
}
```

### Accessibility (WCAG 2.1 AA)

| Requirement | Implementation |
|-------------|----------------|
| Color Contrast | Minimum 4.5:1 for text, 3:1 for large text |
| Keyboard Navigation | All interactive elements focusable, visible focus rings |
| Screen Readers | Semantic HTML, ARIA labels, alt text |
| Skip Links | "Skip to main content" link |
| Focus Management | Trap focus in modals, restore on close |
| Heading Hierarchy | Single H1 per page, logical H2-H6 structure |
| Form Labels | Associated labels for all inputs |
| Error Announcements | ARIA live regions for form errors |

**Heading Rules:**

1. Each page has exactly one `<h1>` (the page title)
2. Headings follow logical order (no skipping levels)
3. Section headings use `<h2>`, subsections use `<h3>`

### Performance Targets (Core Web Vitals)

| Metric | Target | Strategy |
|--------|--------|----------|
| LCP | < 2.5s | Preload hero image, optimize fonts |
| FID | < 100ms | Minimize JS, defer non-critical scripts |
| CLS | < 0.1 | Reserve space for images, avoid layout shifts |
| TTFB | < 800ms | Static generation, CDN caching |

**Image Optimization:**

| Technique | Implementation |
|-----------|----------------|
| Format | WebP with JPEG fallback via Next.js Image |
| Sizing | Responsive `srcset` with appropriate breakpoints |
| Loading | Lazy load below-fold images |
| Priority | `priority` prop for hero/LCP images |

**Font Loading:**

```css
/* Preload critical fonts */
@font-face {
  font-family: 'Playfair Display';
  font-display: swap;
  src: url('/fonts/playfair-display.woff2') format('woff2');
}
```

---

## 5. Constraints

### Mandatory Requirements

1. **Responsive Design** — Site must be fully functional and visually appropriate at:
   - Mobile: 320px - 767px
   - Tablet: 768px - 1023px
   - Desktop: 1024px+

2. **Accessibility Compliance** — WCAG 2.1 AA minimum:
   - All images have alt text
   - All forms have labels
   - Color is not the only indicator
   - Keyboard navigable

3. **Brand Migration** — Complete removal of "Sherman Oaks Law Group":
   - Search codebase for "Sherman Oaks" before each deployment
   - Replace all instances with "Gurovich Law Group"
   - Update meta tags, alt text, and content

4. **Performance Budget**:
   - Total page weight: < 1MB (excluding images)
   - JavaScript bundle: < 200KB gzipped
   - First paint: < 1.5s on 3G

### Implementation Principles

1. **Minimal Dependencies** — Only add packages that provide significant value
2. **Progressive Enhancement** — Core content accessible without JavaScript
3. **Mobile-First** — Design and build mobile layouts first
4. **Semantic HTML** — Use appropriate elements (`<nav>`, `<main>`, `<article>`)
5. **Component Reuse** — Extract patterns into reusable components

### Pre-Deployment Checklist

- [ ] No "Sherman Oaks Law Group" strings in codebase
- [ ] All pages pass Lighthouse accessibility audit (90+)
- [ ] All pages pass Lighthouse performance audit (90+)
- [ ] Contact form submits successfully
- [ ] All internal links work (no 404s)
- [ ] Mobile navigation functions correctly
- [ ] Images have appropriate alt text
- [ ] Meta descriptions set for all pages

---

## Approval

This document defines the technical foundation for the Gurovich Law Group website rebuild. No design or coding work should begin until this stack is approved.

**Stack Decision Status:** 🔒 LOCKED

---

*Document prepared by Manus AI — January 28, 2026*
