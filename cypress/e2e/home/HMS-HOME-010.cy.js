import { doctorDirectoryPage } from "../../pages/DoctorDirectoryPage";

/**
 * Test Suite: Home Page & Website
 * Scenario ID: HMS-HOME-010
 * Scenario Name: Home Page & Doctor Listing - Empty Search Result & Recovery Test
 *
 * Description:
 * Verify that searching for a non-existent doctor displays a friendly empty state
 * rather than stale cards or errors, and allows clean recovery.
 */
describe("HMS-HOME-010: Home Page & Doctor Listing - Empty Search Result & Recovery Test", () => {
  beforeEach(() => {
    // 1 & 2. Open HMS website and navigate to Find Doctors by Department
    doctorDirectoryPage.visitDirectory();
  });

  it("displays friendly empty state on non-existent doctor query and restores on clear", () => {
    // Count initial active doctors
    cy.get(".card").then(($cards) => {
      const initialCount = $cards.length;
      expect(initialCount).to.be.at.least(1);

      // 3. Enter non-existent doctor into Search Doctor
      const nonExistentQuery = "Dr. NonExistentZz99";
      doctorDirectoryPage.searchDoctor(nonExistentQuery);
      cy.wait(500);

      // 4 & 5. Verify empty-state appears with zero cards and no app crash
      doctorDirectoryPage.verifyEmptyState();

      // 6. Clear search to recover
      doctorDirectoryPage.clearSearch();
      cy.wait(500);

      // Verify doctors are restored
      cy.get(".card").should("have.length", initialCount);
    });
  });
});
