/**
 * Script to verify Supabase bucket exists and create if needed
 * Run with: node scripts/verify-bucket.mjs
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
    console.error("Missing Supabase environment variables:");
    console.error("  SUPABASE_URL:", supabaseUrl ? "SET" : "MISSING");
    console.error("  SUPABASE_SERVICE_ROLE_KEY:", supabaseServiceKey ? "SET" : "MISSING");
    process.exit(1);
  }

  console.log("Supabase URL:", supabaseUrl);
  console.log("Service key:", supabaseServiceKey.substring(0, 20) + "...");

  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  // List existing buckets
  console.log("\nListing existing buckets...");
  const { data: buckets, error: listError } = await supabase.storage.listBuckets();

  if (listError) {
    console.error("Error listing buckets:", listError.message);
    process.exit(1);
  }

  console.log("Existing buckets:", buckets?.map(b => b.name) || []);

  // Check if our bucket exists
  const bucketExists = buckets?.some(b => b.name === BUCKET_NAME);

  if (bucketExists) {
    console.log(`\n✅ Bucket "${BUCKET_NAME}" already exists!`);
  } else {
    console.log(`\nBucket "${BUCKET_NAME}" not found. Creating...`);
    
    const { data, error: createError } = await supabase.storage.createBucket(BUCKET_NAME, {
      public: true, // Make bucket public for file access
      fileSizeLimit: 10 * 1024 * 1024, // 10MB max file size
      allowedMimeTypes: [
        "image/png",
        "image/jpeg",
        "image/jpg",
        "image/gif",
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ],
    });

    if (createError) {
      console.error("Error creating bucket:", createError.message);
      process.exit(1);
    }

    console.log(`✅ Bucket "${BUCKET_NAME}" created successfully!`);
  }

  // Test upload
  console.log("\nTesting upload capability...");
  const testPath = "test/test.txt";
  const testContent = new TextEncoder().encode("test");
  const { error: uploadError } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(testPath, testContent, {
      contentType: "text/plain",
      upsert: true,
    });

  if (uploadError) {
    console.error("Upload test failed:", uploadError.message);
    process.exit(1);
  }

  console.log("✅ Upload test successful!");

  // Clean up test file
  await supabase.storage.from(BUCKET_NAME).remove([testPath]);
  console.log("✅ Test file cleaned up");

  console.log("\n🎉 Supabase storage is properly configured!");
}

main().catch(console.error);
