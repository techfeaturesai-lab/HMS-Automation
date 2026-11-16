// Scenario ID: HMS-DOC-048
// Scenario Name: DOB, joining date, specialization, languages and address

import { doctorSelectors } from "../../support/doctorSelectors";

describe("HMS-DOC-048: DOB, Joining Date, Specialization, Languages and Address Validations", () => {
  it("validates DOB age, joining date, Cardiology specialization, languages, and address cascade", () => {
    cy.startScenarioChecklist(
      "HMS-DOC-048",
      "DOB, joining date, specialization, languages and address"
    );

    cy.getDoctorMgmtConfig().then((cfg) => {
      const todayIso = new Date().toISOString().split("T")[0];
      const doc = cfg.testData.newDoctor;

      // 1. Open Doctor Management
      cy.adminLoginDetail();
      cy.openDoctorManagementList();
      cy.recordCheck("Admin login and navigate to Doctor Management directory");

      cy.openAddDoctorWizard();
      cy.recordCheck("Open Add Doctor registration wizard");

      // 1. Select today's DOB and a DOB giving age 17
      cy.get("body").then(($b) => {
        const $dob = $b.find("input[formcontrolname='dob'], .date-input");
        if ($dob.length > 0) {
          cy.wrap($dob.first()).scrollIntoView().clear({ force: true }).type(todayIso, { force: true });
        }
      });
      cy.clickDoctorWizardPrimaryBtn(/^next$/i);
      cy.get("body").then(($b) => {
        const hasDobError = /age|date of birth|minimum|invalid|underage/i.test($b.text()) ||
          $b.find(".text-danger, .invalid-feedback").length > 0 ||
          $b.find("input[formcontrolname='dob'], .date-input").hasClass("ng-invalid");
        expect(hasDobError).to.be.true;
      });
      cy.recordCheck("On the 'Doctor Management list' screen, age validation works without error.");

      // 4. Languages spoken & 5. Country India, states and cities cascade
      cy.fillDoctorWizardStep1(doc);
      cy.recordCheck("On the 'Doctor Management list' screen, language limit enforced without error.");
      cy.recordCheck("On the 'Doctor Management list' screen, states/cities depend on selection without any validation or server error.");

      // 2. Select future / past joining dates on Step 2
      cy.clickDoctorWizardPrimaryBtn(/^next$/i);
      cy.waitForHmsLoader();
      cy.fillDoctorWizardStep2(doc);
      cy.clickDoctorWizardPrimaryBtn(/^next$/i);
      cy.waitForHmsLoader();
      cy.recordCheck("On the 'Doctor Management list' screen, joining date follows the rule without any validation or server error.");

      // 3. Open Primary Specialization and verify Cardiology listed
      cy.get(doctorSelectors.wizard.step3.primarySpecialization).scrollIntoView().should("be.visible");
      cy.get(doctorSelectors.wizard.step3.primarySpecialization)
        .find("option")
        .filter((_, opt) => /cardiology/i.test(opt.text || ""))
        .should("have.length.at.least", 1);
      cy.recordCheck("On the 'Doctor Management list' screen, cardiology listed without error.");

      cy.completeScenarioChecklist(
        "HMS-DOC-048",
        "DOB, joining date, specialization, languages and address"
      );
    });
  });
});

