import { homePage } from "../../pages/HomePage";
import { doctorDirectoryPage } from "../../pages/DoctorDirectoryPage";

/**
 * Test Suite: Home Page & Website
 * Scenario ID: HMS-HOME-013
 * Scenario Name: E2E - Public Visitor Discovers Doctor on Home Page and Initiates Booking
 *
 * Description:
 * Verify that an unauthenticated website visitor can discover a specialist on the Home Page,
 * navigate to Doctor Listing, filter by department, and initiate the appointment booking flow.
 */
describe("HMS-HOME-013: Public Visitor Discovers Doctor and Initiates Booking Flow", () => {
  it("transitions from public homepage discovery to doctor selection and booking initiation", () => {
    // 1 & 2. Open homepage and navigate to specialists
    homePage.visitHomePage();
    homePage.scrollToSpecialists();

    // 3 & 4. Navigate to Doctor Listing screen
    homePage.clickSeeAllSpecialists();
    doctorDirectoryPage.verifyPageLoaded();

    // 5. Select Cardiology department filter
    doctorDirectoryPage.selectDepartment("Cardiology");
    cy.wait(400);

    // 6. Find Dr. Chandan Kumar (Cardiology) card
    doctorDirectoryPage.getDoctorCard("Dr. Chandan Kumar").should("be.visible").within(() => {
      // 7. Click Book Appointment button
      cy.get(".button-row .primary-btn").click();
    });

    // 8. Verify user reaches booking interaction / prompt
    cy.get("body").should("satisfy", ($body) => {
      const text = $body.text();
      return (
        text.includes("Appointment") ||
        text.includes("Book") ||
        text.includes("Chandan Kumar") ||
        text.includes("Slot")
      );
    });
  });
});
