import { describe, it, expect } from "vitest";
import { generateIntakePDF } from "./intake-pdf";

describe("Intake PDF Generation", () => {
  it("should generate a PDF buffer for a basic intake", () => {
    const intake = {
      id: 1,
      first_name: "John",
      last_name: "Doe",
      phone: "818-555-1234",
      email: "john.doe@example.com",
      city: "Los Angeles",
      state: "CA",
      practice_area: "personal_injury",
      urgency: "normal",
      status: "submitted",
      created_at: new Date().toISOString(),
    };

    const pdfBuffer = generateIntakePDF(intake);

    expect(pdfBuffer).toBeInstanceOf(Buffer);
    expect(pdfBuffer.length).toBeGreaterThan(0);
    // PDF files start with %PDF
    expect(pdfBuffer.toString("utf8", 0, 4)).toBe("%PDF");
  });

  it("should include issue type in PDF", () => {
    const intake = {
      id: 2,
      first_name: "Jane",
      last_name: "Smith",
      created_at: new Date().toISOString(),
      issue_type: { name: "Car Accident" },
    };

    const pdfBuffer = generateIntakePDF(intake);
    expect(pdfBuffer).toBeInstanceOf(Buffer);
    expect(pdfBuffer.length).toBeGreaterThan(0);
  });

  it("should handle emergency urgency", () => {
    const intake = {
      id: 3,
      first_name: "Emergency",
      last_name: "Case",
      urgency: "emergency",
      created_at: new Date().toISOString(),
    };

    const pdfBuffer = generateIntakePDF(intake);
    expect(pdfBuffer).toBeInstanceOf(Buffer);
  });

  it("should include parties in PDF", () => {
    const intake = {
      id: 4,
      first_name: "Multi",
      last_name: "Party",
      created_at: new Date().toISOString(),
      parties: [
        { party_type: "defendant", party_role: "driver", name: "Other Driver" },
        { party_type: "witness", party_role: "bystander", name: "Witness Name" },
      ],
    };

    const pdfBuffer = generateIntakePDF(intake);
    expect(pdfBuffer).toBeInstanceOf(Buffer);
  });

  it("should include uploads in PDF", () => {
    const intake = {
      id: 5,
      first_name: "With",
      last_name: "Uploads",
      created_at: new Date().toISOString(),
      uploads: [
        { file_name: "document.pdf", tag: "police_report", file_size: 102400 },
        { file_name: "photo.jpg", tag: "accident_photos", file_size: 51200 },
      ],
    };

    const pdfBuffer = generateIntakePDF(intake);
    expect(pdfBuffer).toBeInstanceOf(Buffer);
  });

  it("should include personal injury practice details", () => {
    const intake = {
      id: 6,
      first_name: "PI",
      last_name: "Case",
      practice_area: "personal_injury",
      created_at: new Date().toISOString(),
      practice_details: {
        injury_severity: "moderate",
        treatment_received: true,
        treatment_types: ["hospital", "physical_therapy"],
        insurance_involved: true,
        vehicle_involved: true,
      },
    };

    const pdfBuffer = generateIntakePDF(intake);
    expect(pdfBuffer).toBeInstanceOf(Buffer);
  });

  it("should include criminal defense practice details", () => {
    const intake = {
      id: 7,
      first_name: "Criminal",
      last_name: "Defense",
      practice_area: "criminal_defense",
      created_at: new Date().toISOString(),
      practice_details: {
        charges: "DUI",
        has_court_date: true,
        court_date: new Date().toISOString(),
        custody_status: "released",
      },
    };

    const pdfBuffer = generateIntakePDF(intake);
    expect(pdfBuffer).toBeInstanceOf(Buffer);
  });

  it("should handle all practice areas", () => {
    const practiceAreas = [
      "personal_injury",
      "criminal_defense",
      "employment_law",
      "tenant_rights",
      "civil_litigation",
    ];

    practiceAreas.forEach((area) => {
      const intake = {
        id: 100,
        first_name: "Test",
        last_name: area,
        practice_area: area,
        created_at: new Date().toISOString(),
      };

      const pdfBuffer = generateIntakePDF(intake);
      expect(pdfBuffer).toBeInstanceOf(Buffer);
    });
  });
});
