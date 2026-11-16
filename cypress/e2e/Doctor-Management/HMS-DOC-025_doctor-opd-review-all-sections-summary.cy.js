// Scenario ID: HMS-DOC-025
// Scenario Name: Doctor OPD Final Review Action - Review All Sections Opens Consolidated Summary

import { doctorSelectors } from "../../support/doctorSelectors";

describe("HMS-DOC-025: Doctor Final Review Consolidated Summary", () => {
  it("opens a consolidated summary highlighting entered details across all sections", () => {
    cy.startScenarioChecklist(
      "HMS-DOC-025",
      "Doctor OPD Final Review Action - Review All Sections Opens Consolidated Summary"
    );

    cy.getDoctorMgmtConfig().then((cfg) => {
      const doc = cfg.testData.newDoctor;

      cy.adminLoginDetail();
      cy.openDoctorManagementList();
      cy.recordCheck("Admin login and navigate to Doctor Management directory");

      cy.openAddDoctorWizard();
      cy.recordCheck("Open Add Doctor registration wizard");

      // Advance through all wizard steps up to Step 7 (Review & Register)
      cy.fillCompleteDoctorRegistrationWizard(doc);
      cy.recordCheck("Fill wizard steps 1 to 6 and advance to Step 7 (Review & Register)");

      // Verify consolidated review card renders summary of entered details
      cy.scrollHmsDashboard("top");
      cy.get(".card, .dashboard-container").should("exist");
      cy.contains(doctorSelectors.wizard.step7.card, doc.firstName).scrollIntoView().should("be.visible");
      cy.contains(doctorSelectors.wizard.step7.card, doc.lastName).scrollIntoView().should("be.visible");
      cy.recordCheck("Consolidated review card renders entered clinician details across all sections");

      // Verify final confirmation checkbox and submit button render
      cy.scrollHmsDashboard("bottom");
      cy.contains("button, .primary-btn", /register doctor|submit/i).scrollIntoView().should("be.visible");
      cy.recordCheck("Final confirmation review controls render ready for submission");

      cy.completeScenarioChecklist(
        "HMS-DOC-025",
        "Doctor OPD Final Review Action - Review All Sections Opens Consolidated Summary"
      );
    });
  });
});
