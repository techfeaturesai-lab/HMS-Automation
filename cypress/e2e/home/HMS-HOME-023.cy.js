import { doctorDirectoryPage } from "../../pages/DoctorDirectoryPage";

/**
 * Test Suite: Home Page & Website
 * Scenario ID: HMS-HOME-023
 * Scenario Name: Consultation Fee Formatting and Currency Symbol Verification
 *
 * Description:
 * Verify that doctor cards display formatted currency consultation fees
 * with the "₹" currency symbol without decimal rounding artifacts or "NaN" text.
 */
describe("HMS-HOME-023: Consultation Fee Currency and Format Verification", () => {
  beforeEach(() => {
    doctorDirectoryPage.visitDirectory();
  });

  it("verifies consultation fees display the ₹ symbol and valid numeric amounts", () => {
    doctorDirectoryPage.verifyDoctorsListingNotEmpty(2);

    // Verify consultation fee on doctor cards
    cy.get(".card").each(($card) => {
      cy.wrap($card).scrollIntoView();
      cy.wrap($card).contains(/Consultation Fee/i).should("exist");
      cy.wrap($card).within(() => {
        cy.contains("strong", "₹").should("exist").invoke("text").then((feeText) => {
          expect(feeText).to.include("₹");
          expect(feeText).to.not.include("NaN");
          expect(feeText).to.not.include("undefined");
          expect(feeText).to.not.include("null");

          // Extract numeric value
          const numericValue = parseInt(feeText.replace(/[^\d]/g, ""), 10);
          expect(numericValue).to.be.greaterThan(0);
        });
      });
    });
  });
});
