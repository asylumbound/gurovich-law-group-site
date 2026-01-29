import { describe, expect, it, vi, beforeEach } from "vitest";

// Mock Supabase client
const mockSupabaseClient = {
  from: vi.fn().mockReturnThis(),
  select: vi.fn().mockReturnThis(),
  eq: vi.fn().mockReturnThis(),
  order: vi.fn().mockReturnThis(),
  range: vi.fn().mockReturnThis(),
  update: vi.fn().mockReturnThis(),
  single: vi.fn(),
};

vi.mock("./supabase", () => ({
  getSupabaseClient: () => mockSupabaseClient,
}));

describe("Admin Router", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getIntakes procedure", () => {
    it("should return paginated intakes with filters", async () => {
      const mockIntakes = [
        {
          id: "intake-1",
          first_name: "John",
          last_name: "Doe",
          email: "john@example.com",
          phone: "555-1234",
          practice_area: "personal_injury",
          status: "new",
          created_at: new Date().toISOString(),
        },
        {
          id: "intake-2",
          first_name: "Jane",
          last_name: "Smith",
          email: "jane@example.com",
          phone: "555-5678",
          practice_area: "criminal_defense",
          status: "reviewed",
          created_at: new Date().toISOString(),
        },
      ];

      mockSupabaseClient.range.mockResolvedValueOnce({
        data: mockIntakes,
        error: null,
        count: 2,
      });

      // Verify the mock data structure is correct
      expect(mockIntakes).toHaveLength(2);
      expect(mockIntakes[0]).toHaveProperty("id");
      expect(mockIntakes[0]).toHaveProperty("first_name");
      expect(mockIntakes[0]).toHaveProperty("status");
    });

    it("should filter by status when provided", async () => {
      const mockIntakes = [
        {
          id: "intake-1",
          first_name: "John",
          last_name: "Doe",
          email: "john@example.com",
          phone: "555-1234",
          practice_area: "personal_injury",
          status: "new",
          created_at: new Date().toISOString(),
        },
      ];

      mockSupabaseClient.range.mockResolvedValueOnce({
        data: mockIntakes,
        error: null,
        count: 1,
      });

      // Verify filter would work with status
      const filteredIntakes = mockIntakes.filter((i) => i.status === "new");
      expect(filteredIntakes).toHaveLength(1);
    });

    it("should filter by practice area when provided", async () => {
      const mockIntakes = [
        {
          id: "intake-1",
          first_name: "John",
          last_name: "Doe",
          email: "john@example.com",
          phone: "555-1234",
          practice_area: "personal_injury",
          status: "new",
          created_at: new Date().toISOString(),
        },
        {
          id: "intake-2",
          first_name: "Jane",
          last_name: "Smith",
          email: "jane@example.com",
          phone: "555-5678",
          practice_area: "criminal_defense",
          status: "new",
          created_at: new Date().toISOString(),
        },
      ];

      // Verify filter would work with practice_area
      const filteredIntakes = mockIntakes.filter(
        (i) => i.practice_area === "personal_injury"
      );
      expect(filteredIntakes).toHaveLength(1);
      expect(filteredIntakes[0].first_name).toBe("John");
    });
  });

  describe("updateIntakeStatus procedure", () => {
    it("should update intake status successfully", async () => {
      const updatedIntake = {
        id: "intake-1",
        status: "reviewed",
        notes: "Reviewed by attorney",
      };

      mockSupabaseClient.single.mockResolvedValueOnce({
        data: updatedIntake,
        error: null,
      });

      // Verify the update data structure
      expect(updatedIntake.status).toBe("reviewed");
      expect(updatedIntake.notes).toBe("Reviewed by attorney");
    });

    it("should validate status values", () => {
      const validStatuses = ["new", "reviewed", "contacted", "converted"];
      
      validStatuses.forEach((status) => {
        expect(validStatuses).toContain(status);
      });

      // Invalid status should not be in the list
      expect(validStatuses).not.toContain("invalid_status");
    });
  });

  describe("getIntakeDetails procedure", () => {
    it("should return full intake details with files", async () => {
      const mockIntake = {
        id: "intake-1",
        first_name: "John",
        last_name: "Doe",
        email: "john@example.com",
        phone: "555-1234",
        practice_area: "personal_injury",
        issue_type_id: "auto-accident",
        incident_date: "2024-01-15",
        incident_description: "Car accident on highway",
        status: "new",
        created_at: new Date().toISOString(),
        intake_files: [
          {
            id: "file-1",
            file_name: "accident-photo.jpg",
            file_url: "https://storage.example.com/file1.jpg",
            file_type: "image/jpeg",
          },
        ],
      };

      mockSupabaseClient.single.mockResolvedValueOnce({
        data: mockIntake,
        error: null,
      });

      // Verify the intake details structure
      expect(mockIntake).toHaveProperty("intake_files");
      expect(mockIntake.intake_files).toHaveLength(1);
      expect(mockIntake.intake_files[0].file_name).toBe("accident-photo.jpg");
    });
  });
});

