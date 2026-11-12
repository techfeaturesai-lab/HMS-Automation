import { doctorDirectoryPage } from "../../pages/DoctorDirectoryPage";

/**
 * Test Suite: Home Page & Website
 * Scenario ID: HMS-HOME-008
 * Scenario Name: Department Filter - Consistent Selection and Toggle Behavior
 *
 * Description:
 * Verify that selecting and toggling a department filter shows only doctors
 * in that department and restores all doctors on toggle off.
 */
describe("HMS-HOME-008: Department Filter - Consistent Selection and Toggle Behavior", () => {
  beforeEach(() => {
    // 1 & 2. Open HMS website and navigate to Find Doctors by Department
    doctorDirectoryPage.visitDirectory();
  });

  it("filters strictly by department and restores default list on toggle", () => {
    // 3. Wait for Doctor Listing screen to load
    doctorDirectoryPage.verifyPageLoaded();

    // Count initial total doctors
    cy.get(".card").then(($initialCards) => {
      const initialTotal = $initialCards.length;
      expect(initialTotal).to.be.at.least(2);

      // 4 & 5. Click "Cardiology" filter pill
      doctorDirectoryPage.selectDepartment("Cardiology");
      cy.wait(1000);

      // Verify only Cardiology doctors are displayed
      doctorDirectoryPage.verifyDepartmentFiltered("Cardiology");

      // 6, 7, 8. Click "Cardiology" again (or Clear All) to deselect filter
      doctorDirectoryPage.clickClearAll();
      cy.wait(1000);

      // Verify all active doctors across departments are restored
      cy.get(".card").should("have.length", initialTotal);
      cy.contains(/No doctors found/i).should("not.exist");
    });
  });
});
