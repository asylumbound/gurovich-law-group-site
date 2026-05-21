import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import { getCurrentUser } from "../supabase-auth";
import { getUserByOpenId } from "../db";
import type { User } from "../supabase-db";

export type TrpcContext = {
  req: CreateExpressContextOptions["req"];
  res: CreateExpressContextOptions["res"];
  user: User | null;
};

export async function createContext(
  opts: CreateExpressContextOptions
): Promise<TrpcContext> {
  let user: User | null = null;

  try {
    // Get session from request
    const session = await getCurrentUser(opts.req);
    
    if (session) {
      // Fetch full user record from database
      user = await getUserByOpenId(session.userId);
    }
  } catch (error) {
    // Authentication is optional for public procedures
    console.warn("[Context] Authentication error:", error);
    user = null;
  }

  return {
    req: opts.req,
    res: opts.res,
    user,
  };
}
