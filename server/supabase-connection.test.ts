import { describe, it, expect } from "vitest";

describe("Supabase Database Connection", () => {
  it("should have SUPABASE_DB_PASSWORD set", () => {
    expect(process.env.SUPABASE_DB_PASSWORD).toBeDefined();
    expect(process.env.SUPABASE_DB_PASSWORD).not.toBe("");
  });

  it("should have SUPABASE_DIRECT_URL set with correct format", () => {
    expect(process.env.SUPABASE_DIRECT_URL).toBeDefined();
    expect(process.env.SUPABASE_DIRECT_URL).toContain("postgresql://");
    expect(process.env.SUPABASE_DIRECT_URL).toContain("txeynebsnznkoqkhmuag.supabase.co");
  });
});
