/**
 * Database abstraction layer
 * Uses Supabase PostgreSQL instead of Drizzle ORM + TiDB
 */

import { userQueries, type User } from "./supabase-db";

export interface InsertUser {
  openId: string;
  name?: string | null;
  email?: string | null;
  loginMethod?: string | null;
  role?: "user" | "admin";
}

/**
 * Upsert user - creates or updates user record
 * Replaces previous Drizzle ORM implementation
 */
export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  try {
    // Try to find existing user
    const existingUser = await userQueries.findByOpenId(user.openId);

    if (existingUser) {
      // Update existing user
      await userQueries.update(user.openId, {
        name: user.name ?? existingUser.name,
        email: user.email ?? existingUser.email,
        loginMethod: user.loginMethod ?? existingUser.login_method,
        last_signed_in: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      } as Partial<User>);
    } else {
      // Create new user
      await userQueries.create({
        open_id: user.openId,
        name: user.name ?? null,
        email: user.email ?? null,
        login_method: user.loginMethod ?? null,
        role: (user.role ?? "user") as "user" | "admin",
      } as Omit<User, "id" | "created_at" | "updated_at" | "last_signed_in">);
    }
  } catch (error) {
    console.error("[Database] Error upserting user:", error);
    throw error;
  }
}

/**
 * Get user by openId
 */
export async function getUserByOpenId(openId: string): Promise<User | null> {
  try {
    return await userQueries.findByOpenId(openId);
  } catch (error) {
    console.error("[Database] Error getting user:", error);
    return null;
  }
}

/**
 * Get all users (admin only)
 */
export async function getAllUsers(): Promise<User[]> {
  try {
    return await userQueries.findAll();
  } catch (error) {
    console.error("[Database] Error getting all users:", error);
    return [];
  }
}

/**
 * Update user role
 */
export async function updateUserRole(
  openId: string,
  role: "user" | "admin"
): Promise<void> {
  try {
    await userQueries.update(openId, { role } as Partial<User>);
  } catch (error) {
    console.error("[Database] Error updating user role:", error);
    throw error;
  }
}
