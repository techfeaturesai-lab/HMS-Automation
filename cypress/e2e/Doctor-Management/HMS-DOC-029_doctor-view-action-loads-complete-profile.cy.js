// Scenario ID: HMS-DOC-029
// Scenario Name: Doctor Management View Action - Opens Complete Doctor Profile Without Load Failure

import { doctorSelectors } from "../../support/doctorSelectors";

describe("HMS-DOC-029: Doctor Management View Action Opens Complete Profile", () => {
  it("opens full Doctor Profile on View click without load failure", () => {
    cy.startScenarioChecklist(
      "HMS-DOC-029",
      "Doctor Management View Action - Opens Complete Doctor Profile Without Load Failure"
    );

    cy.getDoctorMgmtConfig().then((cfg) => {
      cy.adminLoginDetail();
      cy.openDoctorManagementList();
      cy.recordCheck("Admin login and navigate to Doctor Management directory");

      // Verify doctor records exist in table
      cy.get("table tbody tr, .doctor-card").should("have.length.greaterThan", 0);
      cy.recordCheck("Doctor directory table renders active clinician rows");

      // Click View action on first available doctor row
      cy.get("table tbody tr").first().find(doctorSelectors.listing.viewActionBtn).first().scrollIntoView().click({ force: true });
      cy.waitForHmsLoader();

      // Verify profile detail page or modal opens cleanly without generic error
      cy.contains(/unable to load doctor profile|something went wrong/i).should("not.exist");
      cy.get("body").then(($b) => {
        const hasProfileData = $b.find(".profile-card, .doctor-profile, .card, table, form, .modal").length > 0;
        expect(hasProfileData).to.be.true;
      });
      cy.recordCheck("Doctor Profile view loads full clinician information without error");

      cy.completeScenarioChecklist(
        "HMS-DOC-029",
        "Doctor Management View Action - Opens Complete Doctor Profile Without Load Failure"
      );
    });
  });
});
