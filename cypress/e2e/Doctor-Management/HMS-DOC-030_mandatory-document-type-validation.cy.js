// Scenario ID: HMS-DOC-030
// Scenario Name: Mandatory Document Type Validation - Blocks Next Step Until Document Type Is Selected

describe("HMS-DOC-030: Mandatory Document Type Validation", () => {
  it("blocks proceeding past Professional Documents and displays required error when unselected", () => {
    cy.startScenarioChecklist(
      "HMS-DOC-030",
      "Mandatory Document Type Validation - Blocks Next Step Until Document Type Is Selected"
    );

    cy.adminLoginDetail();
    cy.openDoctorManagementList();
    cy.recordCheck("Admin login and navigate to Doctor Management directory");

    cy.openAddDoctorWizard();
    cy.recordCheck("Open Add Doctor registration wizard");

    // Advance to Step 6 (Professional Documents)
    cy.advanceAddDoctorWizardToStep(6);
    cy.recordCheck("Advance wizard to Step 6 (Professional Documents)");

    // Click Next without choosing mandatory Document Type or files
    cy.clickDoctorWizardPrimaryBtn(/^next$/i);

    // Verify required validation appears and wizard progression halts
    cy.contains(/type.*required|document.*required|is required/i)
      .scrollIntoView()
      .should("be.visible");
    cy.contains(/professional documents|documents/i).should("be.visible");
    cy.recordCheck("Wizard blocks navigation and displays document type / mandatory validation");

    cy.completeScenarioChecklist(
      "HMS-DOC-030",
      "Mandatory Document Type Validation - Blocks Next Step Until Document Type Is Selected"
    );
  });
});
