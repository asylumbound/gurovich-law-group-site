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

    it("should successfully authenticate with CourtListener API", async () => {
      const token = process.env.COURTLISTENER_API_TOKEN;
      if (!token) {
        console.warn("Skipping CourtListener auth test - no token available");
        return;
      }

      // Make a simple authenticated request to verify the token
      const response = await fetch(
        "https://www.courtlistener.com/api/rest/v4/search/?q=test&type=o",
        {
          headers: {
            "Authorization": `Token ${token}`,
            "Accept": "application/json",
          },
        }
      );

      // 200 = success, 401 = invalid token
      expect(response.status).toBe(200);
      
      const data = await response.json();
      expect(data).toHaveProperty("count");
      expect(data).toHaveProperty("results");
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
    });
  });
});
