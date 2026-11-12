import { doctorDirectoryPage } from "../../pages/DoctorDirectoryPage";

/**
 * Test Suite: Home Page & Website
 * Scenario ID: HMS-HOME-025
 * Scenario Name: Doctor Search Maximum 100-Character Query Boundary
 *
 * Description:
 * Verify that entering a 100-character query string in the public Find Doctors search bar
 * stays inside input boundaries without triggering HTTP 500 or layout breakage.
 */
describe("HMS-HOME-025: Doctor Search 100-Character Maximum Boundary", () => {
  beforeEach(() => {
    doctorDirectoryPage.visitDirectory();
  });

  it("retains layout integrity and zero server errors on 100-character query string", () => {
    // Generate exactly 100 characters query
    const boundaryQuery = "Dr. Cardiology Specialist Senior Consultant Practitioner General Physician " + "Z".repeat(25);
    const exact100 = boundaryQuery.substring(0, 100);
    expect(exact100.length).to.equal(100);

    // Type 100-character query
    doctorDirectoryPage.searchDoctor(exact100);
    cy.wait(400);

    // Verify search input value
    doctorDirectoryPage.elements.searchInput().should("have.value", exact100);

    // Verify page stability and zero crashes
    doctorDirectoryPage.verifyEmptyState();
    cy.get("body").should("not.contain.text", "500 Internal Server Error");
  });
});
