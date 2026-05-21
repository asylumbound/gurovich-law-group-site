#!/usr/bin/env node

/**
 * Migration Script: TiDB to Supabase
 * Transfers all user and session data from TiDB to Supabase PostgreSQL
 * 
 * Usage: node scripts/migrate-tidb-to-supabase.mjs
 * 
 * Prerequisites:
 * - DATABASE_URL environment variable (TiDB connection string)
 * - SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables
 */

import mysql from "mysql2/promise";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const DATABASE_URL = process.env.DATABASE_URL;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY || !DATABASE_URL) {
  console.error("Missing required environment variables:");
  console.error("- SUPABASE_URL");
  console.error("- SUPABASE_SERVICE_ROLE_KEY");
  console.error("- DATABASE_URL");
  process.exit(1);
}

// Initialize Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// Parse TiDB connection string
function parseDatabaseUrl(url) {
  const match = url.match(
    /mysql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/([^?]+)/
  );
  if (!match) throw new Error("Invalid DATABASE_URL format");

  return {
    user: match[1],
    password: match[2],
    host: match[3],
    port: parseInt(match[4], 10),
    database: match[5],
  };
}

async function migrateUsers(connection) {
  console.log("📊 Migrating users...");

  const [rows] = await connection.query("SELECT * FROM users");

  for (const user of rows) {
    const { error } = await supabase.from("users").insert([
      {
        open_id: user.openId,
        name: user.name,
        email: user.email,
        login_method: user.loginMethod,
        role: user.role,
        created_at: user.createdAt,
        updated_at: user.updatedAt,
        last_signed_in: user.lastSignedIn,
      },
    ]);

    if (error) {
      console.error(`❌ Failed to migrate user ${user.openId}:`, error);
    } else {
      console.log(`✓ Migrated user: ${user.email || user.openId}`);
    }
  }

  console.log(`✅ Completed users migration (${rows.length} records)`);
}

async function migrateTerminalSessions(connection) {
  console.log("📊 Migrating terminal sessions...");

  const [rows] = await connection.query("SELECT * FROM terminal_sessions");

  for (const session of rows) {
    const { error } = await supabase.from("terminal_sessions").insert([
      {
        id: session.id,
        user_id: session.userId,
        intake_id: session.intakeId,
        title: session.title,
        created_at: session.createdAt,
        updated_at: session.updatedAt,
      },
    ]);

    if (error) {
      console.error(`❌ Failed to migrate session ${session.id}:`, error);
    } else {
      console.log(`✓ Migrated session: ${session.id}`);
    }
  }

  console.log(`✅ Completed terminal sessions migration (${rows.length} records)`);
}

async function migrateTerminalMessages(connection) {
  console.log("📊 Migrating terminal messages...");

  const [rows] = await connection.query("SELECT * FROM terminal_messages");

  for (const message of rows) {
    const { error } = await supabase.from("terminal_messages").insert([
      {
        session_id: message.sessionId,
        role: message.role,
        content: message.content,
        citations: message.citations,
        suggested_actions: message.suggestedActions,
        created_at: message.createdAt,
      },
    ]);

    if (error) {
      console.error(`❌ Failed to migrate message ${message.id}:`, error);
    } else {
      console.log(`✓ Migrated message: ${message.id}`);
    }
  }

  console.log(`✅ Completed terminal messages migration (${rows.length} records)`);
}

async function migrateUploadText(connection) {
  console.log("📊 Migrating upload text...");

  const [rows] = await connection.query("SELECT * FROM upload_text");

  for (const upload of rows) {
    const { error } = await supabase.from("upload_text").insert([
      {
        intake_id: upload.intakeId,
        upload_id: upload.uploadId,
        file_name: upload.fileName,
        extracted_text: upload.extractedText,
        word_count: upload.wordCount,
        created_at: upload.createdAt,
      },
    ]);

    if (error) {
      console.error(`❌ Failed to migrate upload ${upload.id}:`, error);
    } else {
      console.log(`✓ Migrated upload: ${upload.id}`);
    }
  }

  console.log(`✅ Completed upload text migration (${rows.length} records)`);
}

async function migrateDiscoveryTasks(connection) {
  console.log("📊 Migrating discovery tasks...");

  const [rows] = await connection.query("SELECT * FROM discovery_tasks");

  for (const task of rows) {
    const { error } = await supabase.from("discovery_tasks").insert([
      {
        intake_id: task.intakeId,
        user_id: task.userId,
        title: task.title,
        description: task.description,
        status: task.status,
        due_date: task.dueDate,
        created_at: task.createdAt,
        updated_at: task.updatedAt,
      },
    ]);

    if (error) {
      console.error(`❌ Failed to migrate task ${task.id}:`, error);
    } else {
      console.log(`✓ Migrated task: ${task.id}`);
    }
  }

  console.log(`✅ Completed discovery tasks migration (${rows.length} records)`);
}

async function migrateDiscoveryDrafts(connection) {
  console.log("📊 Migrating discovery drafts...");

  const [rows] = await connection.query("SELECT * FROM discovery_drafts");

  for (const draft of rows) {
    const { error } = await supabase.from("discovery_drafts").insert([
      {
        intake_id: draft.intakeId,
        user_id: draft.userId,
        type: draft.type,
        title: draft.title,
        content: draft.content,
        created_at: draft.createdAt,
        updated_at: draft.updatedAt,
      },
    ]);

    if (error) {
      console.error(`❌ Failed to migrate draft ${draft.id}:`, error);
    } else {
      console.log(`✓ Migrated draft: ${draft.id}`);
    }
  }

  console.log(`✅ Completed discovery drafts migration (${rows.length} records)`);
}

async function migrateIntakeAccess(connection) {
  console.log("📊 Migrating intake access...");

  const [rows] = await connection.query("SELECT * FROM intake_access");

  for (const access of rows) {
    const { error } = await supabase.from("intake_access").insert([
      {
        intake_id: access.intakeId,
        user_id: access.userId,
        access_level: access.accessLevel,
        granted_by: access.grantedBy,
        created_at: access.createdAt,
      },
    ]);

    if (error) {
      console.error(`❌ Failed to migrate access ${access.id}:`, error);
    } else {
      console.log(`✓ Migrated access: ${access.id}`);
    }
  }

  console.log(`✅ Completed intake access migration (${rows.length} records)`);
}

async function main() {
  console.log("🚀 Starting TiDB to Supabase migration...\n");

  let connection;

  try {
    // Connect to TiDB
    const config = parseDatabaseUrl(DATABASE_URL);
    connection = await mysql.createConnection(config);
    console.log("✅ Connected to TiDB\n");

    // Run migrations in order
    await migrateUsers(connection);
    console.log();

    await migrateTerminalSessions(connection);
    console.log();

    await migrateTerminalMessages(connection);
    console.log();

    await migrateUploadText(connection);
    console.log();

    await migrateDiscoveryTasks(connection);
    console.log();

    await migrateDiscoveryDrafts(connection);
    console.log();

    await migrateIntakeAccess(connection);
    console.log();

    console.log("✅ Migration completed successfully!");
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

main();
