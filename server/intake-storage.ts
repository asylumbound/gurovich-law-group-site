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
  const keepPath = `${CLIENT_PREFIX}/${intakeId}/manifest.json`;
  
  // Create a manifest JSON file to initialize the folder
  const manifest = JSON.stringify({
    intake_id: intakeId,
    created_at: new Date().toISOString(),
    status: "draft",
  });
  const { error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(keepPath, new TextEncoder().encode(manifest), {
      contentType: "application/json",
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
 * Returns storagePath for database storage - use getSignedDownloadUrl for access
 */
export async function uploadClientFile(
  intakeId: number,
  filename: string,
  data: Buffer | Uint8Array,
  mimeType: string
): Promise<{ uploadId: string; storagePath: string }> {
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
  
  // Return storage path only - use getSignedDownloadUrl for access
  return {
    uploadId,
    storagePath,
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
 * Get signed download URL for a private file
 * @param storagePath - The storage path of the file
 * @param expiresIn - URL expiration time in seconds (default: 1 hour)
 */
export async function getSignedDownloadUrl(storagePath: string, expiresIn = 3600): Promise<string | null> {
  const supabase = getSupabaseAdmin();
  
  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .createSignedUrl(storagePath, expiresIn);
  
  if (error) {
    console.error("Failed to get signed download URL:", error);
    return null;
  }
  
  return data.signedUrl;
}

/**
 * Get signed upload URL for direct client uploads (presigned)
 * @param storagePath - The target storage path
 * @param expiresIn - URL expiration time in seconds (default: 5 minutes)
 */
export async function getSignedUploadUrl(
  storagePath: string,
  expiresIn = 300
): Promise<{ signedUrl: string; token: string } | null> {
  const supabase = getSupabaseAdmin();
  
  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .createSignedUploadUrl(storagePath);
  
  if (error) {
    console.error("Failed to get signed upload URL:", error);
    return null;
  }
  
  return {
    signedUrl: data.signedUrl,
    token: data.token,
  };
}

/**
 * @deprecated Use getSignedDownloadUrl instead - bucket is now private
 */
export async function getSignedUrl(storagePath: string, expiresIn = 3600): Promise<string | null> {
  return getSignedDownloadUrl(storagePath, expiresIn);
}

// Export constants for use in other modules
export { BUCKET_NAME, CLIENT_PREFIX };
