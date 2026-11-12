import { doctorDirectoryPage } from "../../pages/DoctorDirectoryPage";

/**
 * Test Suite: Home Page & Website
 * Scenario ID: HMS-HOME-005
 * Scenario Name: Doctor Card - View Profile / Details Visibility & Structure
 *
 * Description:
 * Verify that each doctor card displays complete doctor information, qualifications/experience,
 * fee, and interactive elements.
 */
describe("HMS-HOME-005: Doctor Card - View Profile / Details Visibility & Structure", () => {
  beforeEach(() => {
    // 1 & 2. Open HMS website and navigate to Find Doctors by Department
    doctorDirectoryPage.visitDirectory();
  });

  it("displays doctor profile details, experience, fee, and actions without checkout redirect", () => {
    // 3 & 4. Verify Doctor Listing loads
    doctorDirectoryPage.verifyPageLoaded();
    doctorDirectoryPage.verifyDoctorsListingNotEmpty(1);

    // 5 & 6. Inspect details displayed on doctor cards
    cy.get(".card").first().within(() => {
      // Doctor photo
      cy.get(".card-img-area img").should("be.visible").and("have.attr", "src");
      // Doctor name
      cy.get("h3").should("be.visible").and("contain.text", "Dr.");
      // Specialty
      cy.get(".specialty").should("be.visible").and("not.be.empty");
      // Experience
      cy.get(".details").contains(/yrs experience/i).should("be.visible");
      // Consultation Fee
      cy.contains("Consultation Fee").should("be.visible");
      // Action buttons
      cy.get(".button-row .cancel-btn").should("contain.text", "Call");
      cy.get(".button-row .primary-btn").should("contain.text", "Book Appointment");
    });

    // 7, 8, 9. Verify page stays on doctor list without prematurely triggering payment checkout
    cy.url().should("include", "/home/doctor-list");
    cy.get("body").should("not.contain.text", "Payment Failed");
  });
});
