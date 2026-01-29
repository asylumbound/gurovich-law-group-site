/**
 * Document Text Extraction for Terminal RAG
 * 
 * Extracts text from uploaded documents (PDFs, images) for keyword search.
 * Phase 0: Simple text extraction without embeddings.
 */

import { getSupabaseAdmin } from "./supabase";
import type { UploadTextSearchResult } from "./terminal-types";

/**
 * Extract text from a PDF file using pdf-parse
 * Falls back to empty string if extraction fails
 */
async function extractPdfText(buffer: Buffer): Promise<string> {
  try {
    // Dynamic import for pdf-parse
    const pdfParseModule = await import("pdf-parse") as any;
    const pdfParse = pdfParseModule.default || pdfParseModule;
    const data = await pdfParse(buffer);
    return data.text || "";
  } catch (error) {
    console.error("PDF text extraction failed:", error);
    return "";
  }
}

/**
 * Extract text from an uploaded file
 * Currently supports PDF files
 */
export async function extractTextFromUpload(uploadId: number): Promise<{ text: string; wordCount: number }> {
  const supabase = getSupabaseAdmin();
  
  // Get upload metadata
  const { data: upload, error: uploadError } = await supabase
    .from("intake_uploads")
    .select("id, intake_id, file_path, file_name, mime_type")
    .eq("id", uploadId)
    .single();
  
  if (uploadError || !upload) {
    throw new Error(`Upload not found: ${uploadId}`);
  }
  
  // Download file from storage
  const { data: fileData, error: downloadError } = await supabase.storage
    .from("Gurovich")
    .download(upload.file_path);
  
  if (downloadError || !fileData) {
    throw new Error(`Failed to download file: ${downloadError?.message}`);
  }
  
  // Convert to buffer
  const buffer = Buffer.from(await fileData.arrayBuffer());
  
  // Extract text based on mime type
  let text = "";
  
  if (upload.mime_type === "application/pdf") {
    text = await extractPdfText(buffer);
  } else if (upload.mime_type.startsWith("text/")) {
    text = buffer.toString("utf-8");
  }
  // Note: Image OCR would go here in a future phase
  
  // Calculate word count
  const wordCount = text.split(/\s+/).filter(w => w.length > 0).length;
  
  return { text, wordCount };
}

/**
 * Process an upload and store extracted text in the database
 */
export async function processUploadForAI(uploadId: number, intakeId: number): Promise<boolean> {
  const supabase = getSupabaseAdmin();
  
  try {
    // Check if already processed
    const { data: existing } = await supabase
      .from("upload_text")
      .select("id")
      .eq("upload_id", uploadId)
      .single();
    
    if (existing) {
      console.log(`Upload ${uploadId} already processed`);
      return true;
    }
    
    // Extract text
    const { text, wordCount } = await extractTextFromUpload(uploadId);
    
    if (!text || text.trim().length === 0) {
      console.log(`No text extracted from upload ${uploadId}`);
      return false;
    }
    
    // Store in database
    const { error: insertError } = await supabase
      .from("upload_text")
      .insert({
        upload_id: uploadId,
        intake_id: intakeId,
        text_content: text,
        word_count: wordCount,
      });
    
    if (insertError) {
      throw new Error(`Failed to store extracted text: ${insertError.message}`);
    }
    
    return true;
  } catch (error) {
    console.error(`Error processing upload ${uploadId}:`, error);
    return false;
  }
}

/**
 * Process all uploads for an intake
 */
export async function processAllUploadsForIntake(intakeId: number): Promise<{ processed: number; failed: number }> {
  const supabase = getSupabaseAdmin();
  
  // Get all uploads for intake
  const { data: uploads } = await supabase
    .from("intake_uploads")
    .select("id")
    .eq("intake_id", intakeId);
  
  if (!uploads || uploads.length === 0) {
    return { processed: 0, failed: 0 };
  }
  
  let processed = 0;
  let failed = 0;
  
  for (const upload of uploads) {
    const success = await processUploadForAI(upload.id, intakeId);
    if (success) {
      processed++;
    } else {
      failed++;
    }
  }
  
  return { processed, failed };
}

