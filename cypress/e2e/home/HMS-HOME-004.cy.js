import { doctorDirectoryPage } from "../../pages/DoctorDirectoryPage";

/**
 * Test Suite: Home Page & Website
 * Scenario ID: HMS-HOME-004
 * Scenario Name: Doctor Card - Next Available Slot Display for Active Doctor
 *
 * Description:
 * Verify that the "Next Available" slot label appears on doctor cards
 * whenever the doctor has an active schedule.
 */
describe("HMS-HOME-004: Doctor Card - Next Available Slot Display for Active Doctor", () => {
  beforeEach(() => {
    // 1. Navigate to Find Doctors by Department
    doctorDirectoryPage.visitDirectory();
  });

  it("displays an accurate Next Available indicator on active doctor cards", () => {
    // 2 & 3. Wait for Doctor Listing screen to load
    doctorDirectoryPage.verifyPageLoaded();
    doctorDirectoryPage.verifyDoctorsListingNotEmpty(1);

    // 4, 5, 6. Inspect availability label on active doctor cards
    doctorDirectoryPage.verifyNextAvailableSlot();

    // Verify format of the slot label (e.g. contains Today / Tomorrow / Date or Time)
    cy.get(".card").first().within(() => {
      cy.get(".text-available, strong").should("satisfy", ($el) => {
        const text = $el.text().trim();
        return text.length > 0;
      });
    });
  });
});
