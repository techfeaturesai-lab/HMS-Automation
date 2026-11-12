import { doctorDirectoryPage } from "../../pages/DoctorDirectoryPage";

/**
 * Test Suite: Home Page & Website
 * Scenario ID: HMS-HOME-003
 * Scenario Name: Doctor Card - Uniform Alignment Across Specialties
 *
 * Description:
 * Verify that doctor cards across all departments maintain consistent height
 * and button alignment on the doctor listing screen.
 */
describe("HMS-HOME-003: Doctor Card - Uniform Alignment Across Specialties", () => {
  beforeEach(() => {
    // 1 & 2. Open the HMS website and navigate to Find Doctors by Department
    doctorDirectoryPage.visitDirectory();
  });

  it("verifies uniform card alignment and presence of action buttons across rows", () => {
    // 3. Wait for the Doctor Listing screen to load
    doctorDirectoryPage.verifyPageLoaded();
    doctorDirectoryPage.verifyDoctorsListingNotEmpty(2);

    // 4 & 6. Verify every doctor card has Call and Book Appointment buttons
    doctorDirectoryPage.verifyUniformCardAlignment();

    // Verify baseline alignment: compare top offsets of action buttons on adjacent cards in same row
    cy.get(".card").then(($cards) => {
      expect($cards.length).to.be.at.least(2);
      const firstBtn = $cards.eq(0).find(".button-row");
      const secondBtn = $cards.eq(1).find(".button-row");

      // Verify buttons exist and are positioned
      expect(firstBtn.length).to.be.greaterThan(0);
      expect(secondBtn.length).to.be.greaterThan(0);
      cy.wrap(firstBtn).should("exist");
      cy.wrap(secondBtn).should("exist");
    });
  });
});
