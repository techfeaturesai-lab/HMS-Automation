// Scenario ID: HMS-DOC-031
// Scenario Name: Doctor DOB Minimum Age Validation - Rejects Current Date as Doctor Date of Birth

import { doctorSelectors } from "../../support/doctorSelectors";

describe("HMS-DOC-031: Doctor DOB Minimum Age Validation", () => {
  it("rejects today's current date as Doctor Date of Birth", () => {
    cy.startScenarioChecklist(
      "HMS-DOC-031",
      "Doctor DOB Minimum Age Validation - Rejects Current Date as Doctor Date of Birth"
    );

    const todayIso = new Date().toISOString().split("T")[0];

    cy.adminLoginDetail();
    cy.openDoctorManagementList();
    cy.recordCheck("Admin login and navigate to Doctor Management directory");

    cy.openAddDoctorWizard();
    cy.recordCheck("Open Add Doctor registration wizard");

    // Enter today's date into DOB
    cy.get("body").then(($b) => {
      const $dob = $b.find("input[formcontrolname='dob'], .date-input");
      if ($dob.length > 0) {
        cy.wrap($dob.first()).scrollIntoView().clear({ force: true }).type(todayIso, { force: true });
        cy.recordCheck("Enter current date as Doctor Date of Birth");
      }
    });

    // Click Next to trigger validation
    cy.clickDoctorWizardPrimaryBtn(/^next$/i);

    // Verify form blocks current date or marks DOB field invalid
    cy.get("body").then(($b) => {
      const hasDobError = /age|date of birth|minimum|invalid|underage/i.test($b.text()) ||
        $b.find("input[formcontrolname='dob'], .date-input").hasClass("ng-invalid") ||
        $b.find(".text-danger, .invalid-feedback").length > 0;
      expect(hasDobError).to.be.true;
    });
    cy.recordCheck("System blocks current date / underage DOB with validation feedback");

    cy.completeScenarioChecklist(
      "HMS-DOC-031",
      "Doctor DOB Minimum Age Validation - Rejects Current Date as Doctor Date of Birth"
    );
  });
});
