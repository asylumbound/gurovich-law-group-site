
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
