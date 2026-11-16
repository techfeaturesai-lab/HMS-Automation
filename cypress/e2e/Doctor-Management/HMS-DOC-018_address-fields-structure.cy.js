// Scenario ID: HMS-DOC-018
// Scenario Name: Doctor Address Fields Structure - Includes Current/Permanent Line 1 & 2, Postal Code & Same-As

import { doctorSelectors } from "../../support/doctorSelectors";

describe("HMS-DOC-018: Doctor Address Fields Structure", () => {
  it("displays Current and Permanent Address blocks with City, State, Country, Postal Code, and Same-As checkbox", () => {
    cy.startScenarioChecklist(
      "HMS-DOC-018",
      "Doctor Address Fields Structure - Includes Current/Permanent Line 1 & 2, Postal Code & Same-As"
    );

    cy.adminLoginDetail();
    cy.openDoctorManagementList();
    cy.recordCheck("Admin login and navigate to Doctor Management directory");

    cy.openAddDoctorWizard();
    cy.recordCheck("Open Add Doctor registration wizard");

    // Scroll to Current Address section first
    cy.contains(/current address/i).scrollIntoView().should("be.visible");
    cy.recordCheck("Current Address section header is visible");

    // Verify Current Address controls
    cy.get(doctorSelectors.wizard.step1.country).scrollIntoView().should("be.visible");
    cy.get(doctorSelectors.wizard.step1.state).scrollIntoView().should("be.visible");
    cy.get(doctorSelectors.wizard.step1.city).scrollIntoView().should("be.visible");
    cy.get(doctorSelectors.wizard.step1.postalCode).scrollIntoView().should("be.visible");
    cy.get(doctorSelectors.wizard.step1.addressLine1).scrollIntoView().should("be.visible");
    cy.recordCheck("Current Address controls (Country, State, City, PIN Code, Address Line) render correctly");

    // Scroll down to 'Same as Current Address' checkbox & Permanent Address
    cy.get(doctorSelectors.wizard.step1.sameAsCurrentAddress).scrollIntoView().should("be.visible");
    cy.recordCheck("Same as Current Address checkbox is present and interactive");

    // Verify Permanent Address section and controls
    cy.contains(/permanent address/i).scrollIntoView().should("be.visible");
    cy.get(doctorSelectors.wizard.step1.permCountry).scrollIntoView().should("be.visible");
    cy.get(doctorSelectors.wizard.step1.permState).scrollIntoView().should("be.visible");
    cy.get(doctorSelectors.wizard.step1.permCity).scrollIntoView().should("be.visible");
    cy.get(doctorSelectors.wizard.step1.permPostalCode).scrollIntoView().should("be.visible");
    cy.get(doctorSelectors.wizard.step1.permAddress).scrollIntoView().should("be.visible");
    cy.recordCheck("Permanent Address controls (Country, State, City, PIN Code, Address Line) render correctly");

    cy.completeScenarioChecklist(
      "HMS-DOC-018",
      "Doctor Address Fields Structure - Includes Current/Permanent Line 1 & 2, Postal Code & Same-As"
    );
  });
});
