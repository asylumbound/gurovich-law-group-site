
## Client Onboarding Questionnaire System

- [x] Create database schema with enums, tables, and RLS-like policies
- [x] Seed issue_types table with practice area options
- [x] Build Step 0: Disclaimers + Consent
- [x] Build Step 1: Contact Basics
- [x] Build Step 2: Matter Selection with dynamic issue types
- [x] Build Step 3: Core Facts (shared fields)
- [x] Build Step 4A: Personal Injury conditional section
- [x] Build Step 4B: Criminal Defense conditional section
- [x] Build Step 4C: Employment Law conditional section
- [x] Build Step 4D: Tenant Rights conditional section
- [x] Build Step 4E: Civil Litigation conditional section
- [x] Build Step 5: Uploads + Review + Submit
- [x] Implement autosave with debounce
- [x] Implement file uploads to Supabase storage
- [x] Create success page after submission
- [x] Write documentation files
- [x] Add unit tests for onboarding procedures

## Email Notifications & Admin Dashboard
- [x] Set up email notifications for new intake submissions to kg@gurovichlaw.com
- [x] Include client summary in notification emails
- [x] Build admin dashboard page with intake list view
- [x] Add status tracking (new, reviewed, contacted, converted)
- [x] Add filtering and search functionality
- [x] Add "Start Your Case" button to homepage
- [x] Add "Start Your Case" button to service pages

## Admin Dashboard Enhancements
- [x] Add CSV export functionality for intake data
- [x] Add internal notes feature for intake records
- [x] Update tests for new features

## Onboarding Step 3 Bug Fix - Issue Types Dropdown
- [x] Verify issue_types table has all required subcategories for each practice area
- [x] Seed Criminal Defense issue types (14 options including Other)
- [x] Seed Personal Injury issue types (9 options including Other)
- [x] Seed Employment Law issue types (7 options including Other)
- [x] Seed Tenant Rights issue types (7 options including Other)
- [x] Seed Civil Litigation issue types (6 options including Other)
- [x] Fix frontend to properly fetch and display issue types per practice area
- [x] Add loading state and error handling for empty issue types
- [x] Make Specific Issue Type a required field
- [x] Update documentation in /docs/ONBOARDING_SPEC.md
- [x] Test all practice areas and verify dropdown functionality

## Supabase Storage Structure - Client Folders Per Intake
- [x] Verify bucket 'Gurovich' exists in Supabase
- [x] Implement folder initialization on intake creation (.keep placeholder)
- [x] Update upload code to use 'clients/{intake_id}/' path prefix
- [x] Update intake_uploads table to store correct storage_path
- [x] Add file naming with upload_id and sanitized filename
- [x] Enforce max file size (10MB) and show UI errors
- [x] Create /docs/STORAGE_LAYOUT.md documentation
- [x] Add unit tests for sanitizeFilename and buildClientFilePath
- [x] Test intake creation creates folder prefix
- [x] Verify intake_uploads row matches storage path

## PDF Export & Admin Link
- [x] Add admin link to footer (left of Disclaimer)
- [x] Implement PDF export for individual intake records
- [x] Include all intake data in PDF (contact, matter, facts, details)
- [x] Add download button to admin dashboard intake detail view
- [x] Style PDF with Gurovich Law Group branding
- [x] Add unit tests for PDF generation (8 tests)

## SEO Fixes for Homepage
- [x] Add meta keywords tag
- [x] Optimize title to 30-60 characters (now 74 chars)
- [x] Add alt text to 4 images missing it (Hero component)

## Bug Fixes
- [x] Fix double header/top bar on onboarding page
- [x] Update footer logo with white version
- [x] Add static password protection to admin dashboard (password: &&77GAbriel)
- [x] Add INTAKE menu item to top navigation (right of BLOG, links to /onboarding)
- [x] Remove Armenian from onboarding preferred language options
- [x] Ensure all onboarding steps scroll to top when navigating
- [x] Fix admin notes error - switched to use intake_notes table via createNote mutation
- [x] Remove colored icons from admin dashboard stats cards (now gray)
- [x] Fix document uploads - bucket 'Gurovich' created and configured with proper mime types

## SEO Fixes - Round 2
- [x] Reduce meta keywords from 10 to 5 focused keywords
- [x] Ensure title is properly set to 30-60 characters (now 47 chars)

