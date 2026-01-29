
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
