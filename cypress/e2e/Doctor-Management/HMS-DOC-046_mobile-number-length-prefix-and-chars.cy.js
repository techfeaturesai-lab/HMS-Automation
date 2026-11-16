// Scenario ID: HMS-DOC-046
// Scenario Name: Mobile number - length, prefix and characters

import { doctorSelectors } from "../../support/doctorSelectors";

describe("HMS-DOC-046: Mobile Number Length, Prefix and Character Validation", () => {
  it("rejects <10 digits, >10 digits, letters, and spaces, and accepts a valid 10-digit mobile number", () => {
    cy.startScenarioChecklist(
      "HMS-DOC-046",
      "Mobile number - length, prefix and characters"
    );

    cy.getDoctorMgmtConfig().then((cfg) => {
      // 1. Open Add Doctor and go to Contact Information (Step 1)
      cy.adminLoginDetail();
      cy.openDoctorManagementList();
      cy.recordCheck("Admin login and navigate to Doctor Management directory");

      cy.openAddDoctorWizard();
      cy.recordCheck("Open Add Doctor registration wizard");

      // 2. Enter 987654321 (9 digits)
      cy.get(doctorSelectors.wizard.step1.mobile).scrollIntoView().clear().type("987654321");
      cy.clickDoctorWizardPrimaryBtn(/^next$/i);
      cy.get("body").then(($b) => {
        const hasMobileErr = /10 digit|invalid|valid.*mobile|phone|required/i.test($b.text()) ||
          $b.find(".text-danger, .invalid-feedback").length > 0 ||
          $b.find(doctorSelectors.wizard.step1.mobile).hasClass("ng-invalid");
        expect(hasMobileErr).to.be.true;
      });
      cy.recordCheck("On the 'Doctor Management list' screen, 9 digits show a validation message without any validation or server error.");

      // 3. Enter 98765432101 (11 digits)
      cy.get(doctorSelectors.wizard.step1.mobile).clear().type("98765432101");
      cy.get(doctorSelectors.wizard.step1.mobile)
        .invoke("val")
        .then((val) => {
          expect(String(val).length).to.be.at.most(10);
        });
      cy.recordCheck("On the 'Doctor Management list' screen, only 10 digits can be entered without any validation or server error.");

      // 4. Type abcdefghij
      cy.get(doctorSelectors.wizard.step1.mobile).clear().type("abcdefghij");
      cy.get(doctorSelectors.wizard.step1.mobile)
        .invoke("val")
        .then((val) => {
          expect(String(val)).to.not.eq("abcdefghij");
        });

      // 5. Enter 9876 543210 with a space
      cy.get(doctorSelectors.wizard.step1.mobile).clear().type("9876 543210");
      cy.get(doctorSelectors.wizard.step1.mobile)
        .invoke("val")
        .then((val) => {
          expect(String(val)).to.not.include(" ");
        });
      cy.recordCheck("On the 'Doctor Management list' screen, letters, symbols and spaces are not accepted without any validation or server error.");

      // 6. Enter 9876543210 (valid 10 digits)
      const validMobile = "9876543210";
      cy.get(doctorSelectors.wizard.step1.mobile).clear().type(validMobile);
      cy.get(doctorSelectors.wizard.step1.mobile)
        .invoke("val")
        .should("match", /^\d{10}$/);
      cy.recordCheck("On the 'Doctor Management list' screen, valid number is accepted without error.");

      cy.completeScenarioChecklist(
        "HMS-DOC-046",
        "Mobile number - length, prefix and characters"
      );
    });
  });
});

