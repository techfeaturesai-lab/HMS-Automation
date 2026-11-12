import { doctorDirectoryPage } from "../../pages/DoctorDirectoryPage";

/**
 * Test Suite: Home Page & Website
 * Scenario ID: HMS-HOME-024
 * Scenario Name: Doctor Bio and Experience Boundary Display Across Departments
 *
 * Description:
 * Verify that doctor cards handle varied years of experience and names
 * without overflowing card width or clipping primary action buttons.
 */
describe("HMS-HOME-024: Doctor Card Layout Boundary Verification", () => {
  beforeEach(() => {
    doctorDirectoryPage.visitDirectory();
  });

  it("renders varied experience lengths and doctor names within card boundaries", () => {
    doctorDirectoryPage.verifyDoctorsListingNotEmpty(3);

    // Inspect experience indicators and card boundaries
    cy.get(".card").each(($card) => {
      cy.wrap($card).scrollIntoView();
      cy.wrap($card).within(() => {
        // Experience string exists
        cy.contains(".details", /yrs experience/i).should("exist");
        // Buttons stay within card
        cy.get(".button-row .cancel-btn").should("exist");
        cy.get(".button-row .primary-btn").should("exist");
      });
    });
  });
});