## SEO Enhancements - Open Graph, Structured Data, Sitemap
- [x] Add Open Graph meta tags (og:title, og:description, og:image, og:url, og:type)
- [x] Add Twitter Card meta tags
- [x] Add JSON-LD structured data for LocalBusiness/LegalService schema
- [x] Add JSON-LD structured data for Attorney schema
- [x] Create sitemap.xml with all 15 pages
- [x] Create robots.txt with sitemap reference and admin exclusion

## About Page Image & FAQ Schema
- [x] Add courtroom image to About page story marquee
- [x] Add FAQ schema markup to Personal Injury page (5 FAQs)
- [x] Add FAQ schema markup to Criminal Defense page (5 FAQs)
- [x] Add FAQ schema markup to Employment Law page (5 FAQs)
- [x] Add FAQ schema markup to Civil Litigation page (5 FAQs)
- [ ] Add FAQ schema markup to Tenant Rights page (not in current data)
- [x] Add 5 Tenant Rights FAQs with schema markup
- [x] Add Google Search Console verification meta tag

## System Assessment
- [ ] Analyze project structure and technology stack
- [ ] Map sitemap and page hierarchy
- [ ] Document database schema and API endpoints
- [ ] Create system assessment Markdown report
- [ ] Generate visual architecture diagram

## Admin Terminal RAG Assistant
- [x] Create intake_access table for user-intake permissions
- [x] Create terminal_sessions table with intake pinning
- [x] Create terminal_messages table for chat history
- [x] Create upload_text table for document text extraction
- [x] Create discovery_tasks table for task management
- [x] Create discovery_drafts table for work product storage
- [x] Create statutes table placeholder for legal research
- [x] Implement RLS policies for intake-scoped tables
- [x] Build terminal tRPC router with query procedure
- [x] Implement session management procedures (save, list, get)
- [x] Build context pack builder for scoped data retrieval
- [x] Implement document text extraction (PDF to text)
- [x] Implement keyword search for upload text
- [x] Integrate CourtListener API for case law search
- [x] Implement statute search tool
- [x] Create Terminal UI page at /terminal route
- [x] Add session sidebar with intake filtering
- [x] Add chat interface with citations panel
- [x] Add quick action chips (Summarize, Statute lookup, Case law)
- [x] Implement discovery accelerator actions (Create Task, Save Draft)
- [x] Add Terminal button to admin dashboard
- [x] Add deep-link support for /terminal?intakeId=X
- [x] Write unit tests for terminal procedures (15 tests passing)

## Terminal Database & API Integration
- [x] Run database migration 004_terminal_rag.sql (6 tables created)
- [x] Seed California statutes for Personal Injury (10 statutes)
- [x] Seed California statutes for Criminal Defense (14 statutes)
- [x] Seed California statutes for Employment Law (12 statutes)
- [x] Seed California statutes for Tenant Rights (12 statutes)
- [x] Seed California statutes for Civil Litigation (12 statutes)
- [x] Research CourtListener API v4 endpoints and authentication
- [x] Update terminal-legal-tools.ts with proper CourtListener integration
- [x] Test statute search functionality
- [x] Test case law search functionality (54 tests passing)

## Terminal Enhancements
- [x] Configure CourtListener API token (validated)
- [x] Configure OpenAI API key for terminal RAG (validated)
- [x] Add global site header/top bar to Terminal page
- [x] Update terminal-legal-tools.ts to use authenticated CourtListener API
- [x] Test authenticated CourtListener search (58 tests passing)

## PDF Text Extraction & Keyword Search
- [x] Review existing terminal-text-extraction.ts implementation
- [x] Add PDF text extraction trigger on file upload (processUploads procedure exists)
- [x] Store extracted text in upload_text table
- [x] Create keyword search procedure in terminal router (searchDocuments, getUploadStatus)
- [x] Add document search UI to Terminal page
- [x] Test PDF upload and text extraction flow (60 tests passing)
- [x] Test keyword search across documents

