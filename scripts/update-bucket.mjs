/**
 * Script to update Supabase bucket settings
 * Run with: node scripts/update-bucket.mjs
 */

import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const BUCKET_NAME = "Gurovich";

async function main() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error("Missing Supabase environment variables");
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  // Update bucket settings to allow more mime types
  console.log(`Updating bucket "${BUCKET_NAME}" settings...`);
  
  const { data, error } = await supabase.storage.updateBucket(BUCKET_NAME, {
    public: true,
    fileSizeLimit: 10 * 1024 * 1024, // 10MB
    allowedMimeTypes: [
      // Images
      "image/png",
      "image/jpeg",
      "image/jpg",
      "image/gif",
      "image/webp",
      // Documents
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      // JSON for manifest
      "application/json",
      // Text
      "text/plain",
      // Generic binary for .keep files
      "application/octet-stream",
    ],
  });

  if (error) {
    console.error("Error updating bucket:", error.message);
    process.exit(1);
  }

  console.log("✅ Bucket settings updated successfully!");

  // Test upload with JSON
  console.log("\nTesting JSON upload...");
  const testPath = "test/manifest.json";
  const testContent = JSON.stringify({ test: true, timestamp: new Date().toISOString() });
  
  const { error: uploadError } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(testPath, new TextEncoder().encode(testContent), {
      contentType: "application/json",
      upsert: true,
    });

  if (uploadError) {
    console.error("Upload test failed:", uploadError.message);
    process.exit(1);
  }

  console.log("✅ JSON upload test successful!");

  // Clean up
  await supabase.storage.from(BUCKET_NAME).remove([testPath]);
  console.log("✅ Test file cleaned up");

  console.log("\n🎉 Bucket is ready for use!");
}

main().catch(console.error);
