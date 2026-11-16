// Scenario ID: HMS-DOC-028
// Scenario Name: Primary Specialization Dropdown - Includes Cardiology Alongside Configured Specialties

import { doctorSelectors } from "../../support/doctorSelectors";

describe("HMS-DOC-028: Primary Specialization Includes Cardiology", () => {
  it("lists Cardiology in Primary Specialization dropdown and allows selecting it", () => {
    cy.startScenarioChecklist(
      "HMS-DOC-028",
      "Primary Specialization Dropdown - Includes Cardiology Alongside Configured Specialties"
    );

    cy.getDoctorMgmtConfig().then((cfg) => {
      cy.adminLoginDetail();
      cy.openDoctorManagementList();
      cy.recordCheck("Admin login and navigate to Doctor Management directory");

      cy.openAddDoctorWizard();
      cy.recordCheck("Open Add Doctor registration wizard");

      // Advance to Step 3 (Professional Information)
      cy.advanceAddDoctorWizardToStep(3);
      cy.recordCheck("Advance wizard to Step 3 (Professional Information)");

      // Verify Primary Specialization dropdown contains Cardiology
      cy.get(doctorSelectors.wizard.step3.primarySpecialization).scrollIntoView().should("be.visible");
      cy.get(doctorSelectors.wizard.step3.primarySpecialization)
        .find("option")
        .filter((_, opt) => /cardiology/i.test(opt.text || ""))
        .should("have.length.at.least", 1);
      cy.recordCheck("Cardiology is available in Primary Specialization dropdown options");

      // Select Cardiology
      cy.get(doctorSelectors.wizard.step3.primarySpecialization).then(($sel) => {
        const cardOpt = $sel.find("option").filter((_, opt) => /cardiology/i.test(opt.text || ""));
        cy.get(doctorSelectors.wizard.step3.primarySpecialization).select(cardOpt.first().val(), { force: true });
      });
      cy.recordCheck("Select Cardiology in Primary Specialization");

      cy.completeScenarioChecklist(
        "HMS-DOC-028",
        "Primary Specialization Dropdown - Includes Cardiology Alongside Configured Specialties"
      );
    });
  });
});