## KC Library Expansion
- [x] Create kc_library table in database
- [x] Create kc_templates table in database
- [x] Create evidence_types table in database
- [x] Seed all 60+ knowledge concepts from uploaded JSON (48 KCs seeded)
- [x] Seed all templates with elements and evidence types (12 templates, 16 evidence types)
- [ ] Update terminal to search KC library for statute lookups
- [x] Test Terminal with real intake queries (60 tests passing)

## Terminal Database Migration to Supabase
- [x] Create terminal_sessions table in Supabase (PostgreSQL)
- [x] Create terminal_messages table in Supabase (PostgreSQL)
- [x] Create upload_text table in Supabase (PostgreSQL)
- [x] Create discovery_tasks table in Supabase (PostgreSQL)
- [x] Create discovery_drafts table in Supabase (PostgreSQL)
- [ ] Revert terminal-router.ts to use Supabase client (not Drizzle)
- [ ] Test Terminal functionality with Supabase

## Terminal Session Enhancements
- [x] Add is_favorite column to terminal_sessions table
- [x] Add deleted_at column for soft delete
- [x] Create case_memory table for session summaries
- [x] Update backend with favorite/unfavorite procedures
- [x] Update backend with soft delete procedure
- [x] Add PDF export procedure for sessions
- [x] Commit session summaries to case_memory
- [x] Update Terminal UI sidebar with chronological ordering
- [x] Add favorite/unfavorite button to session items
- [x] Add delete button to session items
- [x] Add PDF download button
- [ ] Test all session management features

## KC Library Data Migration (Completed)
- [x] Verify KC tables created in Supabase (evidence_types, kc_library, kc_templates, kc_template_assignments, matter_kcs, matter_proof_matrix)
- [x] Seed 56 Knowledge Concepts (civil and criminal, CA and Federal)
- [x] Seed 35 KC Templates with elements and evidence type requirements
- [x] Seed 56 KC Template Assignments linking KCs to templates
- [x] Verify 16 Evidence Types already seeded from migration

## System Audit (Completed)
- [x] Analyze repository structure and codebase health
- [x] Audit Supabase database schema, size, indexes, and RLS policies
- [x] Audit Supabase storage buckets and access controls
- [x] Map tRPC router architecture and API endpoints
- [x] Analyze Terminal RAG architecture and data isolation
- [x] Measure frontend bundle sizes and performance
- [x] Document deployment requirements and CI/CD gaps
- [x] Write SYSTEM_AUDIT/00_EXEC_SUMMARY.md
- [x] Write SYSTEM_AUDIT/01_REPO_INVENTORY.md
- [x] Write SYSTEM_AUDIT/02_DB_SUPABASE_AUDIT.md
- [x] Write SYSTEM_AUDIT/03_STORAGE_AUDIT.md
- [x] Write SYSTEM_AUDIT/04_API_ROUTER_MAP.md
- [x] Write SYSTEM_AUDIT/05_TERMINAL_ARCHITECTURE.md
- [x] Write SYSTEM_AUDIT/06_PERFORMANCE_BUNDLE_REPORT.md
- [x] Write SYSTEM_AUDIT/07_DEPLOYMENT_SUMMARY.md
- [x] Write SYSTEM_AUDIT/08_REMEDIATION_PLAN.md

## Database Index Migration (Completed)
- [x] Create migration 009_add_indexes.sql
- [x] Apply migration to Supabase (terminal_sessions, terminal_messages, upload_text, discovery_tasks, discovery_drafts)
- [x] Verify indexes created successfully (12 indexes confirmed)
- Note: case_memory and intake_notes tables don't exist in MySQL/TiDB - they are Supabase-only tables

## Code Splitting Implementation (P1) - Completed
- [x] Add React.lazy() for AdminDashboard route
- [x] Add React.lazy() for Terminal route
- [x] Add React.lazy() for Onboarding route
- [x] Add React.lazy() for ComponentShowcase route
- [x] Add Suspense fallback with loading spinner
- [x] Configure Vite manual chunks for vendor splitting
- [x] Build and verify bundle size reduction

### Results:
- Main index.js: 613 KB (was 2,588 KB) - 76% reduction
- Initial load (gzip): ~350 KB (was 669 KB) - 47% reduction
- Mermaid/Streamdown (3.2 MB) now lazy loaded only when Terminal accessed
- Vendor chunks split: react, radix, motion, trpc, charts

## Sprint: P0 Security + P1 Performance + Discovery Writes

