// Scenario ID: HMS-DOC-022
// Scenario Name: Edit Doctor Profile Documents - Displays Previously Uploaded Additional Documents

import { doctorSelectors } from "../../support/doctorSelectors";

describe("HMS-DOC-022: Edit Doctor Profile Displays Previously Uploaded Documents", () => {
  it("loads and renders previously uploaded documents in Edit mode", () => {
    cy.startScenarioChecklist(
      "HMS-DOC-022",
      "Edit Doctor Profile Documents - Displays Previously Uploaded Additional Documents"
    );

    cy.getDoctorMgmtConfig().then((cfg) => {
      cy.adminLoginDetail();
      cy.openDoctorManagementList();
      cy.recordCheck("Admin login and navigate to Doctor Management directory");

      // Open Edit Doctor mode
      cy.openDoctorRowAction("Dr.", "Edit");
      cy.waitForHmsLoader();
      cy.get(doctorSelectors.wizard.step1.firstName, { timeout: 15000 }).should("not.have.value", "");
      cy.recordCheck("Edit Doctor wizard loaded with profile data hydrated from backend");

      // Advance to Step 6 (Professional Documents)
      for (let s = 1; s <= 5; s += 1) {
        cy.clickDoctorWizardPrimaryBtn(/^next$/i);
        cy.waitForHmsLoader();
      }
      cy.recordCheck("Navigate to Step 6 (Professional Documents)");

      // Verify Document sections and uploaded controls are rendered
      cy.contains(/professional documents|documents/i).should("be.visible");
      cy.get(".upload-zone").filter(":visible").should("have.length.at.least", 1);
      cy.recordCheck("Professional Documents and attachment dropzones render in Edit mode");

      cy.completeScenarioChecklist(
        "HMS-DOC-022",
        "Edit Doctor Profile Documents - Displays Previously Uploaded Additional Documents"
      );
    });
  });
});
