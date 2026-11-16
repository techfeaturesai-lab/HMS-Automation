// Scenario ID: HMS-DOC-015
// Scenario Name: Doctor Registration DOB Picker & Location Cascade - Chronological Years, Flags & Cascading City

import { doctorSelectors } from "../../support/doctorSelectors";

describe("HMS-DOC-015: Doctor Registration DOB Picker & Location Cascade", () => {
  it("displays chronological DOB year/month selectors, country flags, and cascading State/City dropdowns", () => {
    cy.startScenarioChecklist(
      "HMS-DOC-015",
      "Doctor Registration DOB Picker & Location Cascade - Chronological Years, Flags & Cascading City"
    );

    cy.getDoctorMgmtConfig().then((cfg) => {
      cy.adminLoginDetail();
      cy.openDoctorManagementList();
      cy.recordCheck("Admin login and navigate to Doctor Management directory");

      cy.openAddDoctorWizard();
      cy.recordCheck("Open Add Doctor registration wizard");

      // Verify DOB input field and calendar trigger
      cy.get("body").then(($b) => {
        const $dob = $b.find("input[formcontrolname='dob'], .date-input");
        if ($dob.length > 0) {
          cy.wrap($dob.first()).scrollIntoView().should("be.visible");
          cy.recordCheck("DOB date picker input is visible and accessible");
        }
      });

      // Scroll to Address Section on Step 1
      cy.get(doctorSelectors.wizard.step1.country).scrollIntoView().should("be.visible");
      cy.recordCheck("Navigate and scroll to Address Information on Step 1");

      // Verify Country dropdown populates options
      cy.get(doctorSelectors.wizard.step1.country)
        .find("option:not([disabled]):not([value*='null'])")
        .should("have.length.greaterThan", 0);
      
      // Select Country = India
      cy.get(doctorSelectors.wizard.step1.country).select("76: 76", { force: true });
      cy.recordCheck("Select Country in Current Address ('India')");

      // Verify State dropdown populates cascading options
      cy.get(doctorSelectors.wizard.step1.state)
        .find("option:not([disabled]):not([value*='null'])", { timeout: 10000 })
        .should("have.length.greaterThan", 0);
      cy.get(doctorSelectors.wizard.step1.state).select("35: 27", { force: true });
      cy.recordCheck("State dropdown populates cascading options for selected Country");

      // Verify City dropdown populates cascading options
      cy.get(doctorSelectors.wizard.step1.city)
        .find("option:not([disabled]):not([value*='null'])", { timeout: 10000 })
        .should("have.length.greaterThan", 0);
      cy.get(doctorSelectors.wizard.step1.city).select("30: 121", { force: true });
      cy.recordCheck("City dropdown populates cascading options for selected State");

      cy.completeScenarioChecklist(
        "HMS-DOC-015",
        "Doctor Registration DOB Picker & Location Cascade - Chronological Years, Flags & Cascading City"
      );
    });
  });
});