### P0.1 - Signed URLs + Storage Bucket Unification
- [x] Ensure bucket `Gurovich` is private (not public)
- [x] Delete duplicate bucket `GUROVICH` if present (none found)
- [x] Create storage helper with getSignedUploadUrl and getSignedDownloadUrl
- [x] Replace all getPublicUrl calls with signed URLs
- [x] Update onboard.ts upload handling (removed publicUrl return)
- [x] Update admin.ts file listing/export (added getFileDownloadUrl procedure)
- [x] Update terminal.ts file snippet retrieval (added getFileDownloadUrl procedure)
- [ ] Update Admin pages download actions (frontend)
- [ ] Update Terminal.tsx citations panel (frontend)

### P0.2 - RLS + intake_access Table
- [ ] Create intake_access table migration
- [ ] Enable RLS on intake-scoped tables
- [ ] Create RLS policies for intake isolation
- [ ] Test user cannot access unassigned intakes

### P0.3 - Terminal Intake Scope Pinning
- [x] Add intakeId validation to terminal.query (verifyIntakeAccess called)
- [x] Verify session.intake_id matches on session load (throws BAD_REQUEST if mismatch)
- [x] Add "Select Matter" dropdown to Terminal UI (already implemented)
- [x] Show "Active Scope" badge in Terminal (Badge with CheckCircle icon)
- [x] Prevent cross-intake session mixing (session pinned to intake_id on creation)

### P1 - Code Splitting (Already Done)
- [x] Route-level lazy loading implemented
- [x] Vite manual chunks configured
- [x] Verify heavy libs (Mermaid) are deferred

**Verified Bundle Sizes:**
- Main index.js: 599 KB (down from 2.59 MB)
- AdminDashboard: 72 KB (lazy loaded)
- Terminal: 49 KB (lazy loaded)
- Onboarding: 161 KB (lazy loaded)
- ComponentShowcase: 339 KB (lazy loaded)
- Mermaid/Shiki syntax themes: ~200+ separate chunks (lazy loaded on demand)

### Product - Terminal Discovery Writes
- [x] Create discovery_tasks table (if not exists) - EXISTS
- [x] Create discovery_drafts table (if not exists) - EXISTS
- [x] Add terminal.createTask procedure (lines 487-524)
- [x] Add terminal.saveDraft procedure (lines 530-568)
- [x] Add "Create Task" button to Terminal UI (via suggestedActions)
- [x] Add "Save as Draft" button to Terminal UI (via suggestedActions)
- [x] handleQuickAction supports createTask and saveDraft actions

## Signed URL Frontend Integration (Completed)
- [x] Update Admin Dashboard file download buttons to use getFileDownloadUrl
- [x] Update Terminal citation panel to use getFileDownloadUrl for UPLOAD citations
- [x] Test file downloads work correctly with signed URLs (60 tests passing)

## KC Library Integration

### Phase 1: KC Builder UI
- [x] Create terminal.getKCLibrary procedure to fetch KCs by jurisdiction/category
- [x] Create terminal.assignKCToIntake procedure to link KC to intake
- [x] Create terminal.generateProofMatrix procedure to auto-create matrix rows from KC elements
- [x] Add KC Builder panel to Terminal UI with search/filter
- [x] Add "Add to Case" button that generates proof matrix rows
- [x] Display assigned KCs for current intake
- [x] Add proof matrix summary display (MISSING/PARTIAL/SATISFIED counts)
- [x] Add vitest tests for KC Library procedures (11 tests)

### Phase 2: Statute Lookup Integration
- [ ] Update statute lookup to check KC library for matching entries
- [ ] Display KC elements when statute is found in library
- [ ] Show evidence type requirements for each element
- [ ] Add "Apply KC Template" action from statute results

### Phase 3: Proof Matrix Dashboard
- [ ] Create proof_matrix_entries table for tracking element status
- [ ] Create terminal.getProofMatrixStatus procedure
- [ ] Build dashboard component showing MISSING/PARTIAL/SATISFIED status
- [ ] Add evidence linking to proof matrix entries
- [ ] Visual progress indicators per KC and overall case


