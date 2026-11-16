// Scenario ID: HMS-DOC-034
// Scenario Name: Doctor list search - letter case and spaces

describe("HMS-DOC-034: Doctor List Search - Letter Case and Extra Spaces", () => {
  it("ignores letter case and leading/trailing spaces when searching doctors", () => {
    cy.startScenarioChecklist(
      "HMS-DOC-034",
      "Doctor list search - letter case and spaces"
    );

    cy.getDoctorMgmtConfig().then((cfg) => {
      cy.adminLoginDetail();
      cy.openDoctorManagementList();
      cy.recordCheck("Admin login and navigate to Doctor Management directory");

      cy.get("table tbody tr td:nth-child(2)").first().then(($td) => {
        const liveName = $td.text().replace(/^Dr\.\s*/i, "").trim() || cfg.testData.search.fullName;

        // Test lowercase
        cy.searchDoctorDirectory(liveName.toLowerCase(), { pressEnter: true });
        cy.contains(liveName, { matchCase: false }).should("be.visible");
        cy.recordCheck(`Search with lowercase ('${liveName.toLowerCase()}') returns matching record`);

        // Test uppercase
        cy.clearDoctorSearchWithIcon();
        cy.searchDoctorDirectory(liveName.toUpperCase(), { pressEnter: true });
        cy.contains(liveName, { matchCase: false }).should("be.visible");
        cy.recordCheck(`Search with uppercase ('${liveName.toUpperCase()}') returns matching record`);

        // Test with surrounding spaces
        cy.clearDoctorSearchWithIcon();
        cy.searchDoctorDirectory(`  ${liveName}  `, { pressEnter: true });
        cy.contains(liveName, { matchCase: false }).should("be.visible");
        cy.recordCheck(`Search with leading/trailing spaces ('  ${liveName}  ') returns matching record`);

        cy.completeScenarioChecklist(
          "HMS-DOC-034",
          "Doctor list search - letter case and spaces"
        );
      });
    });
  });
});
