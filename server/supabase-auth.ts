/**
 * Supabase Authentication Service
 * Replaces Manus OAuth with Supabase Auth
 * Maintains session management and user context
 */

import { createClient } from "@supabase/supabase-js";
import { SignJWT, jwtVerify } from "jose";
import type { Request } from "express";
import { parse as parseCookieHeader } from "cookie";
import { ENV } from "./_core/env";
import { upsertUser, getUserByOpenId } from "./db";

// Initialize Supabase client
const supabase = createClient(ENV.supabaseUrl, ENV.supabaseServiceRoleKey);

export type SessionPayload = {
  userId: string;
  email: string;
  name: string;
};

const JWT_SECRET = new TextEncoder().encode(ENV.cookieSecret);
const SESSION_COOKIE_NAME = "gurovich_session";
const SESSION_COOKIE_MAX_AGE = 7 * 24 * 60 * 60; // 7 days

/**
 * Create a session JWT token
 */
export async function createSessionToken(payload: SessionPayload): Promise<string> {
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .sign(JWT_SECRET);

  return token;
}

/**
 * Verify and decode session token
 */
export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    const verified = await jwtVerify(token, JWT_SECRET);
    return verified.payload as SessionPayload;
  } catch (error) {
    console.error("[Auth] Token verification failed:", error);
    return null;
  }
}

/**
 * Extract session from request cookies
 */
export function getSessionFromRequest(req: Request): string | null {
  const cookieHeader = req.headers.cookie;
  if (!cookieHeader) return null;

  const cookies = parseCookieHeader(cookieHeader);
  return cookies[SESSION_COOKIE_NAME] || null;
}

/**
 * Get current user from session
 */
export async function getCurrentUser(req: Request): Promise<SessionPayload | null> {
  const token = getSessionFromRequest(req);
  if (!token) return null;

  return verifySessionToken(token);
}

/**
 * Sign up user with email and password
 */
export async function signUpUser(
  email: string,
  password: string,
  name?: string
): Promise<{ user: any; error: any }> {
  try {
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name: name || email },
      email_confirm: true,
    });

    if (error) {
      return { user: null, error };
    }

    // Create user record in users table
    if (data.user) {
      await upsertUser({
        openId: data.user.id,
        email,
        name: name || email,
        loginMethod: "email",
      });
    }

    return { user: data.user, error: null };
  } catch (error) {
    console.error("[Auth] Sign up error:", error);
    return { user: null, error };
  }
}

/**
 * Sign in user with email and password
 */
export async function signInUser(
  email: string,
  password: string
): Promise<{ session: any; error: any }> {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { session: null, error };
    }

    // Update last_signed_in
    if (data.user) {
      await upsertUser({
        openId: data.user.id,
        email: data.user.email,
        name: data.user.user_metadata?.name || data.user.email,
        loginMethod: "email",
      });
    }

    return { session: data.session, error: null };
  } catch (error) {
    console.error("[Auth] Sign in error:", error);
    return { session: null, error };
  }
}

/**
 * Sign out user
 */
export async function signOutUser(userId: string): Promise<{ error: any }> {
  try {
    const { error } = await supabase.auth.admin.signOut(userId);
    return { error };
  } catch (error) {
    console.error("[Auth] Sign out error:", error);
    return { error };
  }
}

/**
 * Verify Supabase auth token
 */
export async function verifySupabaseToken(token: string): Promise<{ user: any; error: any }> {
  try {
    const { data, error } = await supabase.auth.getUser(token);
    return { user: data.user, error };
  } catch (error) {
    console.error("[Auth] Token verification error:", error);
    return { user: null, error };
  }
}

/**
 * Create session from Supabase user
 */
export async function createSessionFromUser(supabaseUser: any): Promise<string> {
  const sessionPayload: SessionPayload = {
    userId: supabaseUser.id,
    email: supabaseUser.email,
    name: supabaseUser.user_metadata?.name || supabaseUser.email,
  };

  return createSessionToken(sessionPayload);
}

/**
 * Reset password
 */
export async function resetPassword(email: string): Promise<{ error: any }> {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.VITE_FRONTEND_URL || "http://localhost:3000"}/reset-password`,
    });

    return { error };
  } catch (error) {
    console.error("[Auth] Password reset error:", error);
    return { error };
  }
}

/**
 * Update password
 */
export async function updatePassword(
  userId: string,
  newPassword: string
): Promise<{ error: any }> {
  try {
    const { error } = await supabase.auth.admin.updateUserById(userId, {
      password: newPassword,
    });

    return { error };
  } catch (error) {
    console.error("[Auth] Password update error:", error);
    return { error };
  }
}
