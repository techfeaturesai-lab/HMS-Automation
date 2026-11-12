import { doctorDirectoryPage } from "../../pages/DoctorDirectoryPage";

/**
 * Test Suite: Home Page & Website
 * Scenario ID: HMS-HOME-007
 * Scenario Name: Doctor Profile - Full Name Consistency Across Card & Booking Screen
 *
 * Description:
 * Verify that a doctor's full name shown on the Doctor Card matches
 * the name shown when initiating booking.
 */
describe("HMS-HOME-007: Doctor Profile - Full Name Consistency Across Card & Booking Screen", () => {
  beforeEach(() => {
    // 1 & 2. Open HMS website and navigate to Find Doctors by Department
    doctorDirectoryPage.visitDirectory();
  });

  it("verifies doctor's full name is consistent and un-truncated on card and booking action", () => {
    // 3. Verify Doctor Listing loads
    doctorDirectoryPage.verifyPageLoaded();

    // 4. Capture doctor's full name from first card
    cy.get(".card").first().find("h3").invoke("text").then((rawName) => {
      const docFullName = rawName.trim();

      // 5. Click Book Appointment on that card
      cy.get(".card").first().find(".button-row .primary-btn").click();

      doctorDirectoryPage.waitForLoader();

      // 6. Wait for Doctor Profile / Booking screen to load
      cy.url({ timeout: 15000 }).should("include", "/home/doctor-profile");
      doctorDirectoryPage.waitForLoader();

      // 7 & 8. Verify the exact doctor full name matches on the booking/profile screen
      cy.contains(docFullName, { timeout: 15000 }).should("be.visible");
    });
  });
});
