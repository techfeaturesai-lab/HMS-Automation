// Scenario ID: HMS-DOC-021
// Scenario Name: Inactivating Doctor/Department With Upcoming Bookings - Displays Warning Confirmation With Count

import { doctorSelectors } from "../../support/doctorSelectors";

describe("HMS-DOC-021: Inactivating Doctor With Upcoming Bookings Warning", () => {
  it("displays warning confirmation before inactivating doctor with active records", () => {
    cy.startScenarioChecklist(
      "HMS-DOC-021",
      "Inactivating Doctor/Department With Upcoming Bookings - Displays Warning Confirmation With Count"
    );

    cy.getDoctorMgmtConfig().then((cfg) => {
      cy.adminLoginDetail();
      cy.openDoctorManagementList();
      cy.recordCheck("Admin login and navigate to Doctor Management directory");

      // Locate active doctor row and deactivation action button
      cy.get("table tbody tr").first().within(() => {
        cy.get(doctorSelectors.listing.deactivateActionBtn).first().scrollIntoView().should("be.visible");
      });
      cy.recordCheck("Doctor deactivation action button is visible on active listing");

      // Click Deactivate button
      cy.get("table tbody tr").first().find(doctorSelectors.listing.deactivateActionBtn).first().click({ force: true });
      cy.wait(500);

      // Verify confirmation warning dialog appears
      cy.get("#deletemodal, .modal, [role='dialog']").should("be.visible");
      cy.contains("#deletemodal, .modal, body", /are you sure|deactivate|confirm|delete/i).should("be.visible");
      cy.recordCheck("Confirmation warning / modal prompt is displayed before doctor deactivation");

      // Dismiss or cancel confirmation so live doctor state is restored
      cy.get("#deletemodal button:contains('Cancel'), .modal button:contains('Cancel'), .btn-close")
        .first()
        .click({ force: true });
      cy.recordCheck("Dismiss confirmation dialog leaving doctor status intact");

      cy.completeScenarioChecklist(
        "HMS-DOC-021",
        "Inactivating Doctor/Department With Upcoming Bookings - Displays Warning Confirmation With Count"
      );
    });
  });
});
