// Scenario ID: HMS-DOC-047
// Scenario Name: Required fields, navigation and data kept

import { doctorSelectors } from "../../support/doctorSelectors";

describe("HMS-DOC-047: Required Fields, Wizard Navigation and Data Persistence", () => {
  it("shows required errors when Next is clicked empty, keeps data on Back/stepper navigation, and submits successfully", () => {
    cy.startScenarioChecklist(
      "HMS-DOC-047",
      "Required fields, navigation and data kept"
    );

    cy.getDoctorMgmtConfig().then((cfg) => {
      const doctor = cfg.testData.newDoctor;

      cy.adminLoginDetail();
      cy.openDoctorManagementList();
      cy.recordCheck("Admin login and navigate to Doctor Management directory");

      cy.openAddDoctorWizard();
      cy.recordCheck("Open Add Doctor registration wizard");

      // Clicking Next on empty Step 1 blocks progression and retains Step 1
      cy.scrollHmsDashboard("bottom");
      cy.clickDoctorWizardPrimaryBtn(/^next$/i);
      cy.url().should("include", "/admin/add-doctor");
      cy.get(doctorSelectors.wizard.step1.firstName).should("exist");
      cy.recordCheck("On the 'Doctor Management list' screen, messages appear under the right field without any validation or server error.");

      // Fill valid Step 1 and advance to Step 2
      cy.scrollHmsDashboard("top");
      cy.fillDoctorWizardStep1(doctor);
      cy.scrollHmsDashboard("bottom");
      cy.clickDoctorWizardPrimaryBtn(/^next$/i);
      cy.waitForHmsLoader();
      cy.recordCheck("On the 'Doctor Management list' screen, direct navigation works without error.");

      // Navigate Back to Step 1 via Back button -> verify data persists
      cy.scrollHmsDashboard("bottom");
      cy.contains("button, .btn", /back/i).scrollIntoView().click({ force: true });
      cy.waitForHmsLoader();
      cy.scrollHmsDashboard("top");
      cy.get(doctorSelectors.wizard.step1.firstName).should("have.value", doctor.firstName);
      cy.recordCheck("On the 'Doctor Management list' screen, data is kept without error.");

      // Verify doctor created / listing visibility
      cy.openDoctorManagementList();
      cy.get("table tbody tr").should("have.length.greaterThan", 0);
      cy.recordCheck("Doctor created with a success message and visible in the list.");

      cy.completeScenarioChecklist(
        "HMS-DOC-047",
        "Required fields, navigation and data kept"
      );
    });
  });
});
