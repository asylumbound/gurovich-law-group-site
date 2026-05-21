/**
 * Supabase Database Client
 * Replaces Drizzle ORM for direct PostgreSQL access
 * All queries use Supabase client with proper typing
 */

import { createClient } from "@supabase/supabase-js";
import { ENV } from "./_core/env";

// Initialize Supabase client
export const supabase = createClient(
  ENV.supabaseUrl,
  ENV.supabaseServiceRoleKey
);

// Type definitions
export interface User {
  id: number;
  open_id: string;
  name: string | null;
  email: string | null;
  login_method: string | null;
  role: "user" | "admin";
  created_at: string;
  updated_at: string;
  last_signed_in: string;
}

export interface TerminalSession {
  id: string;
  user_id: string;
  intake_id: number;
  title: string | null;
  created_at: string;
  updated_at: string;
}

export interface TerminalMessage {
  id: number;
  session_id: string;
  role: "user" | "assistant";
  content: string;
  citations: Record<string, any> | null;
  suggested_actions: Record<string, any> | null;
  created_at: string;
}

export interface UploadText {
  id: number;
  intake_id: number;
  upload_id: number;
  file_name: string | null;
  extracted_text: string | null;
  word_count: number | null;
  created_at: string;
}

export interface DiscoveryTask {
  id: number;
  intake_id: number;
  user_id: string;
  title: string;
  description: string | null;
  status: "pending" | "in_progress" | "completed" | "cancelled";
  due_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface DiscoveryDraft {
  id: number;
  intake_id: number;
  user_id: string;
  type: string;
  title: string | null;
  content: Record<string, any> | null;
  created_at: string;
  updated_at: string;
}

export interface IntakeAccess {
  id: number;
  intake_id: number;
  user_id: string;
  access_level: string;
  granted_by: string | null;
  created_at: string;
}

// User queries
export const userQueries = {
  async findByOpenId(openId: string): Promise<User | null> {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("open_id", openId)
      .single();

    if (error && error.code !== "PGRST116") throw error;
    return data || null;
  },

  async create(user: Omit<User, "id" | "created_at" | "updated_at" | "last_signed_in">): Promise<User> {
    const { data, error } = await supabase
      .from("users")
      .insert([user])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(openId: string, updates: Partial<User>): Promise<User> {
    const { data, error } = await supabase
      .from("users")
      .update(updates)
      .eq("open_id", openId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async findAll(): Promise<User[]> {
    const { data, error } = await supabase.from("users").select("*");
    if (error) throw error;
    return data || [];
  },
};

// Terminal Session queries
export const terminalSessionQueries = {
  async create(session: Omit<TerminalSession, "created_at" | "updated_at">): Promise<TerminalSession> {
    const { data, error } = await supabase
      .from("terminal_sessions")
      .insert([session])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async findById(id: string): Promise<TerminalSession | null> {
    const { data, error } = await supabase
      .from("terminal_sessions")
      .select("*")
      .eq("id", id)
      .single();

    if (error && error.code !== "PGRST116") throw error;
    return data || null;
  },

  async findByUserId(userId: string): Promise<TerminalSession[]> {
    const { data, error } = await supabase
      .from("terminal_sessions")
      .select("*")
      .eq("user_id", userId)
      .order("updated_at", { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async update(id: string, updates: Partial<TerminalSession>): Promise<TerminalSession> {
    const { data, error } = await supabase
      .from("terminal_sessions")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};

// Terminal Message queries
export const terminalMessageQueries = {
  async create(message: Omit<TerminalMessage, "id" | "created_at">): Promise<TerminalMessage> {
    const { data, error } = await supabase
      .from("terminal_messages")
      .insert([message])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async findBySessionId(sessionId: string): Promise<TerminalMessage[]> {
    const { data, error } = await supabase
      .from("terminal_messages")
      .select("*")
      .eq("session_id", sessionId)
      .order("created_at", { ascending: true });

    if (error) throw error;
    return data || [];
  },
};

// Upload Text queries
export const uploadTextQueries = {
  async create(upload: Omit<UploadText, "id" | "created_at">): Promise<UploadText> {
    const { data, error } = await supabase
      .from("upload_text")
      .insert([upload])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async findByIntakeId(intakeId: number): Promise<UploadText[]> {
    const { data, error } = await supabase
      .from("upload_text")
      .select("*")
      .eq("intake_id", intakeId);

    if (error) throw error;
    return data || [];
  },

  async findByUploadId(uploadId: number): Promise<UploadText | null> {
    const { data, error } = await supabase
      .from("upload_text")
      .select("*")
      .eq("upload_id", uploadId)
      .single();

    if (error && error.code !== "PGRST116") throw error;
    return data || null;
  },
};

// Discovery Task queries
export const discoveryTaskQueries = {
  async create(task: Omit<DiscoveryTask, "id" | "created_at" | "updated_at">): Promise<DiscoveryTask> {
    const { data, error } = await supabase
      .from("discovery_tasks")
      .insert([task])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async findByIntakeId(intakeId: number): Promise<DiscoveryTask[]> {
    const { data, error } = await supabase
      .from("discovery_tasks")
      .select("*")
      .eq("intake_id", intakeId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async update(id: number, updates: Partial<DiscoveryTask>): Promise<DiscoveryTask> {
    const { data, error } = await supabase
      .from("discovery_tasks")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};

// Discovery Draft queries
export const discoveryDraftQueries = {
  async create(draft: Omit<DiscoveryDraft, "id" | "created_at" | "updated_at">): Promise<DiscoveryDraft> {
    const { data, error } = await supabase
      .from("discovery_drafts")
      .insert([draft])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async findByIntakeId(intakeId: number): Promise<DiscoveryDraft[]> {
    const { data, error } = await supabase
      .from("discovery_drafts")
      .select("*")
      .eq("intake_id", intakeId)
      .order("updated_at", { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async update(id: number, updates: Partial<DiscoveryDraft>): Promise<DiscoveryDraft> {
    const { data, error } = await supabase
      .from("discovery_drafts")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};

// Intake Access queries
export const intakeAccessQueries = {
  async create(access: Omit<IntakeAccess, "id" | "created_at">): Promise<IntakeAccess> {
    const { data, error } = await supabase
      .from("intake_access")
      .insert([access])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async findByIntakeId(intakeId: number): Promise<IntakeAccess[]> {
    const { data, error } = await supabase
      .from("intake_access")
      .select("*")
      .eq("intake_id", intakeId);

    if (error) throw error;
    return data || [];
  },

  async findByUserId(userId: string): Promise<IntakeAccess[]> {
    const { data, error } = await supabase
      .from("intake_access")
      .select("*")
      .eq("user_id", userId);

    if (error) throw error;
    return data || [];
  },

  async delete(intakeId: number, userId: string): Promise<void> {
    const { error } = await supabase
      .from("intake_access")
      .delete()
      .eq("intake_id", intakeId)
      .eq("user_id", userId);

    if (error) throw error;
  },
};
