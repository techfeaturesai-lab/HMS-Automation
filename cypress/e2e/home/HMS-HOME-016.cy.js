import { doctorDirectoryPage } from "../../pages/DoctorDirectoryPage";

/**
 * Test Suite: Home Page & Website
 * Scenario ID: HMS-HOME-016
 * Scenario Name: Doctor Search Minimum 1 Character and Maximum 100 Character Boundary
 *
 * Description:
 * Verify Home Page doctor search responsiveness with single-character prefix queries
 * and 100-character query strings without UI overflow or application crashes.
 */
describe("HMS-HOME-016: Doctor Search 1-Character and 100-Character Query Boundaries", () => {
  beforeEach(() => {
    doctorDirectoryPage.visitDirectory();
  });

  it("handles single-character search prefix and 100-character query without layout break", () => {
    // 1, 2, 3. Search single character 'A'
    doctorDirectoryPage.searchDoctor("A");
    cy.wait(400);

    // Verify search responds (either matching cards or empty state without error)
    cy.get("body").should("satisfy", ($body) => {
      return $body.find(".card").length > 0 || $body.text().includes("No doctors found");
    });

    // 4, 5, 6. Search with 100-character boundary string
    const longQuery = "Dr. Cardiology Specialist Senior Consultant Practitioner General Physician " + "X".repeat(25);
    doctorDirectoryPage.searchDoctor(longQuery.substring(0, 100));
    cy.wait(400);

    // Verify input stays within screen boundaries and no HTTP 500 occurs
    doctorDirectoryPage.elements.searchInput().should("be.visible");
    cy.get("body").should("not.contain.text", "500 Internal Server Error");
    cy.get("body").should("not.contain.text", "Cannot read properties");
  });
});
