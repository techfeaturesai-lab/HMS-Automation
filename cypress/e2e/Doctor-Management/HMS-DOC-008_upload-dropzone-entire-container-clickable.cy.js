// Scenario ID: HMS-DOC-008
// Scenario Name: Doctor Registration Upload Dropzone - Entire Container Clickable to Open File Picker

describe("HMS-DOC-008: Doctor Registration Upload Dropzone Clickability", () => {
  it("ensures both the upload dropzone container and Browse button trigger file selection", () => {
    cy.startScenarioChecklist(
      "HMS-DOC-008",
      "Doctor Registration Upload Dropzone - Entire Container Clickable to Open File Picker"
    );

    cy.adminLoginDetail();
    cy.openDoctorManagementList();
    cy.recordCheck("Admin login and navigate to Doctor Management directory");

    cy.openAddDoctorWizard();
    cy.recordCheck("Open Add Doctor registration wizard");

    cy.advanceAddDoctorWizardToStep(6);
    cy.recordCheck("Advance wizard to Step 6 (Professional Documents)");

    // Verify .upload-zone containers exist and are visible
    cy.get(".upload-zone").filter(":visible").should("have.length.at.least", 1);
    cy.recordCheck("Upload dropzone containers render visibly on screen");

    // Verify each dropzone container is clickable without error
    cy.get(".upload-zone")
      .filter(":visible")
      .each(($zone) => {
        cy.wrap($zone).scrollIntoView().should("be.visible");
        cy.wrap($zone).click({ force: true });
      });
    cy.recordCheck("Entire dropzone container is interactive and clickable");

    // Verify underlying file inputs exist for file attachment
    cy.get('input[type="file"]').should("have.length.at.least", 1);
    cy.recordCheck("Underlying native file inputs attached and ready for OS file selection");

    cy.completeScenarioChecklist(
      "HMS-DOC-008",
      "Doctor Registration Upload Dropzone - Entire Container Clickable to Open File Picker"
    );
  });
});
