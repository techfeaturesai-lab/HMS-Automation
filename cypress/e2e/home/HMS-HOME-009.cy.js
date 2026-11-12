import { doctorDirectoryPage } from "../../pages/DoctorDirectoryPage";

/**
 * Test Suite: Home Page & Website
 * Scenario ID: HMS-HOME-009
 * Scenario Name: Department Filter - Clear All Resets All Active Filters Without Defaulting
 *
 * Description:
 * Verify that clicking "Clear All" removes every selected department filter
 * and displays all active doctors without auto-selecting General Medicine.
 */
describe("HMS-HOME-009: Department Filter - Clear All Resets All Active Filters Without Defaulting", () => {
  beforeEach(() => {
    // 1 & 2. Open HMS website and navigate to Find Doctors by Department
    doctorDirectoryPage.visitDirectory();
  });

  it("resets all active department filters and restores all doctors on Clear All", () => {
    // Record initial total count of doctors across all departments
    cy.get(".card").then(($cards) => {
      const allDoctorsCount = $cards.length;

      // 3. Select "Cardiology, Gynecology" to filter the list
      doctorDirectoryPage.selectDepartment("Cardiology");
      cy.wait(2000);
      doctorDirectoryPage.selectDepartment("Gynecology");
      cy.wait(2000);

      // Verify filtered count is less than total
      cy.get(".card").should("have.length.lessThan", allDoctorsCount);

      // 4. Click the "Clear All" button
      doctorDirectoryPage.clickClearAll();
      cy.wait(2000);

      // 5, 6, 7, 8. Verify complete unfiltered list of active doctors reloads
      cy.get(".card").should("have.length", allDoctorsCount);
      // Ensure it didn't collapse or default to a single department
      cy.get(".card").find(".specialty").should("contain.text", "General Medicine");
      cy.get(".card").find(".specialty").should("contain.text", "Cardiology");
      cy.get(".card").find(".specialty").should("contain.text", "Gynecology");
    });
  });
});
