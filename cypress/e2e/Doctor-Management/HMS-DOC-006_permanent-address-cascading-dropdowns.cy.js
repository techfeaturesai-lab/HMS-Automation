// Scenario ID: HMS-DOC-006
// Scenario Name: Doctor Permanent Address Dropdowns - Provides Country, State & City Cascading Dropdowns

import { doctorSelectors } from "../../support/doctorSelectors";

describe("HMS-DOC-006: Doctor Permanent Address Cascading Dropdowns", () => {
  it("provides cascading Country, State, and City dropdowns in Permanent Address", () => {
    cy.startScenarioChecklist(
      "HMS-DOC-006",
      "Doctor Permanent Address Dropdowns - Provides Country, State & City Cascading Dropdowns"
    );

    cy.getDoctorMgmtConfig().then((cfg) => {
      cy.adminLoginDetail();
      cy.openDoctorManagementList();
      cy.recordCheck("Admin login and navigate to Doctor Management directory");

      cy.openAddDoctorWizard();
      cy.recordCheck("Open Add Doctor registration wizard");

      // Scroll to Address Section on Step 1
      cy.get("#sameAsCurrentAddress").scrollIntoView();
      cy.contains("Permanent Address").scrollIntoView().should("be.visible");
      cy.recordCheck("Navigate and scroll to Permanent Address section on Step 1");

      const pCountry = doctorSelectors.wizard.step1.permCountry;
      const pState = doctorSelectors.wizard.step1.permState;
      const pCity = doctorSelectors.wizard.step1.permCity;

      // Check 1: Select Country in Permanent Address ('India')
      cy.get(pCountry)
        .scrollIntoView()
        .should("be.visible")
        .find("option:not([disabled]):not([value*='null'])", { timeout: 10000 })
        .should("have.length.greaterThan", 0);

      cy.get(pCountry).then(($country) => {
        const indOption = $country.find("option").filter((_, opt) => /india/i.test(opt.text || "") || opt.value === "76: 76");
        const val = indOption.length > 0 ? indOption.first().val() : $country.find("option:not([disabled]):not([value*='null'])").first().val();
        cy.get(pCountry).select(val);
      });
      cy.recordCheck("Select Country in Permanent Address ('India')");

      // Check 2: Verify State dropdown populates cascading options for selected Country
      cy.get(pState)
        .scrollIntoView()
        .should("be.visible")
        .find("option:not([disabled]):not([value*='null'])", { timeout: 10000 })
        .should("have.length.greaterThan", 0);

      cy.get(pState).then(($state) => {
        const stateOpt = $state.find("option").filter((_, opt) => /uttarakhand|karnataka|delhi|maharashtra/i.test(opt.text || "") || opt.value.includes("27"));
        const val = stateOpt.length > 0 ? stateOpt.first().val() : $state.find("option:not([disabled]):not([value*='null'])").first().val();
        cy.get(pState).select(val);
      });
      cy.recordCheck("Verify State dropdown populates cascading options for selected Country");

      // Check 3: Verify City dropdown populates cascading options for selected State
      cy.get(pCity)
        .scrollIntoView()
        .should("be.visible")
        .find("option:not([disabled]):not([value*='null'])", { timeout: 10000 })
        .should("have.length.greaterThan", 0);

      cy.get(pCity).then(($city) => {
        const cityOpt = $city.find("option").filter((_, opt) => /haldwani|bengaluru|bangalore/i.test(opt.text || "") || opt.value.includes("121"));
        const val = cityOpt.length > 0 ? cityOpt.first().val() : $city.find("option:not([disabled]):not([value*='null'])").first().val();
        cy.get(pCity).select(val);
      });
      cy.recordCheck("Verify City dropdown populates cascading options for selected State");

      // Check 4: Verify dropdown values persist
      cy.get(pCountry).should("have.value", "76: 76");
      cy.get(pState).should("not.have.value", "0: null");
      cy.get(pCity).should("not.have.value", "0: null");
      cy.recordCheck("Permanent Address Country, State, and City cascading dropdown values verified");

      cy.completeScenarioChecklist(
        "HMS-DOC-006",
        "Doctor Permanent Address Dropdowns - Provides Country, State & City Cascading Dropdowns"
      );
    });
  });
});
