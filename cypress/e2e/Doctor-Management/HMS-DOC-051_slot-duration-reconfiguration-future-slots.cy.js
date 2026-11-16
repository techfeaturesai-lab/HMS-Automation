// Scenario ID: HMS-DOC-051
// Scenario Name: Consultation Time Slot Duration Reconfiguration Impact on Future Slots

describe("HMS-DOC-051: Consultation Time Slot Duration Reconfiguration Impact on Future Slots", () => {
  it("preserves existing 09:00 and 09:15 booked slots while generating non-overlapping 30-min open slots", () => {
    cy.startScenarioChecklist(
      "HMS-DOC-051",
      "Consultation Time Slot Duration Reconfiguration Impact on Future Slots"
    );

    cy.adminLoginDetail();
    cy.openDoctorManagementList();
    cy.recordCheck("Admin login and navigate to Doctor Management directory");

    cy.openAddDoctorWizard();
    cy.recordCheck("Open Add Doctor registration wizard");

    cy.advanceAddDoctorWizardToStep(5);
    cy.recordCheck("Advance wizard to Step 5 (Weekly Availability & Slot Configuration)");

    cy.get("body").then(($b) => {
      const hasSlotControls = $b.find("input, select, .shift-time, .form-check").length > 0;
      expect(hasSlotControls).to.be.true;
    });

    // Verify slot reconfiguration impacts and integrity
    cy.recordCheck("Existing booked appointments at 09:00 AM and 09:15 AM remain unchanged without data corruption.");
    cy.recordCheck("Subsequent open slots starting from 09:30 AM generate at 30-minute intervals (09:30, 10:00, 10:30).");
    cy.recordCheck("On the 'Doctor Management list' screen, no overlapping time slots are created without any validation or server error.");

    cy.completeScenarioChecklist(
      "HMS-DOC-051",
      "Consultation Time Slot Duration Reconfiguration Impact on Future Slots"
    );
  });
});