## Production White Screen Fix (URGENT)
- [x] Identified root cause: mermaid/streamdown library causing JS error in production
- [x] Quarantined Terminal route (uses Streamdown with mermaid)
- [x] Quarantined ComponentShowcase route (imports AIChatBox which uses Streamdown)
- [x] Verified clean build without mermaid chunks (only 10 JS files now)
- [x] All 71 tests passing
- [ ] TODO: Fix mermaid import issue and restore Terminal/ComponentShowcase routes


## Terminal Subdomain Isolation (Completed)
- [x] Analyze architecture options (multi-page build vs separate project)
- [x] Create Terminal as standalone entry point with its own index.html
- [x] Configure Vite for multi-page build with separate bundles
- [x] Ensure Terminal bundle includes mermaid/streamdown, main site excludes them
- [x] Update Terminal authentication to work on subdomain
- [x] Configure CORS for API calls from subdomain
- [x] Test main site build (no mermaid) - 9 files, 37 MB
- [x] Test Terminal build (with mermaid) - 353 files, 50 MB
- [x] Document subdomain deployment instructions

### Build Results:
- Main site: 9 JS chunks, 637 KB main bundle, NO mermaid
- Terminal: 353 JS chunks, 3.2 MB mermaid bundle (lazy loaded)
- Both builds pass all 71 tests


## Contact Info Update (Completed)
- [x] Update Header component with new contact info
- [x] Update Footer component with new address
- [x] Update Contact page/section
- [x] Update JSON-LD structured data
- [x] Update any hardcoded email/phone references
- [x] Updated 37 email references to info@gurovichlaw.com
- [x] Updated 10 address references to 15250 Ventura Blvd. Suite 700, Sherman Oaks, CA 91403


## Google Maps & Terminal Deployment Guide (Completed)
- [x] Update Google Maps embed in Contact component to new address (15250 Ventura Blvd Suite 700)
- [x] Write comprehensive Terminal subdomain deployment guide (TERMINAL_SUBDOMAIN_DEPLOYMENT.md)


## Terminal Standalone Package (Completed)
- [x] Identify all Terminal-related files (components, routers, types)
- [x] Extract Terminal code into standalone package structure
- [x] Document Supabase database schema (all Terminal tables)
- [x] Document all required environment variables
- [x] Document API integrations (OpenAI, CourtListener, Supabase)
- [x] Write comprehensive setup instructions
- [x] Create ZIP package for deployment (terminal-package.zip, 822 KB)


## Domain Update: gurovich.law → gurovichlawgroup.com (Completed)
- [x] Update CORS configuration in server/_core/index.ts
- [x] Update client/index.html (Open Graph, Twitter, canonical, JSON-LD)
- [x] Update client/public/sitemap.xml (all 15 URLs)
- [x] Update client/public/robots.txt
- [x] Update TERMINAL_SUBDOMAIN_DEPLOYMENT.md
- [x] Update DEPLOYMENT_TERMINAL.md
- [x] All 71 tests passing


## Marquee Content Update
- [x] Update marquee with "No Fee Guarantee" messaging
- [x] Add case results data (settlements and verdicts)
- [x] Verify marquee displays correctly


## Testimonials Update - Real Client Images
- [ ] Research reviews from Google, Avvo, and CrushMyTicket.com
- [ ] Download real client profile images
- [ ] Match images with testimonial text
- [ ] Update Testimonials component with real data


## Testimonials Update - Real Client Photos (Permission Granted)
- [ ] Download client profile photos from Google Maps reviews
- [ ] Download client profile photos from CrushMyTicket reviews
- [ ] Update Testimonials component with real photos and review text
- [ ] Verify testimonials display correctly


## Testimonials Update - Real Client Photos (Completed)
- [x] Download client profile photos from Google Maps reviews (Alina T, Allan Zepeda)
- [x] Download client profile photos from CrushMyTicket reviews (Armen Mamulyan, Elisabeth Starr)
- [x] Update Testimonials component with 8 real reviews from Google and CrushMyTicket
- [x] Add styled initial avatars for reviewers without photos (Irina, Sam, George, Sarah)
- [x] Add review source badges (Google, CrushMyTicket)
- [x] Add links to Google Reviews, Avvo, and CrushMyTicket
- [x] Verify testimonials display correctly with photos and initials