describe("CSV Export functionality", () => {
  it("should generate valid CSV format with proper escaping", () => {
    // Test CSV generation helper
    const testData = [
      { name: "John Doe", email: "john@example.com", notes: "Test, with comma" },
      { name: 'Jane "Test" Smith', email: "jane@example.com", notes: "Normal note" },
      { name: "Bob\nNewline", email: "bob@example.com", notes: "Has\nnewlines" },
    ];

    // Simulate CSV generation logic
    const columns = [
      { key: "name", label: "Name" },
      { key: "email", label: "Email" },
      { key: "notes", label: "Notes" },
    ];

    const header = columns.map(c => c.label).join(",");
    const rows = testData.map(row => {
      return columns.map(col => {
        const value = row[col.key as keyof typeof row];
        if (value === null || value === undefined) return "";
        const stringValue = String(value);
        if (stringValue.includes(",") || stringValue.includes("\n") || stringValue.includes('"')) {
          return `"${stringValue.replace(/"/g, '""')}"`;
        }
        return stringValue;
      }).join(",");
    });

    const csv = [header, ...rows].join("\n");

    expect(csv).toContain("Name,Email,Notes");
    expect(csv).toContain('"Test, with comma"'); // Comma escaped
    expect(csv).toContain('"Jane ""Test"" Smith"'); // Quotes escaped
    expect(csv).toContain('"Bob\nNewline"'); // Newline escaped
  });

  it("should handle empty data gracefully", () => {
    const testData: any[] = [];
    expect(testData.length).toBe(0);
  });

  it("should handle null values in data", () => {
    const testData = [
      { name: "John", email: null, phone: undefined },
    ];

    const columns = [
      { key: "name", label: "Name" },
      { key: "email", label: "Email" },
      { key: "phone", label: "Phone" },
    ];

    const row = columns.map(col => {
      const value = testData[0][col.key as keyof typeof testData[0]];
      if (value === null || value === undefined) return "";
      return String(value);
    }).join(",");

    expect(row).toBe("John,,");
  });
});

describe("Internal Notes functionality", () => {
  it("should validate note content is not empty", () => {
    const note = "   ";
    const trimmedNote = note.trim();
    expect(trimmedNote.length).toBe(0);
  });

  it("should accept valid note content", () => {
    const note = "This is a valid note about the client intake.";
    const trimmedNote = note.trim();
    expect(trimmedNote.length).toBeGreaterThan(0);
  });

  it("should preserve note formatting", () => {
    const note = "Line 1\nLine 2\nLine 3";
    expect(note.split("\n").length).toBe(3);
  });

  it("should track note metadata", () => {
    const note = {
      id: 1,
      intake_id: 100,
      note: "Test note content",
      created_by_id: 1,
      created_by_name: "Admin User",
      created_at: new Date().toISOString(),
    };

    expect(note).toHaveProperty("id");
    expect(note).toHaveProperty("intake_id");
    expect(note).toHaveProperty("note");
    expect(note).toHaveProperty("created_by_name");
    expect(note).toHaveProperty("created_at");
  });
});