/**
 * Search extracted text using PostgreSQL full-text search
 * Returns snippets with relevance ranking
 */
export async function searchUploadText(
  intakeId: number,
  query: string,
  limit: number = 5
): Promise<UploadTextSearchResult[]> {
  const supabase = getSupabaseAdmin();
  
  // Use PostgreSQL full-text search with ts_rank
  const { data, error } = await supabase.rpc("search_upload_text", {
    p_intake_id: intakeId,
    p_query: query,
    p_limit: limit,
  });
  
  if (error) {
    // Fallback to simple ILIKE search if RPC not available
    console.warn("Full-text search RPC failed, using fallback:", error.message);
    return searchUploadTextFallback(intakeId, query, limit);
  }
  
  return data || [];
}

/**
 * Fallback keyword search using ILIKE
 */
async function searchUploadTextFallback(
  intakeId: number,
  query: string,
  limit: number
): Promise<UploadTextSearchResult[]> {
  const supabase = getSupabaseAdmin();
  
  // Split query into keywords
  const keywords = query.toLowerCase().split(/\s+/).filter(k => k.length > 2);
  
  if (keywords.length === 0) {
    return [];
  }
  
  // Get all text for intake
  const { data: texts } = await supabase
    .from("upload_text")
    .select(`
      upload_id,
      text_content,
      intake_uploads!inner(file_name)
    `)
    .eq("intake_id", intakeId);
  
  if (!texts || texts.length === 0) {
    return [];
  }
  
  // Score and rank results
  const results: UploadTextSearchResult[] = [];
  
  for (const text of texts) {
    const content = text.text_content.toLowerCase();
    let score = 0;
    let bestSnippet = "";
    
    for (const keyword of keywords) {
      const matches = content.split(keyword).length - 1;
      score += matches;
      
      // Find snippet containing keyword
      if (matches > 0 && !bestSnippet) {
        const idx = content.indexOf(keyword);
        const start = Math.max(0, idx - 100);
        const end = Math.min(content.length, idx + keyword.length + 100);
        bestSnippet = text.text_content.substring(start, end);
        if (start > 0) bestSnippet = "..." + bestSnippet;
        if (end < content.length) bestSnippet = bestSnippet + "...";
      }
    }
    
    if (score > 0) {
      results.push({
        upload_id: text.upload_id,
        file_name: (text.intake_uploads as any).file_name,
        snippet: bestSnippet,
        rank: score,
      });
    }
  }
  
  // Sort by rank and limit
  return results
    .sort((a, b) => b.rank - a.rank)
    .slice(0, limit);
}

/**
 * Sanitize filename for safe storage
 */
export function sanitizeFilename(filename: string): string {
  if (!filename) return "";
  return filename
    .replace(/[^a-zA-Z0-9._-]/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_|_$/g, "");
}

/**
 * Build a unique key for upload text storage
 */
export function buildUploadTextKey(intakeId: number, uploadId: number): string {
  return `intake_${intakeId}_upload_${uploadId}`;
}

/**
 * Get all extracted text for an intake (for context building)
 */
export async function getAllExtractedText(intakeId: number): Promise<{ uploadId: number; fileName: string; text: string }[]> {
  const supabase = getSupabaseAdmin();
  
  const { data } = await supabase
    .from("upload_text")
    .select(`
      upload_id,
      text_content,
      intake_uploads!inner(file_name)
    `)
    .eq("intake_id", intakeId);
  
  if (!data) return [];
  
  return data.map(d => ({
    uploadId: d.upload_id,
    fileName: (d.intake_uploads as any).file_name,
    text: d.text_content,
  }));
}
