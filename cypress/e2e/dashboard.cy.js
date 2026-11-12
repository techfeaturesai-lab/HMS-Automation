describe("HMS Receptionist Front Office Dashboard", () => {
  beforeEach(() => {
    // Log in using the custom command
    cy.login("HMS-4", "Admin@123");
  });

  it("displays receptionist profile on dashboard", () => {
    cy.get(".profile-name").should("contain.text", "Aditi Sharma");
    cy.get(".profile-role").should("contain.text", "Receptionist");
  });

  it("displays patient search bar and quick action buttons", () => {
    cy.get('input[placeholder*="Search Patients"]').should("be.visible");
    cy.contains("Find OPD Slot").should("be.visible");
    cy.contains("Today").should("be.visible");
    cy.contains("Week").should("be.visible");
    cy.contains("New IPD Admission").should("be.visible");
    cy.contains("Collect Payment").should("be.visible");
  });

  it("displays primary operational stat cards", () => {
    const stats = ["OPD TODAY", "IPD TODAY", "DISCHARGES", "PAYMENT DUE", "REFUNDS", "BEDS AVAILABLE"];
    stats.forEach((stat) => {
      cy.contains(stat).should("be.visible");
    });
  });
});
