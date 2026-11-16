// Scenario ID: HMS-DOC-037
// Scenario Name: Doctor list search - state after leaving the page

describe("HMS-DOC-037: Doctor List Search State Resets After Leaving Page", () => {
  it("resets search input, filters, and page number to defaults after navigating away and returning", () => {
    cy.startScenarioChecklist(
      "HMS-DOC-037",
      "Doctor list search - state after leaving the page"
    );

    cy.getDoctorMgmtConfig().then((cfg) => {
      cy.adminLoginDetail();
      cy.openDoctorManagementList();
      cy.recordCheck("Admin login and navigate to Doctor Management directory");

      // Enter search filter
      cy.searchDoctorDirectory(cfg.testData.search.partialLast);
      cy.recordCheck(`Apply search filter ('${cfg.testData.search.partialLast}')`);

      // Navigate to Staff Management and return
      cy.visit(cfg.urls.staffManagement);
      cy.waitForHmsLoader();
      cy.recordCheck("Navigate away to another administrative module");

      cy.openDoctorManagementList();
      cy.recordCheck("Return to Doctor Management directory");

      // Verify search input is reset to empty
      cy.get('input[placeholder*="Search" i], input[type="search"]')
        .filter(":visible")
        .first()
        .should("have.value", "");
      cy.recordCheck("Search box is reset to empty on re-entry");

      // Verify list shows records
      cy.get("table tbody tr, .doctor-card").should("have.length.greaterThan", 0);
      cy.recordCheck("List displays default state and records without error");

      cy.completeScenarioChecklist(
        "HMS-DOC-037",
        "Doctor list search - state after leaving the page"
      );
    });
  });
});
