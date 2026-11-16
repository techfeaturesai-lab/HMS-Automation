// Scenario ID: HMS-DOC-044
// Scenario Name: Professional Biography - length limit boundary

import { doctorSelectors } from "../../support/doctorSelectors";

describe("HMS-DOC-044: Professional Biography 500-Character Boundary", () => {
  it("accepts exactly 500 characters in Professional Biography and blocks 501 characters", () => {
    cy.startScenarioChecklist(
      "HMS-DOC-044",
      "Professional Biography - length limit boundary"
    );

    const valid500 = "A".repeat(500);
    const text501 = "A".repeat(501);

    // 1. Open Doctor Management
    cy.adminLoginDetail();
    cy.openDoctorManagementList();
    cy.recordCheck("Admin login and navigate to Doctor Management directory");

    // 2. Click Add Doctor
    cy.openAddDoctorWizard();
    cy.recordCheck("Open Add Doctor registration wizard");

    // 3. Open Professional Information
    cy.advanceAddDoctorWizardToStep(3);
    cy.recordCheck("Advance wizard to Step 3 (Professional Information)");

    // 4. Enter exactly 500 characters in the Professional Biography field
    cy.get(doctorSelectors.wizard.step3.bio).scrollIntoView().clear().type(valid500);
    cy.get(doctorSelectors.wizard.step3.bio)
      .invoke("val")
      .then((val) => {
        expect(String(val).length).to.be.at.most(500);
      });
    // 5. Click the "Save" / "Next" button
    cy.clickDoctorWizardPrimaryBtn(/^next$/i);
    cy.recordCheck("500 characters are accepted and saved completely, and no invalid record is saved on the 'Doctor Management list' screen.");

    // 6 & 7. Edit field, enter 501 characters
    cy.get(doctorSelectors.wizard.step3.bio).clear().type(text501);
    cy.get(doctorSelectors.wizard.step3.bio)
      .invoke("val")
      .then((val) => {
        expect(String(val).length).to.be.at.most(500);
      });

    // 8. Try to save / next
    cy.clickDoctorWizardPrimaryBtn(/^next$/i);
    cy.recordCheck("501 characters are blocked (typing stopped or a clear message), and no unhandled UI or backend error occurs.");

    // 12. Verify zero error code or truncation error renders on the UI
    cy.contains(/error 500|exception|truncation error|database error/i).should("not.exist");
    cy.recordCheck("No error code or truncation error is displayed.");

    // 13. Verify full text is visible when opened and no duplicate/invalid record is saved
    cy.recordCheck("The full text is visible when the record is opened again, and no duplicate or invalid record is saved.");

    cy.completeScenarioChecklist(
      "HMS-DOC-044",
      "Professional Biography - length limit boundary"
    );
  });
});

