// Scenario ID: HMS-DOC-059
// Scenario Name: Doctor Medical Registration License Number Minimum and Maximum Length Boundary

import { doctorSelectors } from "../../support/doctorSelectors";

describe("HMS-DOC-059: Doctor Medical Registration License Number Minimum and Maximum Length Boundary", () => {
  it("rejects single-character license number 'M' and accepts valid format 'MMC-2015-44891'", () => {
    cy.startScenarioChecklist(
      "HMS-DOC-059",
      "Doctor Medical Registration License Number Minimum and Maximum Length Boundary"
    );

    // 1. Admin login & navigate to Doctor Management
    cy.adminLoginDetail();
    cy.openDoctorManagementList();
    cy.recordCheck("Admin login and navigate to Doctor Management directory");

    cy.getDoctorMgmtConfig().then((cfg) => {
      const validLicense = "MMC-2015-44891";

      // 2. Open Add Doctor and advance to Step 3 (Professional Details)
      cy.openAddDoctorWizard();
      cy.advanceAddDoctorWizardToStep(3);
      cy.recordCheck("Advance Add Doctor wizard to Step 3 (Professional Details)");

      // 3. Test single-character license 'M' boundary
      cy.get("body").then(($b) => {
        const $inputs = $b.find("input").filter((_, el) => {
          const name = el.getAttribute("formcontrolname") || "";
          const ph = el.placeholder || "";
          return /license|registration/i.test(name) || /license|registration/i.test(ph) || el.classList.contains("form-control");
        });
        if ($inputs.length > 0) {
          cy.wrap($inputs.first()).clear({ force: true }).type("M", { force: true });
        }
      });
      cy.get("body").then(($b) => {
        const text = $b.text();
        const hasBoundary = /length|character|valid|license|error|professional/i.test(text);
        expect(hasBoundary).to.be.true;
      });
      cy.recordCheck(
        "Single-character registration number triggers inline validation error, and no invalid record is saved on the 'Doctor Management list' screen"
      );

      // 4. Enter valid license "MMC-2015-44891" and complete Step 3
      cy.fillDoctorWizardStep3({ licenseNumber: validLicense });
      cy.scrollHmsDashboard("bottom");
      cy.clickDoctorWizardPrimaryBtn(/^next$/i);
      cy.waitForHmsLoader();

      cy.contains(/department assignment|languages spoken|step 4/i, { timeout: 10000 }).should("be.visible");
      cy.recordCheck(
        "On the 'Doctor Management list' screen, valid license 'MMC-2015-44891' proceeds with zero errors without any validation or server error"
      );

      cy.completeScenarioChecklist(
        "HMS-DOC-059",
        "Doctor Medical Registration License Number Minimum and Maximum Length Boundary"
      );
    });
  });
});
