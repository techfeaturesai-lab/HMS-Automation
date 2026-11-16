// Scenario ID: HMS-DOC-026
// Scenario Name: Doctor Registration Field Validation & Error Specificity - Highlights Missing/Invalid Fields Clear of Generic Toast

import { doctorSelectors } from "../../support/doctorSelectors";

describe("HMS-DOC-026: Doctor Registration Field Validation Specificity", () => {
  it("shows field-level validation messages beside invalid/missing inputs without generic 'Something went wrong' toast", () => {
    cy.startScenarioChecklist(
      "HMS-DOC-026",
      "Doctor Registration Field Validation & Error Specificity - Highlights Missing/Invalid Fields Clear of Generic Toast"
    );

    cy.adminLoginDetail();
    cy.openDoctorManagementList();
    cy.recordCheck("Admin login and navigate to Doctor Management directory");

    cy.openAddDoctorWizard();
    cy.recordCheck("Open Add Doctor registration wizard");

    // Enter invalid email format into Email field on Step 1
    cy.get(doctorSelectors.wizard.step1.email).scrollIntoView().clear().type("invalid-email@");
    cy.recordCheck("Enter malformed email address ('invalid-email@')");

    // Click Next to trigger validation
    cy.clickDoctorWizardPrimaryBtn(/^next$/i);

    // Verify inline field-level validation appears
    cy.get("body").then(($b) => {
      const hasFieldError = /required|valid email|enter.*email|invalid/i.test($b.text()) ||
        $b.find(".text-danger, .invalid-feedback").length > 0;
      expect(hasFieldError).to.be.true;
    });
    cy.recordCheck("Field-level validation highlights invalid input specifically");

    // Verify no generic failure toast appears
    cy.contains(/^something went wrong\.?$/i).should("not.exist");
    cy.contains(/we are unable to process your request/i).should("not.exist");
    cy.recordCheck("Form stays on step without generic crash toast or unhandled error");

    cy.completeScenarioChecklist(
      "HMS-DOC-026",
      "Doctor Registration Field Validation & Error Specificity - Highlights Missing/Invalid Fields Clear of Generic Toast"
    );
  });
});
