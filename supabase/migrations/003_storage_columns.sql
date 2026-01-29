-- =====================================================
-- ADD STORAGE COLUMNS TO INTAKE_UPLOADS
-- Gurovich Law Group - Storage Structure Update
-- =====================================================

-- Add new columns for better storage tracking
-- These columns support the new path scheme: clients/{intake_id}/{upload_id}-{filename}

-- Storage bucket name (always 'Gurovich')
ALTER TABLE intake_uploads 
ADD COLUMN IF NOT EXISTS storage_bucket VARCHAR(100) DEFAULT 'Gurovich';

-- Full storage path (replaces file_path semantically)
ALTER TABLE intake_uploads 
ADD COLUMN IF NOT EXISTS storage_path TEXT;

-- Original filename before sanitization
ALTER TABLE intake_uploads 
ADD COLUMN IF NOT EXISTS original_filename VARCHAR(255);

-- Update existing records to populate new columns
UPDATE intake_uploads 
SET storage_bucket = 'Gurovich',
    storage_path = file_path,
    original_filename = file_name
WHERE storage_path IS NULL;

-- Add index for storage_path lookups
CREATE INDEX IF NOT EXISTS idx_intake_uploads_storage_path 
ON intake_uploads(storage_path);

-- Comment on columns for documentation
COMMENT ON COLUMN intake_uploads.storage_bucket IS 'Supabase storage bucket name (always Gurovich)';
COMMENT ON COLUMN intake_uploads.storage_path IS 'Full path in storage: clients/{intake_id}/{upload_id}-{filename}';
COMMENT ON COLUMN intake_uploads.original_filename IS 'Original filename before sanitization';
