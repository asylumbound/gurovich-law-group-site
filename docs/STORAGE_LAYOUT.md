# Supabase Storage Layout

This document describes the file storage structure for client intake documents in the Gurovich Law Group application.

## Overview

All client-uploaded files are stored in Supabase Storage using a consistent, organized structure that ensures:

- Each client's files are isolated in their own folder
- Files are easily identifiable and traceable
- Access control can be applied at the folder level
- The Supabase UI displays a clear folder hierarchy

## Bucket Configuration

| Property | Value |
|----------|-------|
| **Bucket Name** | `Gurovich` |
| **Access Level** | Public (with RLS policies) |
| **Region** | Supabase default |

## Path Scheme

All files follow this path structure:

```
clients/{intake_id}/{upload_id}-{sanitized_filename}
```

### Components

| Component | Description | Example |
|-----------|-------------|---------|
| `clients/` | Root prefix for all client files | `clients/` |
| `{intake_id}` | The intake's database ID (integer) | `42` |
| `{upload_id}` | Unique 16-character nanoid | `xK7mN2pQ9rS4tU6v` |
| `{sanitized_filename}` | Cleaned filename (see rules below) | `medical_records.pdf` |

### Example Paths

```
clients/42/.keep                                    # Folder placeholder
clients/42/xK7mN2pQ9rS4tU6v-medical_records.pdf   # Uploaded PDF
clients/42/aB3cD4eF5gH6iJ7k-photo_evidence.jpg    # Uploaded image
clients/42/mN8oP9qR0sT1uV2w-contract.pdf          # Another document
```

## Filename Sanitization Rules

Before storing, filenames are sanitized as follows:

1. **Spaces** → Replaced with underscores (`_`)
2. **Special characters** → Removed (only `a-z`, `A-Z`, `0-9`, `_`, `-` allowed)
3. **Extension** → Converted to lowercase
4. **Length** → Truncated to 100 characters maximum (including extension)

### Examples

| Original Filename | Sanitized Filename |
|-------------------|-------------------|
| `Medical Records (2024).pdf` | `Medical_Records_2024.pdf` |
| `photo #1 @home!.jpg` | `photo_1_home.jpg` |
| `Contract & Agreement.PDF` | `Contract__Agreement.pdf` |

## Folder Initialization

When a new intake is created:

1. A `.keep` placeholder file is created at `clients/{intake_id}/.keep`
2. This ensures the folder appears in the Supabase UI immediately
3. The placeholder is a zero-byte file

## Database Schema

Upload metadata is stored in the `intake_uploads` table:

| Column | Type | Description |
|--------|------|-------------|
| `id` | SERIAL | Primary key |
| `intake_id` | INTEGER | Foreign key to intakes table |
| `storage_bucket` | VARCHAR | Always `Gurovich` |
| `storage_path` | TEXT | Full path in bucket |
| `file_path` | TEXT | Alias for storage_path (backwards compatibility) |
| `file_name` | VARCHAR | Display name |
| `original_filename` | VARCHAR | Original uploaded filename |
| `file_size` | INTEGER | Size in bytes |
| `mime_type` | VARCHAR | MIME type |
| `tag` | ENUM | Document category |
| `created_at` | TIMESTAMPTZ | Upload timestamp |

## Supported File Types

| Type | MIME Types | Max Size |
|------|------------|----------|
| **Images** | `image/png`, `image/jpeg`, `image/gif` | 10MB |
| **Documents** | `application/pdf` | 10MB |
| **Word Docs** | `application/msword`, `application/vnd.openxmlformats-officedocument.wordprocessingml.document` | 10MB |

## Security & Access Control

### Current Implementation

- Files are uploaded using the **service role key** (server-side only)
- Draft token validation is required before any upload/delete operation
- Each intake can only access files in its own folder

### Recommended RLS Policies

For enhanced security, consider adding these Supabase Storage policies:

```sql
-- Allow authenticated users to read files
CREATE POLICY "Authenticated users can read files"
ON storage.objects FOR SELECT
USING (bucket_id = 'Gurovich' AND auth.role() = 'authenticated');

-- Allow service role to manage files
CREATE POLICY "Service role can manage files"
ON storage.objects FOR ALL
USING (bucket_id = 'Gurovich' AND auth.role() = 'service_role');
```

## Changing the Storage Structure

If you need to modify the storage structure:

1. **Update `server/intake-storage.ts`**:
   - Modify `BUCKET_NAME` constant
   - Modify `CLIENT_PREFIX` constant
   - Update `buildClientFilePath()` function

2. **Run migration for existing files**:
   - Create a migration script to move existing files
   - Update `intake_uploads.storage_path` for all records

3. **Update documentation**:
   - Update this file with new structure
   - Update any API documentation

## Troubleshooting

### Files not appearing in Supabase UI

1. Check that the bucket `Gurovich` exists
2. Verify the `.keep` file was created
3. Check Supabase Storage logs for errors

### Upload failures

1. Verify file size is under 10MB
2. Check MIME type is in allowed list
3. Verify draft token is valid
4. Check Supabase service role key is configured

### Access denied errors

1. Verify `SUPABASE_SERVICE_ROLE_KEY` is set
2. Check bucket permissions in Supabase dashboard
3. Review RLS policies if enabled

## Related Files

- `server/intake-storage.ts` - Storage helper functions
- `server/onboard-router.ts` - Upload/delete procedures
- `supabase/migrations/001_onboarding_schema.sql` - Database schema
