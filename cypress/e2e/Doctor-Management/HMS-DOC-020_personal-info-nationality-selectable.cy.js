// Scenario ID: HMS-DOC-020
// Scenario Name: Doctor Personal Information Nationality Field - Visible and Selectable in Step 1

import { doctorSelectors } from "../../support/doctorSelectors";

describe("HMS-DOC-020: Doctor Personal Information Nationality Field", () => {
  it("displays Nationality field in Step 1 Personal Information and allows selecting Indian (not Afghanistan)", () => {
    cy.startScenarioChecklist(
      "HMS-DOC-020",
      "Doctor Personal Information Nationality Field - Visible and Selectable in Step 1"
    );

    cy.getDoctorMgmtConfig().then((cfg) => {
      // 1. Admin login & navigate to Doctor Management
      cy.adminLoginDetail();
      cy.openDoctorManagementList();
      cy.recordCheck("Admin login and navigate to Doctor Management directory");

      // 2. Open Add Doctor wizard
      cy.openAddDoctorWizard();
      cy.recordCheck("Open Add Doctor registration wizard");

      // 3. Verify Nationality dropdown on Step 1
      const natSelector = doctorSelectors.wizard.step1.nationality || "select[formcontrolname='nationality']";
      cy.get(natSelector)
        .scrollIntoView()
        .should("be.visible")
        .find("option:not([disabled]):not([value*='null'])", { timeout: 10000 })
        .should("have.length.greaterThan", 5);
      cy.recordCheck("Nationality dropdown is visible on Step 1 Personal Information with populated options");

      // 4. Select 'Indian' / 'India' (explicitly avoiding Afghanistan)
      cy.get(natSelector).then(($sel) => {
        const indOpt = $sel
          .find("option")
          .filter((_, opt) => /^\s*india\s*$/i.test(opt.text || "") || /india/i.test(opt.text || "") || opt.value.includes("76"));
        if (indOpt.length > 0) {
          cy.get(natSelector).select(indOpt.first().val(), { force: true });
        } else {
          cy.get(natSelector).select("India", { force: true });
        }
      });

      // 5. Explicitly verify selected nationality is India / Indian and NOT Afghanistan
      cy.get(natSelector)
        .find("option:selected")
        .should("contain.text", "India")
        .and("not.contain.text", "Afghanistan");
      cy.recordCheck("Select 'Indian' ('India') in Nationality dropdown (verified not Afghanistan)");

      // 6. Verify selection is preserved in form state
      cy.get(natSelector).should("not.have.value", "0: null");
      cy.recordCheck("Nationality field displays in Step 1 Personal Information and saves selected nationality.");

      cy.completeScenarioChecklist(
        "HMS-DOC-020",
        "Doctor Personal Information Nationality Field - Visible and Selectable in Step 1"
      );
    });
  });
});
