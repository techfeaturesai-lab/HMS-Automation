describe("Dump Step 2 HTML", () => {
  it("dumps Step 2", () => {
    cy.adminLoginDetail();
    cy.openDoctorManagementList();
    cy.openAddDoctorWizard();
    cy.fillDoctorWizardStep1();
    cy.scrollHmsDashboard("bottom");
    cy.clickDoctorWizardPrimaryBtn(/^next$/i);
    cy.waitForHmsLoader();
    cy.get("body").then(($b) => {
      cy.writeFile("cypress/fixtures/step2-dump.html", $b.html());
    });
  });
});

