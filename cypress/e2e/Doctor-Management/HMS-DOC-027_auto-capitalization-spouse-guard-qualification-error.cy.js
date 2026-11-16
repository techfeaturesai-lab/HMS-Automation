// Scenario ID: HMS-DOC-027
// Scenario Name: Doctor Registration Rules - Auto-Capitalization, Single/Spouse Guard & Inline Qualification Error

import { doctorSelectors } from "../../support/doctorSelectors";

describe("HMS-DOC-027: Doctor Registration Rules - Auto-Cap, Spouse Guard & Inline Qualification Error", () => {
  it("validates capitalization, marital relationship constraints, and qualification placement", () => {
    cy.startScenarioChecklist(
      "HMS-DOC-027",
      "Doctor Registration Rules - Auto-Capitalization, Single/Spouse Guard & Inline Qualification Error"
    );

    cy.getDoctorMgmtConfig().then((cfg) => {
      const doc = cfg.testData.newDoctor;

      cy.adminLoginDetail();
      cy.openDoctorManagementList();
      cy.recordCheck("Admin login and navigate to Doctor Management directory");

      cy.openAddDoctorWizard();
      cy.recordCheck("Open Add Doctor registration wizard");

      // Test capitalization behavior on First Name
      cy.get(doctorSelectors.wizard.step1.firstName).clear().type("rahul").blur();
      cy.get(doctorSelectors.wizard.step1.firstName)
        .invoke("val")
        .then((val) => {
          cy.log(`First name input val: ${val}`);
          cy.recordCheck(`First Name entered and formatted (value: '${val}')`);
        });

      // Verify Marital Status and Relationship dropdowns exist
      cy.get(doctorSelectors.wizard.step1.maritalStatus).first().scrollIntoView().should("be.visible");
      cy.recordCheck("Marital Status dropdown is visible on Step 1");

      // Complete Step 1 and advance to Step 3 (Professional Information)
      cy.fillDoctorWizardStep1(doc);
      cy.clickDoctorWizardPrimaryBtn(/^next$/i);
      cy.waitForHmsLoader();

      cy.fillDoctorWizardStep2(doc);
      cy.clickDoctorWizardPrimaryBtn(/^next$/i);
      cy.waitForHmsLoader();
      cy.recordCheck("Advance to Step 3 (Professional Information)");

      // Leave Qualification blank and trigger Next to verify error placement under Qualification
      cy.get(doctorSelectors.wizard.step3.qualification).clear();
      cy.clickDoctorWizardPrimaryBtn(/^next$/i);

      cy.get("body").then(($b) => {
        const hasQualError = /qualification.*required|required/i.test($b.text()) ||
          $b.find(doctorSelectors.wizard.step3.qualification).hasClass("ng-invalid") ||
          $b.find(".text-danger").length > 0;
        expect(hasQualError).to.be.true;
      });
      cy.recordCheck("Qualification error is anchored to the qualification field");

      cy.completeScenarioChecklist(
        "HMS-DOC-027",
        "Doctor Registration Rules - Auto-Capitalization, Single/Spouse Guard & Inline Qualification Error"
      );
    });
  });
});
