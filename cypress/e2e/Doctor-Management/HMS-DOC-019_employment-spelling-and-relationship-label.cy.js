// Scenario ID: HMS-DOC-019
// Scenario Name: Staff/Doctor Employment Spelling & Labels - Correct Spelling and Emergency Contact Relationship Label

import { doctorSelectors } from "../../support/doctorSelectors";

describe("HMS-DOC-019: Employment Spelling & Emergency Contact Relationship Label", () => {
  it("verifies accurate spelling for Employment Information and Emergency Contact Relationship", () => {
    cy.startScenarioChecklist(
      "HMS-DOC-019",
      "Staff/Doctor Employment Spelling & Labels - Correct Spelling and Emergency Contact Relationship Label"
    );

    cy.getDoctorMgmtConfig().then((cfg) => {
      cy.adminLoginDetail();
      cy.openDoctorManagementList();
      cy.recordCheck("Admin login and navigate to Doctor Management directory");

      cy.openAddDoctorWizard();
      cy.recordCheck("Open Add Doctor registration wizard");

      // Check Step 1 Emergency Contact relationship label
      cy.scrollHmsDashboard("bottom");
      cy.get(doctorSelectors.wizard.step1.emergencyRelationship).scrollIntoView().should("be.visible");
      cy.recordCheck("Emergency Contact Relationship selector is visible on Step 1");

      // Advance to Step 2
      cy.fillDoctorWizardStep1(cfg.testData.newDoctor);
      cy.clickDoctorWizardPrimaryBtn(/^next$/i);
      cy.waitForHmsLoader();

      // Verify Employment Information spelling (not 'Employeement')
      cy.contains(/employment information/i).should("be.visible");
      cy.contains(/employeement/i).should("not.exist");
      cy.recordCheck("Heading accurately spelled 'Employment Information' (no typos)");

      cy.completeScenarioChecklist(
        "HMS-DOC-019",
        "Staff/Doctor Employment Spelling & Labels - Correct Spelling and Emergency Contact Relationship Label"
      );
    });
  });
});
