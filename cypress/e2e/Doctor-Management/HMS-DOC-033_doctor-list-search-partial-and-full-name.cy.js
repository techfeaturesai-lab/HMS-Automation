// Scenario ID: HMS-DOC-033
// Scenario Name: Doctor list search - partial and full name

describe("HMS-DOC-033: Doctor List Search - Partial and Full Name", () => {
  it("returns matching doctor records for first name, last name, and complete full name", () => {
    cy.startScenarioChecklist(
      "HMS-DOC-033",
      "Doctor list search - partial and full name"
    );

    cy.getDoctorMgmtConfig().then((cfg) => {
      cy.adminLoginDetail();
      cy.openDoctorManagementList();
      cy.recordCheck("Admin login and navigate to Doctor Management directory");

      // Verify doctor records exist
      cy.get("table tbody tr").should("have.length.greaterThan", 0);
      cy.recordCheck("Doctor directory renders active rows");

      // Resolve doctor name dynamically or fallback to config
      cy.get("table tbody tr td:nth-child(2)").first().then(($td) => {
        const liveName = $td.text().replace(/^Dr\.\s*/i, "").trim();
        const parts = liveName.split(" ").filter(Boolean);
        const firstName = parts[0] || cfg.testData.search.partialFirst;
        const lastName = parts.length > 1 ? parts[parts.length - 1] : cfg.testData.search.partialLast;
        const targetFullName = liveName || cfg.testData.search.fullName;

        // Search 1: First name only
        cy.searchDoctorDirectory(firstName, { pressEnter: true });
        cy.contains(firstName, { matchCase: false }).should("be.visible");
        cy.recordCheck(`Search by partial first name ('${firstName}') returns matching record`);

        // Search 2: Last name only
        cy.clearDoctorSearchWithIcon();
        cy.searchDoctorDirectory(lastName, { pressEnter: true });
        cy.contains(lastName, { matchCase: false }).should("be.visible");
        cy.recordCheck(`Search by partial last name ('${lastName}') returns matching record`);

        // Search 3: Complete full name
        cy.clearDoctorSearchWithIcon();
        cy.searchDoctorDirectory(targetFullName, { pressEnter: true });
        cy.contains(targetFullName, { matchCase: false }).should("be.visible");
        cy.recordCheck(`Search by full name ('${targetFullName}') returns exact record`);

        cy.completeScenarioChecklist(
          "HMS-DOC-033",
          "Doctor list search - partial and full name"
        );
      });
    });
  });
});