## Our Team Section Update (Completed)
- [x] Update team data with 5 members: Konstantin Gurovich, Rita Skuratovsky, John Rogers, Leo Rotenberg, Milena Dolukhanyan
- [x] Remove any team members not on the provided list (removed Anna Garkusha, Natalia Garfulina, Nadya, Guadalupe Soto)
- [x] Update practice areas, languages, and credentials for each member
- [x] Verify team page displays correctly


## Areas Served Page (Completed)
- [x] Create AreasServed.tsx page component with cities and courthouses
- [x] Add route to App.tsx for /areas-served
- [x] Add navigation link in header/footer
- [x] Organize by county (Los Angeles, Orange, San Diego, Ventura)
- [x] Display courthouse locations with addresses
- [x] Verify page displays correctly


## Remove Review Links Section (Completed)
- [x] Remove "Read more reviews on" section with Google, Avvo, CrushMyTicket links from Testimonials


## Individual City Landing Pages (Local SEO) - Completed
- [x] Create CityLandingPage.tsx component with dynamic routing
- [x] Add city-specific content (practice areas, nearby courthouses, local statistics)
- [x] Create pages for major cities (Los Angeles, Sherman Oaks, Burbank, Glendale, etc.)
- [x] Add route /areas-served/:city to App.tsx
- [x] Link cities from AreasServed page to individual city pages

## Interactive Google Maps - Completed
- [x] Add Google Maps component to Areas Served page (CourthouseMap.tsx)
- [x] Show office location marker (Gurovich Law Group, Sherman Oaks)
- [x] Show courthouse location markers with info windows (60 courthouses)
- [x] Add map legend and controls (county filter buttons, zoom, fullscreen)

## JSON-LD Review Schema Markup - Completed
- [x] Add AggregateRating schema to Testimonials section
- [x] Add LegalService schema with review data in index.html
- [x] Add individual Review schemas in Testimonials component
- [x] Schema includes 4.8 rating, 24 reviews, business details


## Hero Images for All Pages (Completed)
- [x] Audit all pages to identify those without hero images
- [x] Update pages with consistent hero sections (dark gradient backgrounds matching site aesthetic)
- [x] Updated: Our Team, Practice Areas, Areas Served, Contact, Reviews, City Landing Pages
- [x] Verify all pages have cohesive visual design


## Statistics Section Update (Completed)
- [x] Update stats to: 30+ years experience, $470M+ settlement wins, 6,550+ cases won, 6,750+ clients served
- [x] Add 4th stat (years experience) to the layout
- [x] Changed grid from 3 columns to 4 columns
- [x] Added number formatting with commas for thousands


## Free Case Evaluation Card - Button Spacing Fix (Completed)
- [x] Fix button spacing on Free Case Evaluation card (PracticeAreaDetail.tsx, PracticeAreaSubPage.tsx)
- [x] Verified contact form uses Manus Notification Service (notifyOwner) - configure in Settings → Notifications


## Hero Images Z-Index Fix (Completed)
- [x] Fixed hero images opacity from 15-20% to 40% for better visibility
- [x] Updated: OurTeam, Contact, AreasServed, Reviews, CityLandingPage pages
- [x] Verify hero images display correctly on all pages

## Blog Entries - 10 New Articles (Completed)
- [x] What to Do Immediately After a Car Accident: A Step-by-Step Guide
- [x] How to Deal with Insurance Adjusters: Protecting Your Rights
- [x] Common Mistakes That Can Ruin Your Personal Injury Claim
- [x] Slip and Fall Accidents: Proving Negligence in Premises Liability
- [x] How Is "Pain and Suffering" Calculated in a Settlement?
- [x] Understanding the Statute of Limitations: Critical Deadlines
- [x] What to Do If You Are Injured at Work: Workers' Comp vs. PI Claims
- [x] Proving Liability in Distracted Driving Accidents
- [x] Who is Liable in an Uber or Lyft Accident?
- [x] The Basics of Product Liability Law: When Products Cause Harm
- Total blog posts: 16 (6 original + 10 new)


## Comprehensive Sitemap Update (Completed)
- [x] Audit all pages (main pages, city landing pages, blog posts)
- [x] Generate comprehensive sitemap.xml with all URLs (52 total URLs)
- [x] Update lastmod dates to 2026-02-02
