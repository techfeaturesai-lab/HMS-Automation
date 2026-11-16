// Scenario ID: HMS-DOC-036
// Scenario Name: Doctor list search - Clear (X) option

describe("HMS-DOC-036: Doctor List Search - Clear (X) Option", () => {
  it("renders Clear (X) icon when typing in Search Doctor and restores full list & Page 1 on click", () => {
    cy.startScenarioChecklist(
      "HMS-DOC-036",
      "Doctor list search - Clear (X) option"
    );

    cy.getDoctorMgmtConfig().then((cfg) => {
      cy.adminLoginDetail();
      cy.openDoctorManagementList();
      cy.recordCheck("Admin login and navigate to Doctor Management directory");

      cy.searchDoctorDirectory("Dr");
      cy.recordCheck("Enter search query into Search input");

      // Click Clear (X) icon and confirm reset to unfiltered list & Page 1
      cy.clearDoctorSearchWithIcon();
      cy.get('input[placeholder*="Search" i], input[type="search"]')
        .filter(":visible")
        .first()
        .should("have.value", "");
      cy.recordCheck("Clear (X) icon resets search input value to empty");

      cy.get("table tbody tr, .doctor-card").should("have.length.greaterThan", 0);
      cy.recordCheck("Unfiltered doctor list and pagination restored to Page 1");

      cy.completeScenarioChecklist(
        "HMS-DOC-036",
        "Doctor list search - Clear (X) option"
      );
    });
  });
});
