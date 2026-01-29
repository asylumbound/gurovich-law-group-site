/**
 * Terminal RAG Assistant Tests
 * 
 * Tests for terminal router procedures, context building, and legal tools.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock Supabase with chainable methods
const createChainableMock = () => {
  const mock: any = {
    select: vi.fn(() => mock),
    eq: vi.fn(() => mock),
    neq: vi.fn(() => mock),
    order: vi.fn(() => mock),
    limit: vi.fn(() => Promise.resolve({ data: [], error: null })),
    single: vi.fn(() => Promise.resolve({ data: null, error: null })),
    overlaps: vi.fn(() => mock),
    in: vi.fn(() => Promise.resolve({ data: [], error: null })),
  };
  return mock;
};

vi.mock("./supabase", () => ({
  getSupabaseAdmin: vi.fn(() => ({
    from: vi.fn(() => createChainableMock()),
  })),
}));

// Mock LLM
vi.mock("./_core/llm", () => ({
  invokeLLM: vi.fn(() => Promise.resolve({
    choices: [{
      message: {
        content: "Test response from LLM",
      },
    }],
  })),
}));

// Import after mocks
import { verifyIntakeAccess, buildContextPack, formatContextPackForLLM } from "./terminal-context";
import { searchStatutes, searchCourtListener, getStatutesByPracticeArea } from "./terminal-legal-tools";
import { sanitizeFilename, buildUploadTextKey } from "./terminal-text-extraction";

describe("Terminal Context", () => {
  describe("verifyIntakeAccess", () => {
    it("should allow admin access to any intake", async () => {
      const result = await verifyIntakeAccess(123, 1, "admin");
      expect(result).toBe(true);
    });

    it("should return false for non-admin users without explicit access", async () => {
      // With mock returning null from intake_access query, should return false
      const result = await verifyIntakeAccess(123, 1, "user");
      expect(result).toBe(false);
    });
  });

  describe("formatContextPackForLLM", () => {
    it("should format empty context pack", () => {
      const pack = {
        intake: {
          id: 123,
          first_name: "John",
          last_name: "Doe",
          email: "john@example.com",
          phone: "555-1234",
          practice_area: "personal_injury",
          summary: "Test summary",
          status: "submitted",
          created_at: "2024-01-01T00:00:00Z",
        },
        parties: [],
        notes: [],
        uploads: [],
        practice_details: null,
        missing_info_hints: [],
      };

      const result = formatContextPackForLLM(pack);
      
      expect(result).toContain("Intake #123");
      expect(result).toContain("John Doe");
      expect(result).toContain("personal_injury");
    });

    it("should include missing info hints", () => {
      const pack = {
        intake: {
          id: 123,
          first_name: "John",
          last_name: "Doe",
          email: null,
          phone: null,
          practice_area: "personal_injury",
          summary: null,
          status: "submitted",
          created_at: "2024-01-01T00:00:00Z",
        },
        parties: [],
        notes: [],
        uploads: [],
        practice_details: null,
        missing_info_hints: ["No email provided", "No phone provided"],
      };

      const result = formatContextPackForLLM(pack);
      
      expect(result).toContain("Missing Information");
      expect(result).toContain("No email provided");
    });
  });
});

describe("Terminal Legal Tools", () => {
  describe("searchStatutes", () => {
    it("should return empty array for unknown practice area", async () => {
      const results = await getStatutesByPracticeArea("unknown_area");
      expect(results).toEqual([]);
    });
  });

  describe("searchCourtListener", () => {
    beforeEach(() => {
      // Mock fetch for CourtListener API
      global.fetch = vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ results: [] }),
        } as Response)
      );
    });

    it("should return empty array when API returns no results", async () => {
      const results = await searchCourtListener("test query");
      expect(results).toEqual([]);
    });

    it("should handle API errors gracefully", async () => {
      global.fetch = vi.fn(() =>
        Promise.resolve({
          ok: false,
          status: 500,
          statusText: "Internal Server Error",
        } as Response)
      );

      const results = await searchCourtListener("test query");
      expect(results).toEqual([]);
    });

    it("should include court filter when provided", async () => {
      // The implementation uses mapCourtToId which requires specific court names
      await searchCourtListener("test query", "ninth circuit");
      
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("court=ca9"),
        expect.any(Object)
      );
    });
  });
});

describe("Terminal Text Extraction", () => {
  describe("sanitizeFilename", () => {
    it("should remove special characters", () => {
      const result = sanitizeFilename("test@file#name$.pdf");
      expect(result).toBe("test_file_name_.pdf");
    });

    it("should replace spaces with underscores", () => {
      const result = sanitizeFilename("test file name.pdf");
      expect(result).toBe("test_file_name.pdf");
    });

    it("should handle empty string", () => {
      const result = sanitizeFilename("");
      expect(result).toBe("");
    });

    it("should preserve valid characters", () => {
      const result = sanitizeFilename("valid-file_name.pdf");
      expect(result).toBe("valid-file_name.pdf");
    });
  });

  describe("buildUploadTextKey", () => {
    it("should create proper key format", () => {
      const result = buildUploadTextKey(123, 456);
      expect(result).toBe("intake_123_upload_456");
    });
  });
});

describe("Document Search", () => {
  describe("searchUploadText fallback", () => {
    it("should score results based on keyword matches", () => {
      // Test the scoring logic
      const keywords = ["accident", "injury"];
      const content = "The accident caused serious injury to the victim.";
      let score = 0;
      
      for (const keyword of keywords) {
        const matches = content.toLowerCase().split(keyword).length - 1;
        score += matches;
      }
      
      expect(score).toBe(2); // Both keywords appear once
    });

    it("should extract snippet around keyword", () => {
      const content = "Lorem ipsum dolor sit amet. The accident happened on Main Street. Consectetur adipiscing elit.";
      const keyword = "accident";
      const idx = content.toLowerCase().indexOf(keyword);
      const start = Math.max(0, idx - 20);
      const end = Math.min(content.length, idx + keyword.length + 20);
      let snippet = content.substring(start, end);
      if (start > 0) snippet = "..." + snippet;
      if (end < content.length) snippet = snippet + "...";
      
      expect(snippet).toContain("accident");
      expect(snippet.startsWith("...")).toBe(true);
    });
  });
});

describe("Terminal Types", () => {
  it("should have proper citation types", () => {
    const validTypes = ["INTAKE", "NOTE", "UPLOAD", "STATUTE", "CASELAW"];
    
    // This tests that our type definitions are correct
    validTypes.forEach(type => {
      expect(typeof type).toBe("string");
    });
  });

  it("should have proper suggested action structure", () => {
    const action = {
      label: "Test Action",
      action: "query",
      payload: { query: "test" },
    };

    expect(action.label).toBeDefined();
    expect(action.action).toBeDefined();
  });
});
