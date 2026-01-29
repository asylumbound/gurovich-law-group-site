import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, json } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// Terminal RAG Tables

/**
 * Terminal sessions - tracks chat sessions with intake pinning
 */
export const terminalSessions = mysqlTable("terminal_sessions", {
  id: varchar("id", { length: 36 }).primaryKey(), // UUID
  userId: varchar("user_id", { length: 255 }).notNull(),
  intakeId: int("intake_id").notNull(),
  title: varchar("title", { length: 500 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type TerminalSession = typeof terminalSessions.$inferSelect;
export type InsertTerminalSession = typeof terminalSessions.$inferInsert;

/**
 * Terminal messages - stores chat history
 */
export const terminalMessages = mysqlTable("terminal_messages", {
  id: int("id").autoincrement().primaryKey(),
  sessionId: varchar("session_id", { length: 36 }).notNull(),
  role: mysqlEnum("role", ["user", "assistant"]).notNull(),
  content: text("content").notNull(),
  citations: json("citations"),
  suggestedActions: json("suggested_actions"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type TerminalMessage = typeof terminalMessages.$inferSelect;
export type InsertTerminalMessage = typeof terminalMessages.$inferInsert;

/**
 * Upload text - stores extracted text from uploaded documents
 */
export const uploadText = mysqlTable("upload_text", {
  id: int("id").autoincrement().primaryKey(),
  intakeId: int("intake_id").notNull(),
  uploadId: int("upload_id").notNull(),
  fileName: varchar("file_name", { length: 500 }),
  extractedText: text("extracted_text"),
  wordCount: int("word_count"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type UploadText = typeof uploadText.$inferSelect;
export type InsertUploadText = typeof uploadText.$inferInsert;

/**
 * Discovery tasks - tracks tasks created from terminal
 */
export const discoveryTasks = mysqlTable("discovery_tasks", {
  id: int("id").autoincrement().primaryKey(),
  intakeId: int("intake_id").notNull(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  title: varchar("title", { length: 500 }).notNull(),
  description: text("description"),
  status: mysqlEnum("status", ["pending", "in_progress", "completed", "cancelled"]).default("pending").notNull(),
  dueDate: timestamp("due_date"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type DiscoveryTask = typeof discoveryTasks.$inferSelect;
export type InsertDiscoveryTask = typeof discoveryTasks.$inferInsert;

/**
 * Discovery drafts - stores work product drafts
 */
export const discoveryDrafts = mysqlTable("discovery_drafts", {
  id: int("id").autoincrement().primaryKey(),
  intakeId: int("intake_id").notNull(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  type: varchar("type", { length: 50 }).notNull(),
  title: varchar("title", { length: 500 }),
  content: json("content"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type DiscoveryDraft = typeof discoveryDrafts.$inferSelect;
export type InsertDiscoveryDraft = typeof discoveryDrafts.$inferInsert;

/**
 * Intake access - controls which users can access which intakes
 */
export const intakeAccess = mysqlTable("intake_access", {
  id: int("id").autoincrement().primaryKey(),
  intakeId: int("intake_id").notNull(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  accessLevel: varchar("access_level", { length: 20 }).default("read"),
  grantedBy: varchar("granted_by", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type IntakeAccess = typeof intakeAccess.$inferSelect;
export type InsertIntakeAccess = typeof intakeAccess.$inferInsert;
