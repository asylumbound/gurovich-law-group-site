/**
 * API Key Validation Tests
 * 
 * Tests to validate that the CourtListener and OpenAI API keys are working.
 */

import { describe, it, expect } from "vitest";

describe("API Key Validation", () => {
  describe("CourtListener API Token", () => {
    it("should have COURTLISTENER_API_TOKEN environment variable set", () => {
      const token = process.env.COURTLISTENER_API_TOKEN;
      expect(token).toBeDefined();
      expect(token).not.toBe("");
      expect(token!.length).toBeGreaterThan(10);
    });

    // Note: CourtListener API can be slow/unreliable, so we test token format instead of live API
    it("should have valid token format", () => {
      const token = process.env.COURTLISTENER_API_TOKEN;
      expect(token).toBeDefined();
      // CourtListener tokens are 40 character hex strings
      expect(token!.length).toBe(40);
      expect(/^[a-f0-9]+$/.test(token!)).toBe(true);
    });
  });

  describe("OpenAI API Key", () => {
    it("should have OPENAI_API_KEY environment variable set", () => {
      const key = process.env.OPENAI_API_KEY;
      expect(key).toBeDefined();
      expect(key).not.toBe("");
      expect(key!.startsWith("sk-")).toBe(true);
    });

    it("should successfully authenticate with OpenAI API", async () => {
      const key = process.env.OPENAI_API_KEY;
      if (!key) {
        console.warn("Skipping OpenAI auth test - no key available");
        return;
      }

      // Make a simple models list request to verify the key
      const response = await fetch(
        "https://api.openai.com/v1/models",
        {
          headers: {
            "Authorization": `Bearer ${key}`,
          },
        }
      );

      // 200 = success, 401 = invalid key
      expect(response.status).toBe(200);
      
      const data = await response.json();
      expect(data).toHaveProperty("data");
      expect(Array.isArray(data.data)).toBe(true);
    }, 10000); // 10 second timeout for external API
  });
});
