/**
 * Authentication Routes
 * Replaced Manus OAuth with Supabase Auth
 */

import type { Express, Request, Response } from "express";
import * as db from "../db";
import { getSessionCookieOptions } from "./cookies";
import {
  createSessionToken,
  signInUser,
  signUpUser,
  verifySupabaseToken,
  createSessionFromUser,
} from "../supabase-auth";

const COOKIE_NAME = "gurovich_session";
const ONE_YEAR_MS = 365 * 24 * 60 * 60 * 1000;

function getQueryParam(req: Request, key: string): string | undefined {
  const value = req.query[key];
  return typeof value === "string" ? value : undefined;
}

export function registerOAuthRoutes(app: Express) {
  /**
   * Sign up endpoint
   */
  app.post("/api/auth/signup", async (req: Request, res: Response) => {
    try {
      const { email, password, name } = req.body;

      if (!email || !password) {
        res.status(400).json({ error: "email and password are required" });
        return;
      }

      const { user, error } = await signUpUser(email, password, name);

      if (error) {
        res.status(400).json({ error: error.message });
        return;
      }

      // Create session
      const sessionToken = await createSessionFromUser(user);
      const cookieOptions = getSessionCookieOptions(req);
      res.cookie(COOKIE_NAME, sessionToken, {
        ...cookieOptions,
        maxAge: ONE_YEAR_MS,
      });

      res.json({ user, sessionToken });
    } catch (error) {
      console.error("[Auth] Sign up failed:", error);
      res.status(500).json({ error: "Sign up failed" });
    }
  });

  /**
   * Sign in endpoint
   */
  app.post("/api/auth/signin", async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res.status(400).json({ error: "email and password are required" });
        return;
      }

      const { session, error } = await signInUser(email, password);

      if (error) {
        res.status(401).json({ error: error.message });
        return;
      }

      // Create session token
      const sessionToken = await createSessionFromUser(session.user);
      const cookieOptions = getSessionCookieOptions(req);
      res.cookie(COOKIE_NAME, sessionToken, {
        ...cookieOptions,
        maxAge: ONE_YEAR_MS,
      });

      res.json({ user: session.user, sessionToken });
    } catch (error) {
      console.error("[Auth] Sign in failed:", error);
      res.status(500).json({ error: "Sign in failed" });
    }
  });

  /**
   * Sign out endpoint
   */
  app.post("/api/auth/signout", async (req: Request, res: Response) => {
    try {
      const cookieOptions = getSessionCookieOptions(req);
      res.clearCookie(COOKIE_NAME, cookieOptions);
      res.json({ success: true });
    } catch (error) {
      console.error("[Auth] Sign out failed:", error);
      res.status(500).json({ error: "Sign out failed" });
    }
  });

  /**
   * Verify token endpoint
   */
  app.post("/api/auth/verify", async (req: Request, res: Response) => {
    try {
      const { token } = req.body;

      if (!token) {
        res.status(400).json({ error: "token is required" });
        return;
      }

      const { user, error } = await verifySupabaseToken(token);

      if (error) {
        res.status(401).json({ error: error.message });
        return;
      }

      res.json({ user });
    } catch (error) {
      console.error("[Auth] Token verification failed:", error);
      res.status(500).json({ error: "Token verification failed" });
    }
  });

  /**
   * Get current user endpoint
   */
  app.get("/api/auth/me", async (req: Request, res: Response) => {
    try {
      const cookieHeader = req.headers.cookie;
      if (!cookieHeader) {
        res.status(401).json({ error: "Not authenticated" });
        return;
      }

      const cookies = require("cookie").parse(cookieHeader);
      const sessionToken = cookies[COOKIE_NAME];

      if (!sessionToken) {
        res.status(401).json({ error: "Not authenticated" });
        return;
      }

      // Get user from database
      const { verifySessionToken } = await import("../supabase-auth");
      const session = await verifySessionToken(sessionToken);

      if (!session) {
        res.status(401).json({ error: "Invalid session" });
        return;
      }

      const user = await db.getUserByOpenId(session.userId);
      res.json({ user });
    } catch (error) {
      console.error("[Auth] Get current user failed:", error);
      res.status(500).json({ error: "Failed to get current user" });
    }
  });
}
