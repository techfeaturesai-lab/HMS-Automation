import { doctorDirectoryPage } from "../../pages/DoctorDirectoryPage";

/**
 * Test Suite: Home Page & Website
 * Scenario ID: HMS-HOME-006
 * Scenario Name: Doctor Search - Exact Full Name Search Returns Existing Doctor
 *
 * Description:
 * Verify that entering an active doctor's name in "Search Doctor"
 * returns the matching doctor card accurately.
 */
describe("HMS-HOME-006: Doctor Search - Exact Full Name Search Returns Existing Doctor", () => {
  beforeEach(() => {
    // 1 & 2. Open HMS website and navigate to Find Doctors by Department
    doctorDirectoryPage.visitDirectory();
  });

  it("filters doctor listing to display matching doctor card on exact name search", () => {
    // 3. Wait for Doctor Listing screen to load
    doctorDirectoryPage.verifyPageLoaded();

    // 4 & 5. Search for active doctor "Chandan Kumar"
    const searchTarget = "Chandan Kumar";
    doctorDirectoryPage.searchDoctor(searchTarget);

    // 6 & 7. Verify that matching doctor is displayed in results and no false "No doctors found"
    cy.contains(/No doctors found/i).should("not.exist");
    doctorDirectoryPage.getDoctorCard(searchTarget).should("be.visible").within(() => {
      cy.get("h3").should("contain.text", searchTarget);
      cy.get(".specialty").should("contain.text", "Cardiology");
    });
    // Brief visual pause to observe filtered search results in headed live mode
    cy.wait(1500);
  });
});
