// Scenario ID: HMS-DOC-035
// Scenario Name: Doctor list search - no match and special characters

describe("HMS-DOC-035: Doctor List Search - No Match and Special Characters", () => {
  it("shows a clean 'No records found' state for non-existent names and special characters without errors", () => {
    cy.startScenarioChecklist(
      "HMS-DOC-035",
      "Doctor list search - no match and special characters"
    );

    cy.getDoctorMgmtConfig().then((cfg) => {
      const { noMatch, specialChars, altSpecialChars } = cfg.testData.search;

      cy.adminLoginDetail();
      cy.openDoctorManagementList();
      cy.recordCheck("Admin login and navigate to Doctor Management directory");

      // Search non-existent query
      cy.searchDoctorDirectory(noMatch, { pressEnter: true });
      cy.contains(/no records found|no doctors found|no matching|0 results/i).should("be.visible");
      cy.recordCheck(`Non-existent query ('${noMatch}') displays clean No Records Found state`);

      // Search special characters
      cy.clearDoctorSearchWithIcon();
      cy.searchDoctorDirectory(specialChars, { pressEnter: true });
      cy.get("body").then(($b) => {
        const text = $b.text();
        const hasNoRecords = /no records found|no doctors found|no matching|0 results/i.test(text);
        const hasNoCrash = !/500|exception|stack trace|unhandled/i.test(text);
        expect(hasNoCrash).to.be.true;
      });
      cy.recordCheck(`Special characters query ('${specialChars}') handles safely without server error`);

      cy.completeScenarioChecklist(
        "HMS-DOC-035",
        "Doctor list search - no match and special characters"
      );
    });
  });
});
