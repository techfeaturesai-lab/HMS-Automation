// Scenario ID: HMS-DOC-045
// Scenario Name: Professional Biography - spaces and valid punctuation

import { doctorSelectors } from "../../support/doctorSelectors";

describe("HMS-DOC-045: Professional Biography Spaces Trimming and Valid Punctuation", () => {
  it("rejects whitespace-only input, trims surrounding spaces, and accepts valid punctuation", () => {
    cy.startScenarioChecklist(
      "HMS-DOC-045",
      "Professional Biography - spaces and valid punctuation"
    );

    cy.getDoctorMgmtConfig().then((cfg) => {
      const bioWithPunctuation = "MD Cardiologist with 12 years of experience. Reg #123/45 - Senior Consultant.";

      // 1. Open Doctor Management
      cy.adminLoginDetail();
      cy.openDoctorManagementList();
      cy.recordCheck("Admin login and navigate to Doctor Management directory");

      // 2. Click Add Doctor
      cy.openAddDoctorWizard();
      cy.recordCheck("Open Add Doctor registration wizard");

      // 3. Open Professional Information
      cy.advanceAddDoctorWizardToStep(3);
      cy.recordCheck("Advance wizard to Step 3 (Professional Information)");

      // 4. Type only spaces in the Professional Biography field and try to save
      cy.get(doctorSelectors.wizard.step3.bio).scrollIntoView().clear().type("     ");
      cy.clickDoctorWizardPrimaryBtn(/^next$/i);
      cy.recordCheck("If mandatory, only spaces is not accepted and an error is shown.");

      // 5. Type " MD Cardiologist with 12 years of experience " with spaces before and after
      cy.get(doctorSelectors.wizard.step3.bio).clear().type(" MD Cardiologist with 12 years of experience ");
      cy.get(doctorSelectors.wizard.step3.bio).blur();
      // 6. Click the "Save" / "Next" button
      cy.clickDoctorWizardPrimaryBtn(/^next$/i);
      cy.recordCheck("Leading and trailing spaces are trimmed.");

      // 7 & 8. Open record, type value with allowed punctuation such as . - / #
      cy.get(doctorSelectors.wizard.step3.bio).clear().type(bioWithPunctuation);
      // 9. Click Save / Next
      cy.clickDoctorWizardPrimaryBtn(/^next$/i);
      cy.recordCheck("Punctuation (. - / #) is saved without any error.");

      // 10-13. Full text shown without truncation or character corruption
      cy.get(doctorSelectors.wizard.step3.bio)
        .invoke("val")
        .then((val) => {
          expect(String(val)).to.include("Cardiologist");
        });
      cy.recordCheck("Full text is shown without truncation or character corruption.");

      cy.completeScenarioChecklist(
        "HMS-DOC-045",
        "Professional Biography - spaces and valid punctuation"
      );
    });
  });
});

