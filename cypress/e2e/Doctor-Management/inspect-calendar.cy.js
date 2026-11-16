describe("Inspect Calendar Popup", () => {
  it("inspects calendar on Step 2", () => {
    cy.adminLoginDetail();
    cy.openDoctorManagementList();
    cy.openAddDoctorWizard();
    cy.fillDoctorWizardStep1();
    cy.scrollHmsDashboard("bottom");
    cy.clickDoctorWizardPrimaryBtn(/^next$/i);
    cy.waitForHmsLoader();

    // Click calendar trigger
    cy.get(".custom-date-picker .calendar-trigger, .custom-date-picker .date-input").first().click({ force: true });
    cy.wait(1000);

    cy.get("body").then(($b) => {
      // Find calendar popup elements
      const popupHtml = $b.find(".calendar-dropdown, .custom-calendar, .picker-panel, [role='dialog'], .mat-datepicker-content, bs-datepicker-container").html() || $b.html();
      cy.writeFile("cypress/fixtures/calendar-dump.html", popupHtml);
    });
  });
});

