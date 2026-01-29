import { describe, expect, it, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock the Supabase client
vi.mock("./supabase", () => ({
  getSupabaseAdmin: vi.fn(() => ({
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          order: vi.fn(() => Promise.resolve({
            data: [
              { id: 1, name: "Car Accident", practice_area: "personal_injury" },
              { id: 2, name: "Slip and Fall", practice_area: "personal_injury" },
            ],
            error: null,
          })),
          single: vi.fn(() => Promise.resolve({
            data: { id: 1, draft_token: "test-token" },
            error: null,
          })),
        })),
      })),
      insert: vi.fn(() => ({
        select: vi.fn(() => ({
          single: vi.fn(() => Promise.resolve({
            data: { id: 1, draft_token: "new-draft-token" },
            error: null,
          })),
        })),
      })),
      update: vi.fn(() => ({
        eq: vi.fn(() => Promise.resolve({ error: null })),
      })),
      delete: vi.fn(() => ({
        eq: vi.fn(() => ({
          eq: vi.fn(() => Promise.resolve({ error: null })),
        })),
      })),
    })),
    storage: {
      from: vi.fn(() => ({
        upload: vi.fn(() => Promise.resolve({ error: null })),
        remove: vi.fn(() => Promise.resolve({ error: null })),
      })),
    },
  })),
}));

function createContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
    } as unknown as TrpcContext["res"],
  };
}

describe("onboard router", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getIssueTypes", () => {
    it("returns issue types for a practice area", async () => {
      const ctx = createContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.onboard.getIssueTypes({
        practice_area: "personal_injury",
      });

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe("createDraft", () => {
    it("creates a new draft intake with consent data", async () => {
      const ctx = createContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.onboard.createDraft({
        consent_no_attorney_relationship: true,
        consent_contact: true,
        preferred_contact_method: "phone",
        preferred_language: "en",
      });

      expect(result).toBeDefined();
      expect(result.draftToken).toBeDefined();
      expect(typeof result.draftToken).toBe("string");
    });

    it("rejects when consent is not given", async () => {
      const ctx = createContext();
      const caller = appRouter.createCaller(ctx);

      await expect(
        caller.onboard.createDraft({
          consent_no_attorney_relationship: false,
          consent_contact: true,
          preferred_contact_method: "phone",
          preferred_language: "en",
        })
      ).rejects.toThrow();
    });
  });

  describe("updateStep1", () => {
    it("updates contact information", async () => {
      const ctx = createContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.onboard.updateStep1({
        draftToken: "test-token",
        data: {
          first_name: "John",
          last_name: "Doe",
          phone: "818-555-1234",
          email: "john@example.com",
          city: "Los Angeles",
          state: "CA",
          is_affected_person: true,
        },
      });

      expect(result).toEqual({ success: true });
    });

    it("requires either phone or email", async () => {
      const ctx = createContext();
      const caller = appRouter.createCaller(ctx);

      await expect(
        caller.onboard.updateStep1({
          draftToken: "test-token",
          data: {
            first_name: "John",
            last_name: "Doe",
            city: "Los Angeles",
            state: "CA",
            is_affected_person: true,
          },
        })
      ).rejects.toThrow();
    });
  });

  describe("updateStep2", () => {
    it("updates matter selection", async () => {
      const ctx = createContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.onboard.updateStep2({
        draftToken: "test-token",
        data: {
          practice_area: "personal_injury",
          issue_type_id: 1,
          urgency: "normal",
          summary: "I was in a car accident and need legal help.",
        },
      });

      expect(result).toEqual({ success: true });
    });
  });

  describe("updateNotes", () => {
    it("updates additional notes", async () => {
      const ctx = createContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.onboard.updateNotes({
        draftToken: "test-token",
        additional_notes: "Please contact me in the morning.",
      });

      expect(result).toEqual({ success: true });
    });
  });
});
