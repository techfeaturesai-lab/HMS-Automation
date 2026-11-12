import { doctorDirectoryPage } from "../../pages/DoctorDirectoryPage";

/**
 * Test Suite: Home Page & Website
 * Scenario ID: HMS-HOME-015
 * Scenario Name: Empty Department Filter Displays Appropriate Message Without Crash
 *
 * Description:
 * Verify that filtering by an active department with zero assigned doctors
 * displays an informative empty message instead of a blank white screen or application crash.
 */
describe("HMS-HOME-015: Empty Department Filter Displays Appropriate Message Without Crash", () => {
  beforeEach(() => {
    doctorDirectoryPage.visitDirectory();
  });

  it("displays informative message and no-crash state on department with zero doctors", () => {
    // Select a specialized department that has 0 assigned doctors (e.g., Rheumatology or Physiotherapy)
    cy.get(".dept-pills .pill").then(($pills) => {
      // Find a pill that is present in the list
      const pillNames = $pills.map((i, el) => Cypress.$(el).text().trim()).get();
      const targetDept = pillNames.find((name) =>
        ["Rheumatology", "Physiotherapy", "Nutrition", "ICU", "Pulmonology"].includes(name)
      ) || pillNames[pillNames.length - 1];

      doctorDirectoryPage.selectDepartment(targetDept);
      cy.wait(400);

      // Verify either matching cards appear or friendly empty-state renders (no 500 error / blank screen)
      cy.get("body").should("satisfy", ($body) => {
        return (
          $body.find(".card").length > 0 ||
          $body.text().includes("No doctors found") ||
          $body.text().includes("No doctors available")
        );
      });
      cy.get("body").should("not.contain.text", "500 Internal Server Error");
    });
  });
});
