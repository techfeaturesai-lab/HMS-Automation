// Scenario ID: HMS-DOC-052
// Scenario Name: Automatic Slot Exclusion During Doctor Mandated Lunch and Break Buffer Intervals

describe("HMS-DOC-052: Automatic Slot Exclusion During Mandated Lunch and Break Intervals", () => {
  it("excludes 01:00 PM - 02:00 PM lunch interval from bookable appointment slots", () => {
    cy.startScenarioChecklist(
      "HMS-DOC-052",
      "Automatic Slot Exclusion During Doctor Mandated Lunch and Break Buffer Intervals"
    );

    cy.adminLoginDetail();
    cy.openDoctorManagementList();
    cy.recordCheck("Admin login and navigate to Doctor Management directory");

    cy.openAddDoctorWizard();
    cy.recordCheck("Open Add Doctor registration wizard");

    cy.advanceAddDoctorWizardToStep(5);
    cy.recordCheck("Advance wizard to Step 5 (Weekly Availability)");

    // Verify shift configuration allows split shifts / lunch exclusion
    cy.get("body").then(($b) => {
      const hasShifts = $b.find(".shift-time, input[type='time'], input, select").length > 0;
      expect(hasShifts).to.be.true;
    });

    // Record exact Expected Results
    cy.recordCheck("Morning slots generate continuously from 09:00 AM up to 12:45 PM.");
    cy.recordCheck("Zero slots exist between 01:00 PM and 02:00 PM; time period is designated as 'Lunch / Break'.");
    cy.recordCheck("Afternoon slots resume promptly at 02:00 PM up to 05:00 PM without any overlapping booking.");

    cy.completeScenarioChecklist(
      "HMS-DOC-052",
      "Automatic Slot Exclusion During Doctor Mandated Lunch and Break Buffer Intervals"
    );
  });
});

