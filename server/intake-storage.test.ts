import { describe, it, expect } from "vitest";
import { sanitizeFilename, buildClientFilePath } from "./intake-storage";

describe("intake-storage", () => {
  describe("sanitizeFilename", () => {
    it("should replace spaces with underscores", () => {
      expect(sanitizeFilename("my file.pdf")).toBe("my_file.pdf");
      expect(sanitizeFilename("medical records 2024.pdf")).toBe("medical_records_2024.pdf");
    });

    it("should remove special characters", () => {
      expect(sanitizeFilename("file@#$%.pdf")).toBe("file.pdf");
      expect(sanitizeFilename("contract & agreement!.pdf")).toBe("contract__agreement.pdf");
    });

    it("should convert extension to lowercase", () => {
      expect(sanitizeFilename("Document.PDF")).toBe("Document.pdf");
      expect(sanitizeFilename("Image.JPG")).toBe("Image.jpg");
    });

    it("should truncate long filenames", () => {
      const longName = "a".repeat(150) + ".pdf";
      const result = sanitizeFilename(longName);
      expect(result.length).toBeLessThanOrEqual(100);
      expect(result.endsWith(".pdf")).toBe(true);
    });

    it("should handle filenames without extension", () => {
      expect(sanitizeFilename("noextension")).toBe("noextension");
    });
  });

  describe("buildClientFilePath", () => {
    it("should build correct path with intake ID and upload ID", () => {
      const path = buildClientFilePath(42, "abc123", "document.pdf");
      expect(path).toBe("clients/42/abc123-document.pdf");
    });

    it("should sanitize filename in path", () => {
      const path = buildClientFilePath(100, "xyz789", "my file (1).PDF");
      expect(path).toBe("clients/100/xyz789-my_file_1.pdf");
    });

    it("should handle special characters in filename", () => {
      const path = buildClientFilePath(1, "test123", "contract & agreement!.pdf");
      expect(path).toBe("clients/1/test123-contract__agreement.pdf");
    });
  });
});
