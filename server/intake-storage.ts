/**
 * Supabase Storage Helper for Client Intake Files
 * 
 * Bucket: Gurovich
 * Path scheme: clients/{intake_id}/{upload_id}-{sanitized_filename}
 * 
 * All uploaded files are stored under a client-specific prefix based on the intake UUID.
 * This ensures proper organization and access control per client.
 */

import { getSupabaseAdmin } from "./supabase";
import { nanoid } from "nanoid";

// Storage configuration
const BUCKET_NAME = "Gurovich";
const CLIENT_PREFIX = "clients";

/**
 * Sanitize filename for safe storage
 * - Replace spaces with underscores
 * - Remove special characters except dots, dashes, underscores
 * - Limit length to 100 characters
 */
export function sanitizeFilename(filename: string): string {
  // Extract extension
  const lastDot = filename.lastIndexOf(".");
  const name = lastDot > 0 ? filename.slice(0, lastDot) : filename;
  const ext = lastDot > 0 ? filename.slice(lastDot) : "";
  
  // Sanitize name
  const sanitized = name
    .replace(/\s+/g, "_")
    .replace(/[^a-zA-Z0-9_-]/g, "")
    .slice(0, 100 - ext.length);
  
  return sanitized + ext.toLowerCase();
}

/**
 * Build the storage path for a client file
 * Format: clients/{intake_id}/{upload_id}-{sanitized_filename}
 */
export function buildClientFilePath(intakeId: number, uploadId: string, filename: string): string {
  const sanitized = sanitizeFilename(filename);
  return `${CLIENT_PREFIX}/${intakeId}/${uploadId}-${sanitized}`;
}

/**
 * Initialize client folder when a new intake is created
 * Creates a .keep placeholder file to make the folder visible in Supabase UI
 */
export async function initializeClientFolder(intakeId: number): Promise<{ success: boolean; path: string }> {
  const supabase = getSupabaseAdmin();
  const keepPath = `${CLIENT_PREFIX}/${intakeId}/.keep`;
  
  // Create a zero-byte placeholder file
  const { error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(keepPath, new Uint8Array(0), {
      contentType: "application/octet-stream",
      upsert: true,
    });
  
  if (error) {
    console.error("Failed to initialize client folder:", error);
    return { success: false, path: keepPath };
  }
  
  return { success: true, path: keepPath };
}

/**
 * Upload a file to the client's folder in Supabase storage
 */
export async function uploadClientFile(
  intakeId: number,
  filename: string,
  data: Buffer | Uint8Array,
  mimeType: string
): Promise<{ uploadId: string; storagePath: string; publicUrl: string }> {
  const supabase = getSupabaseAdmin();
  
  // Generate unique upload ID
  const uploadId = nanoid(16);
  
  // Build the storage path
  const storagePath = buildClientFilePath(intakeId, uploadId, filename);
  
  // Upload to Supabase storage
  const { error: uploadError } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(storagePath, data, {
      contentType: mimeType,
      upsert: false, // Don't overwrite existing files
    });
  
  if (uploadError) {
    throw new Error(`Upload failed: ${uploadError.message}`);
  }
  
  // Get public URL
  const { data: urlData } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(storagePath);
  
  return {
    uploadId,
    storagePath,
    publicUrl: urlData.publicUrl,
  };
}

/**
 * Delete a file from the client's folder
 */
export async function deleteClientFile(storagePath: string): Promise<boolean> {
  const supabase = getSupabaseAdmin();
  
  const { error } = await supabase.storage
    .from(BUCKET_NAME)
    .remove([storagePath]);
  
  if (error) {
    console.error("Failed to delete file:", error);
    return false;
  }
  
  return true;
}

/**
 * List all files in a client's folder
 */
export async function listClientFiles(intakeId: number): Promise<string[]> {
  const supabase = getSupabaseAdmin();
  const folderPath = `${CLIENT_PREFIX}/${intakeId}`;
  
  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .list(folderPath);
  
  if (error) {
    console.error("Failed to list client files:", error);
    return [];
  }
  
  return (data || [])
    .filter(file => file.name !== ".keep")
    .map(file => `${folderPath}/${file.name}`);
}

/**
 * Get signed URL for a private file (if bucket is private)
 */
export async function getSignedUrl(storagePath: string, expiresIn = 3600): Promise<string | null> {
  const supabase = getSupabaseAdmin();
  
  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .createSignedUrl(storagePath, expiresIn);
  
  if (error) {
    console.error("Failed to get signed URL:", error);
    return null;
  }
  
  return data.signedUrl;
}

// Export constants for use in other modules
export { BUCKET_NAME, CLIENT_PREFIX };
