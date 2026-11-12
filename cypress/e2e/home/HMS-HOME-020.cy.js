import { doctorDirectoryPage } from "../../pages/DoctorDirectoryPage";

/**
 * Test Suite: Home Page & Website
 * Scenario ID: HMS-HOME-020
 * Scenario Name: Verify State and Recovery Behavior Across Page Refresh on Doctor Listing
 *
 * Description:
 * Verify that refreshing the Doctor Listing page restores a stable interface
 * with intact doctor cards and interactive controls without UI crashes.
 */
describe("HMS-HOME-020: Doctor Listing Page Refresh Stability", () => {
  beforeEach(() => {
    doctorDirectoryPage.visitDirectory();
  });

  it("reloads cleanly on browser refresh without blank screen or broken state", () => {
    // 1 & 2. Apply a filter
    doctorDirectoryPage.selectDepartment("Cardiology");
    cy.wait(400);

    // 3. Reload page
    cy.reload();
    doctorDirectoryPage.waitForLoader();

    // 4. Verify Doctor Listing loads with valid cards and active buttons
    cy.contains("Dr.", { timeout: 15000 }).should("be.visible");
    doctorDirectoryPage.verifyDoctorsListingNotEmpty(1);
    cy.get(".card").first().find(".button-row .primary-btn").should("be.visible");
  });
});
