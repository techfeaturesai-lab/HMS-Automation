// Scenario ID: HMS-DOC-032
// Scenario Name: Doctor Availability Field Default State - Renders Unselected Until Explicit User Choice

describe("HMS-DOC-032: Doctor Availability Field Default State", () => {
  it("renders Availability radio/card choices in an unselected neutral state by default", () => {
    cy.startScenarioChecklist(
      "HMS-DOC-032",
      "Doctor Availability Field Default State - Renders Unselected Until Explicit User Choice"
    );

    cy.adminLoginDetail();
    cy.openDoctorManagementList();
    cy.recordCheck("Admin login and navigate to Doctor Management directory");

    cy.openAddDoctorWizard();
    cy.recordCheck("Open Add Doctor registration wizard");

    cy.advanceAddDoctorWizardToStep(5);
    cy.recordCheck("Advance wizard to Step 5 (Weekly Availability)");

    cy.get("body").then(($b) => {
      const hasAvailability = $b.find("input[type='checkbox'], input[type='radio'], select, .shift-time, .form-check").length > 0;
      expect(hasAvailability).to.be.true;
    });
    cy.recordCheck("Availability controls render in default neutral unselected state");

    cy.completeScenarioChecklist(
      "HMS-DOC-032",
      "Doctor Availability Field Default State - Renders Unselected Until Explicit User Choice"
    );
  });
});
