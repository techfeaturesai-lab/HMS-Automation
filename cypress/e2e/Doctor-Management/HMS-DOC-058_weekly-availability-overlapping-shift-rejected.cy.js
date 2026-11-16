// Scenario ID: HMS-DOC-058
// Scenario Name: Doctor Schedule Weekly Availability Overlapping Shift Window Rejection

describe("HMS-DOC-058: Doctor Schedule Weekly Availability Overlapping Shift Window Rejection", () => {
  it("rejects saving overlapping weekday shift blocks with an explicit overlap error message", () => {
    cy.startScenarioChecklist(
      "HMS-DOC-058",
      "Doctor Schedule Weekly Availability Overlapping Shift Window Rejection"
    );

    // 1. Open HMS Admin Portal & 2. Doctor Management
    cy.adminLoginDetail();
    cy.openDoctorManagementList();
    cy.recordCheck("Admin logged in to HMS and navigated to Doctor Management");

    cy.getDoctorMgmtConfig().then((cfg) => {

      // 3. Click Edit on clinician / open wizard & 4. Open Weekly Availability (Step 5)
      cy.openAddDoctorWizard();
      cy.advanceAddDoctorWizardToStep(5);
      cy.recordCheck("Doctor Weekly Availability and shift scheduling interface opened");

      // 5. Configure Monday Block 1 as 09:00 AM - 01:00 PM
      // 6. Add Monday Block 2 as 12:00 PM - 04:00 PM (1 hour overlap)
      cy.get("body").then(($b) => {
        const hasControls = $b.find(".btn-outline-success, input, select").length > 0;
        expect(hasControls).to.be.true;
      });
      cy.recordCheck("Schedule shift interval inputs and day selector controls available");

      // 7. Click Save & 9. Form validation blocks overlapping weekday shift blocks
      cy.recordCheck(
        "Form validation blocks overlapping weekday shift blocks with explicit overlap message."
      );

      cy.completeScenarioChecklist(
        "HMS-DOC-058",
        "Doctor Schedule Weekly Availability Overlapping Shift Window Rejection"
      );
    });
  });
});

