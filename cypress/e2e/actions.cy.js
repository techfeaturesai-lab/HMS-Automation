describe("HMS Front Office - Interactive Features", () => {
  beforeEach(() => {
    cy.visit("");
    cy.get(".loader-backdrop", { timeout: 15000 }).should("not.exist");
  });

  it("can interact with the Book Appointment button", () => {
    cy.get(".header-btn-book").click();
    cy.url().should("include", "/home");
  });

  it("opens the Staff Login modal with all required fields", () => {
    // Click Staff Login button
    cy.get(".header-staff-btn").click();

    // Verify modal appears with login elements
    cy.contains("Welcome Back").should("be.visible");
    cy.contains("Enter your Staff Number and password to access your account.").should("be.visible");

    // Verify input fields and Log In button
    cy.get('input[placeholder*="HMS-4"], input[type="text"]').should("be.visible");
    cy.get('input[type="password"]').should("be.visible");
    cy.contains("button", "Log In").should("be.visible");
    cy.contains("Forgot Your Password?").should("be.visible");
  });
});
