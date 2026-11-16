// Scenario ID: HMS-DOC-014
// Scenario Name: Emergency Contact Name Validation - Rejects Numeric-Only Values

import { doctorSelectors } from "../../support/doctorSelectors";

describe("HMS-DOC-014: Emergency Contact Name Rejects Numeric-Only Values", () => {
  it("blocks numeric-only Emergency Contact Name with inline validation error", () => {
    cy.startScenarioChecklist(
      "HMS-DOC-014",
      "Emergency Contact Name Validation - Rejects Numeric-Only Values"
    );

    cy.getDoctorMgmtConfig().then((cfg) => {
      const emergency = cfg.testData.newDoctor?.emergencyContact || { mobile: "9876543210" };

      cy.adminLoginDetail();
      cy.openDoctorManagementList();
      cy.recordCheck("Admin login and navigate to Doctor Management directory");

      cy.openAddDoctorWizard();
      cy.recordCheck("Open Add Doctor registration wizard");

      // Scroll to Emergency Contact section at bottom of Step 1
      cy.scrollHmsDashboard("bottom");
      cy.get(doctorSelectors.wizard.step1.emergencyName).scrollIntoView().should("be.visible");
      cy.recordCheck("Navigate and scroll to Emergency Contact section on Step 1");

      // Enter numeric-only string into Emergency Contact Name
      cy.get(doctorSelectors.wizard.step1.emergencyName).clear().type("998877");
      cy.get(doctorSelectors.wizard.step1.emergencyMobile).clear().type(emergency.mobile);
      cy.get(doctorSelectors.wizard.step1.emergencyRelationship).select(1, { force: true });
      cy.recordCheck("Enter numeric-only value '998877' in Emergency Contact Name");

      // Click Next to trigger validation
      cy.clickDoctorWizardPrimaryBtn(/^next$/i);

      // Verify that numeric-only name triggers validation or prevents advancing to Step 2
      cy.get("body").then(($b) => {
        const errorOrBlocked =
          /only alphabets|invalid name|letters only|valid name|must be characters/i.test($b.text()) ||
          $b.find(".invalid-feedback, .text-danger").length > 0 ||
          $b.find(doctorSelectors.wizard.step1.emergencyName).hasClass("ng-invalid");

        expect(errorOrBlocked).to.be.true;
      });
      cy.recordCheck("Numeric-only Emergency Contact Name is rejected / marked invalid by validation rule");

      cy.completeScenarioChecklist(
        "HMS-DOC-014",
        "Emergency Contact Name Validation - Rejects Numeric-Only Values"
      );
    });
  });
});
