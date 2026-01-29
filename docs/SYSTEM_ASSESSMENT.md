# Gurovich Law Group Website - System Assessment

**Document Version:** 1.0  
**Assessment Date:** January 29, 2026  
**Website URL:** https://www.gurovich.law (also: shermanoakslawgroup.com)

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Architecture Overview](#architecture-overview)
3. [Technology Stack](#technology-stack)
4. [Sitemap & Page Hierarchy](#sitemap--page-hierarchy)
5. [Database Schema](#database-schema)
6. [API Endpoints](#api-endpoints)
7. [File Storage Structure](#file-storage-structure)
8. [Authentication & Security](#authentication--security)
9. [File Structure](#file-structure)
10. [Testing Coverage](#testing-coverage)
11. [SEO Implementation](#seo-implementation)
12. [Future Enhancements](#future-enhancements)

---

## Executive Summary

The Gurovich Law Group website is a full-stack legal services platform built with modern web technologies. The system serves five practice areas (Personal Injury, Criminal Defense, Employment Law, Civil Litigation, and Tenant Rights) and includes a comprehensive client intake system with document management, an admin dashboard for case management, and robust SEO optimization.

### Key Metrics

| Metric | Value |
|--------|-------|
| **Total Pages** | 15+ public pages |
| **Practice Areas** | 5 |
| **Issue Types Seeded** | 70+ |
| **Test Coverage** | 39 tests passing |
| **Supported Languages** | 4 (English, Spanish, Russian, Ukrainian) |

---

## Architecture Overview

The application follows a **three-tier architecture** with clear separation between the presentation layer, business logic, and data storage.

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                              │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  React 19 + TypeScript + Tailwind CSS 4                 │    │
│  │  ├── Wouter (Routing)                                   │    │
│  │  ├── React Query + tRPC Client                          │    │
│  │  └── Shadcn/UI Components                               │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼ HTTP/tRPC
┌─────────────────────────────────────────────────────────────────┐
│                        SERVER LAYER                              │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  Express.js + tRPC 11 + Node.js                         │    │
│  │  ├── onboardRouter (Client Intake)                      │    │
│  │  ├── adminRouter (Dashboard Management)                 │    │
│  │  └── authRouter (Manus OAuth)                           │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼ SQL / Storage API
┌─────────────────────────────────────────────────────────────────┐
│                        DATA LAYER                                │
│  ┌──────────────────────┐    ┌──────────────────────────────┐   │
│  │  Supabase PostgreSQL │    │  Supabase Storage            │   │
│  │  ├── intakes         │    │  ├── Bucket: "Gurovich"      │   │
│  │  ├── intake_notes    │    │  └── Path: clients/{id}/     │   │
│  │  ├── intake_uploads  │    └──────────────────────────────┘   │
│  │  ├── intake_parties  │                                       │
│  │  ├── issue_types     │                                       │
│  │  └── practice tables │                                       │
│  └──────────────────────┘                                       │
└─────────────────────────────────────────────────────────────────┘
```

### Data Flow

1. **Client Request** → React frontend makes tRPC calls
2. **tRPC Router** → Express server processes request through appropriate router
3. **Business Logic** → Server validates, processes, and interacts with Supabase
4. **Data Storage** → Supabase handles PostgreSQL queries and file storage
5. **Response** → Data flows back through tRPC with type safety

---

## Technology Stack

### Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 19.2.1 | UI Framework |
| **TypeScript** | 5.9.3 | Type Safety |
| **Tailwind CSS** | 4.1.14 | Styling |
| **Wouter** | 3.3.5 | Client-side Routing |
| **React Query** | 5.90.2 | Server State Management |
| **tRPC Client** | 11.6.0 | Type-safe API Calls |
| **Framer Motion** | 12.23.22 | Animations |
| **Shadcn/UI** | Latest | Component Library |
| **Lucide React** | 0.453.0 | Icons |

### Backend

| Technology | Version | Purpose |
|------------|---------|---------|
| **Node.js** | 22.x | Runtime |
| **Express** | 4.21.2 | HTTP Server |
| **tRPC Server** | 11.6.0 | API Framework |
| **Zod** | 4.1.12 | Schema Validation |
| **Superjson** | 1.13.3 | Data Serialization |
| **jsPDF** | 4.0.0 | PDF Generation |
| **nanoid** | 5.1.5 | ID Generation |

### Database & Storage

| Technology | Purpose |
|------------|---------|
| **Supabase PostgreSQL** | Primary Database |
| **Supabase Storage** | File Storage (Bucket: "Gurovich") |
| **Drizzle ORM** | Database Migrations (MySQL/TiDB for auth) |

### Development Tools

| Tool | Version | Purpose |
|------|---------|---------|
| **Vite** | 7.1.7 | Build Tool |
| **Vitest** | 2.1.4 | Testing Framework |
| **pnpm** | 10.4.1 | Package Manager |
| **Prettier** | 3.6.2 | Code Formatting |
| **ESBuild** | 0.25.0 | Production Bundling |

---

## Sitemap & Page Hierarchy

### Public Pages (15 total)

```
https://www.gurovich.law/
├── / (Home)
├── /about (About Us)
├── /practice-areas (Practice Areas Overview)
│   ├── /practice-areas/personal-injury
│   │   └── /practice-areas/personal-injury/{subpage}
│   ├── /practice-areas/criminal-defense
│   │   └── /practice-areas/criminal-defense/{subpage}
│   ├── /practice-areas/employment-law
│   │   └── /practice-areas/employment-law/{subpage}
│   ├── /practice-areas/tenant-rights
│   │   └── /practice-areas/tenant-rights/{subpage}
│   └── /practice-areas/civil-litigation
│       └── /practice-areas/civil-litigation/{subpage}
├── /team (Our Team)
├── /reviews (Client Reviews)
├── /blog (Blog)
│   └── /blog/{slug} (Blog Post)
├── /contact (Contact)
├── /onboarding (Client Intake Form)
│   └── /onboarding/success (Submission Confirmation)
├── /privacy (Privacy Policy)
├── /terms (Terms of Service)
└── /disclaimer (Legal Disclaimer)
```

### Protected Pages

| Route | Access | Description |
|-------|--------|-------------|
| `/admin` | Password Protected | Admin Dashboard |

### Sitemap Priority

| Page | Priority | Change Frequency |
|------|----------|------------------|
| Home | 1.0 | Weekly |
| Practice Areas | 0.9 | Monthly |
| Onboarding | 0.9 | Monthly |
| About, Contact, Practice Area Details | 0.8 | Monthly |
| Team, Reviews | 0.7 | Weekly |
| Blog | 0.6 | Weekly |
| Privacy, Disclaimer | 0.3 | Yearly |

---

## Database Schema

### Supabase Tables

#### `intakes` (Main Intake Records)

| Column | Type | Description |
|--------|------|-------------|
| `id` | SERIAL | Primary key (UUID) |
| `draft_token` | VARCHAR(32) | Unique token for draft access |
| `status` | ENUM | draft, submitted, reviewed, contacted, converted, closed |
| `first_name` | VARCHAR | Client first name |
| `last_name` | VARCHAR | Client last name |
| `phone` | VARCHAR | Contact phone |
| `email` | VARCHAR | Contact email |
| `city` | VARCHAR | Client city |
| `state` | VARCHAR(2) | Client state |
| `practice_area` | ENUM | personal_injury, criminal_defense, employment_law, tenant_rights, civil_litigation |
| `issue_type_id` | INTEGER | FK to issue_types |
| `urgency` | ENUM | emergency, high, normal, unsure |
| `summary` | TEXT | Case summary |
| `incident_date` | DATE | Date of incident |
| `incident_city` | VARCHAR | Incident location |
| `incident_state` | VARCHAR(2) | Incident state |
| `agency_involved` | BOOLEAN | Police/agency involved |
| `agency_name` | VARCHAR | Agency name |
| `report_number` | VARCHAR | Report/case number |
| `has_documents` | BOOLEAN | Has supporting documents |
| `additional_notes` | TEXT | Client notes |
| `admin_notes` | TEXT | Internal admin notes (legacy) |
| `preferred_contact_method` | ENUM | phone, email, text |
| `preferred_language` | ENUM | en, es, ru, uk |
| `consent_no_attorney_relationship` | BOOLEAN | Consent flag |
| `consent_contact` | BOOLEAN | Contact consent |
| `created_at` | TIMESTAMPTZ | Creation timestamp |
| `updated_at` | TIMESTAMPTZ | Last update |

#### `intake_notes` (Internal Notes System)

| Column | Type | Description |
|--------|------|-------------|
| `id` | SERIAL | Primary key |
| `intake_id` | INTEGER | FK to intakes |
| `author_name` | VARCHAR | Note author |
| `content` | TEXT | Note content |
| `created_at` | TIMESTAMPTZ | Creation timestamp |

#### `intake_uploads` (File Metadata)

| Column | Type | Description |
|--------|------|-------------|
| `id` | SERIAL | Primary key |
| `intake_id` | INTEGER | FK to intakes |
| `storage_bucket` | VARCHAR | Always "Gurovich" |
| `storage_path` | TEXT | Full path in bucket |
| `file_path` | TEXT | Alias (backwards compatibility) |
| `file_name` | VARCHAR | Display name |
| `original_filename` | VARCHAR | Original uploaded name |
| `file_size` | INTEGER | Size in bytes |
| `mime_type` | VARCHAR | MIME type |
| `tag` | ENUM | police_report, medical, contract, notice, photos, emails, other |
| `created_at` | TIMESTAMPTZ | Upload timestamp |

#### `intake_parties` (Involved Parties)

| Column | Type | Description |
|--------|------|-------------|
| `id` | SERIAL | Primary key |
| `intake_id` | INTEGER | FK to intakes |
| `party_type` | ENUM | individual, business, government |
| `party_role` | ENUM | defendant, witness, other |
| `name` | VARCHAR | Party name |
| `phone` | VARCHAR | Contact phone |
| `email` | VARCHAR | Contact email |

#### `issue_types` (70+ Seeded Issue Types)

| Column | Type | Description |
|--------|------|-------------|
| `id` | SERIAL | Primary key |
| `practice_area` | ENUM | Practice area category |
| `name` | VARCHAR | Issue type name |
| `description` | TEXT | Description |

#### Practice-Specific Detail Tables

| Table | Practice Area |
|-------|---------------|
| `intake_pi_details` | Personal Injury |
| `intake_criminal_details` | Criminal Defense |
| `intake_employment_details` | Employment Law |
| `intake_tenant_details` | Tenant Rights |
| `intake_civil_details` | Civil Litigation |

### MySQL/TiDB Tables (Auth System)

#### `users` (Manus OAuth)

| Column | Type | Description |
|--------|------|-------------|
| `id` | INT | Auto-increment PK |
| `openId` | VARCHAR(64) | Manus OAuth ID |
| `name` | TEXT | User name |
| `email` | VARCHAR(320) | User email |
| `loginMethod` | VARCHAR(64) | OAuth method |
| `role` | ENUM | user, admin |
| `createdAt` | TIMESTAMP | Creation time |
| `updatedAt` | TIMESTAMP | Last update |
| `lastSignedIn` | TIMESTAMP | Last login |

---

## API Endpoints

### tRPC Routes

All API calls are made through tRPC at `/api/trpc/*`.

#### Authentication (`auth.*`)

| Procedure | Type | Description |
|-----------|------|-------------|
| `auth.me` | Query | Get current user |
| `auth.logout` | Mutation | Clear session |

#### Onboarding (`onboard.*`)

| Procedure | Type | Description |
|-----------|------|-------------|
| `onboard.getIssueTypes` | Query | Get issue types by practice area |
| `onboard.createDraft` | Mutation | Create new intake draft |
| `onboard.getByToken` | Query | Get intake by draft token |
| `onboard.updateStep1` | Mutation | Update contact info |
| `onboard.updateStep2` | Mutation | Update matter selection |
| `onboard.updateStep3` | Mutation | Update core facts |
| `onboard.updateStep4` | Mutation | Update practice-specific details |
| `onboard.uploadFile` | Mutation | Upload document to storage |
| `onboard.deleteFile` | Mutation | Delete uploaded document |
| `onboard.updateNotes` | Mutation | Update additional notes |
| `onboard.submit` | Mutation | Submit intake (finalize) |

#### Admin (`admin.*`)

| Procedure | Type | Description |
|-----------|------|-------------|
| `admin.getIntakes` | Query | List intakes with filters |
| `admin.getIntake` | Query | Get single intake details |
| `admin.updateStatus` | Mutation | Update intake status |
| `admin.addNote` | Mutation | Add internal note (legacy) |
| `admin.exportCSV` | Query | Export intakes to CSV |
| `admin.getNotes` | Query | Get intake notes |
| `admin.createNote` | Mutation | Create internal note |
| `admin.deleteNote` | Mutation | Delete internal note |
| `admin.generatePDF` | Query | Generate intake PDF |

---

## File Storage Structure

### Supabase Storage Configuration

| Property | Value |
|----------|-------|
| **Bucket Name** | `Gurovich` |
| **Access Level** | Public (with RLS) |
| **Max File Size** | 10MB |

### Path Scheme

```
clients/{intake_id}/{upload_id}-{sanitized_filename}
```

### Example Structure

```
Gurovich/
└── clients/
    ├── 42/
    │   ├── manifest.json
    │   ├── xK7mN2pQ9rS4tU6v-medical_records.pdf
    │   └── aB3cD4eF5gH6iJ7k-photo_evidence.jpg
    └── 43/
        ├── manifest.json
        └── mN8oP9qR0sT1uV2w-contract.pdf
```

### Supported File Types

| Category | MIME Types | Max Size |
|----------|------------|----------|
| Images | `image/png`, `image/jpeg`, `image/gif` | 10MB |
| Documents | `application/pdf` | 10MB |
| Word | `application/msword`, `.docx` | 10MB |

---

## Authentication & Security

### Admin Dashboard Access

| Method | Details |
|--------|---------|
| **Type** | Static Password |
| **Password** | `&&77GAbriel` |
| **Storage** | sessionStorage |
| **Persistence** | Browser session only |

### Manus OAuth (User Authentication)

| Component | Description |
|-----------|-------------|
| **Provider** | Manus OAuth |
| **Session** | JWT Cookie |
| **Protected Routes** | Admin procedures require `role: admin` |

### Security Measures

1. **Draft Token Validation** - All intake operations require valid draft token
2. **File Type Validation** - Server-side MIME type checking
3. **File Size Limits** - 10MB maximum per file
4. **RLS Policies** - Supabase Row Level Security
5. **Service Role Key** - Server-side only file operations

---

## File Structure

```
gurovich-law-group-site/
├── client/
│   ├── index.html                    # Entry HTML with SEO meta tags
│   ├── public/
│   │   ├── sitemap.xml               # SEO sitemap
│   │   ├── robots.txt                # Crawler directives
│   │   └── images/                   # Static assets
│   └── src/
│       ├── App.tsx                   # Main router
│       ├── main.tsx                  # Entry point with providers
│       ├── index.css                 # Global styles
│       ├── components/
│       │   ├── Header.tsx            # Navigation
│       │   ├── Footer.tsx            # Footer with admin link
│       │   ├── Layout.tsx            # Page wrapper
│       │   ├── onboarding/           # Intake form steps
│       │   │   ├── Step0Consent.tsx
│       │   │   ├── Step1Contact.tsx
│       │   │   ├── Step2Matter.tsx
│       │   │   ├── Step3Facts.tsx
│       │   │   ├── Step4Details.tsx
│       │   │   └── Step5Review.tsx
│       │   └── ui/                   # Shadcn components
│       ├── pages/
│       │   ├── Home.tsx
│       │   ├── AboutUs.tsx
│       │   ├── PracticeAreas.tsx
│       │   ├── PracticeAreaDetail.tsx
│       │   ├── Onboarding.tsx
│       │   ├── AdminDashboard.tsx
│       │   └── ...
│       ├── contexts/                 # React contexts
│       ├── hooks/                    # Custom hooks
│       ├── data/                     # Static data
│       └── i18n/                     # Translations
├── server/
│   ├── routers.ts                    # Main tRPC router
│   ├── onboard-router.ts             # Intake procedures
│   ├── admin-router.ts               # Admin procedures
│   ├── intake-storage.ts             # Supabase storage helpers
│   ├── intake-pdf.ts                 # PDF generation
│   ├── supabase.ts                   # Supabase client
│   ├── db.ts                         # Database helpers
│   └── _core/                        # Framework internals
├── shared/
│   ├── const.ts                      # Shared constants
│   ├── types.ts                      # Shared types
│   └── onboard-validation.ts         # Zod schemas
├── drizzle/
│   ├── schema.ts                     # MySQL schema
│   └── migrations/                   # Migration files
├── docs/
│   ├── STORAGE_LAYOUT.md             # Storage documentation
│   └── SYSTEM_ASSESSMENT.md          # This document
└── package.json
```

---

## Testing Coverage

### Test Summary

| Category | Tests | Status |
|----------|-------|--------|
| **Total** | 39 | ✅ Passing |
| Auth | 1 | ✅ |
| Onboarding | 8 | ✅ |
| Admin | 14 | ✅ |
| Storage | 8 | ✅ |
| PDF Generation | 8 | ✅ |

### Test Files

| File | Description |
|------|-------------|
| `server/auth.logout.test.ts` | Authentication tests |
| `server/onboard-router.test.ts` | Intake procedure tests |
| `server/admin-router.test.ts` | Admin procedure tests |
| `server/intake-storage.test.ts` | Storage helper tests |
| `server/intake-pdf.test.ts` | PDF generation tests |
| `server/supabase.test.ts` | Supabase client tests |

---

## SEO Implementation

### Meta Tags

| Tag | Implementation |
|-----|----------------|
| **Title** | "Gurovich Law Group \| Los Angeles Injury Lawyers" (47 chars) |
| **Description** | Comprehensive description of services |
| **Keywords** | 5 focused keywords |
| **Viewport** | Responsive meta tag |
| **Canonical** | Self-referencing canonical URLs |

### Open Graph Tags

| Tag | Value |
|-----|-------|
| `og:type` | website |
| `og:site_name` | Gurovich Law Group |
| `og:title` | Dynamic per page |
| `og:description` | Dynamic per page |
| `og:image` | Logo image |
| `og:url` | Page URL |

### Twitter Cards

| Tag | Value |
|-----|-------|
| `twitter:card` | summary_large_image |
| `twitter:title` | Dynamic per page |
| `twitter:description` | Dynamic per page |

### Structured Data (JSON-LD)

| Schema | Implementation |
|--------|----------------|
| **LegalService** | Business info, contact, practice areas |
| **Attorney** | Attorney profile information |
| **FAQPage** | FAQ sections on practice area pages |

### Technical SEO

| Item | Status |
|------|--------|
| sitemap.xml | ✅ 15 pages |
| robots.txt | ✅ Admin excluded |
| Google Search Console | ✅ Verification tag added |
| Semantic HTML | ✅ Proper heading hierarchy |
| Alt Text | ✅ All images |

---

## Future Enhancements

### Planned Features

| Feature | Priority | Description |
|---------|----------|-------------|
| Attorney Photos | High | Add photos to Our Team page |
| Custom OG Image | High | 1200x630px social sharing image |
| Email Notifications | Medium | Intake status change alerts |
| Dashboard Analytics | Medium | Charts and metrics |
| Google Search Console Submission | High | Submit sitemap |

### Technical Improvements

| Improvement | Priority |
|-------------|----------|
| Enhanced RLS policies | Medium |
| Rate limiting | Low |
| Error monitoring (Sentry) | Low |
| Performance optimization | Low |

---

## Appendix

### Environment Variables

| Variable | Purpose |
|----------|---------|
| `SUPABASE_URL` | Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-side Supabase access |
| `SUPABASE_ANON_KEY` | Client-side Supabase access |
| `JWT_SECRET` | Session signing |
| `VITE_APP_ID` | Manus OAuth app ID |
| `OAUTH_SERVER_URL` | Manus OAuth backend |
| `VITE_OAUTH_PORTAL_URL` | Manus login portal |

### Quick Commands

```bash
# Development
pnpm dev

# Build
pnpm build

# Run tests
pnpm test

# Database push
pnpm db:push

# Format code
pnpm format
```

---

*Document generated by Manus AI on January 29, 2026*
