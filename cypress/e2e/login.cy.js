describe("HMS Staff Login Suite", () => {
  beforeEach(() => {
    cy.visit("");
    cy.get(".loader-backdrop", { timeout: 15000 }).should("not.exist");
  });

  it("successfully logs in with valid credentials (HMS-4 / Admin@123)", () => {
    // Open Staff Login modal
    cy.get(".header-staff-btn").click();
    cy.get("#staffNumberInput").should("be.visible");

    // Enter staff credentials
    cy.get("#staffNumberInput").clear().type("HMS-4");
    cy.get("#staffPasswordInput").clear().type("Admin@123");

    // Click Log In
    cy.get('button.modern-submit-btn, button[type="submit"]').click();

    // Verify redirection to front-office dashboard
    cy.url({ timeout: 15000 }).should("include", "/frontofficedashboard");

    // Verify logged-in receptionist profile in the sidebar
    cy.get(".profile-name", { timeout: 15000 }).should("contain.text", "Aditi Sharma");
    cy.get(".profile-role").should("contain.text", "Receptionist");

    // Verify key front-office sidebar menu items
    const sidebarMenuItems = [
      "Dashboard",
      "Patient Management",
      "Appointments",
      "Medical Digitizer",
      "IPD",
      "Billing Management",
      "Leave Management",
    ];

    sidebarMenuItems.forEach((item) => {
      cy.get(".nav-list").contains(item).should("be.visible");
    });

    // Verify dashboard metrics and sections
    cy.contains("OPD TODAY").should("be.visible");
    cy.contains("IPD TODAY").should("be.visible");
    cy.contains("PAYMENT DUE").should("be.visible");
    cy.contains("Attention Required").should("be.visible");
  });

  it("shows error feedback when logging in with invalid password", () => {
    cy.get(".header-staff-btn").click();
    cy.get("#staffNumberInput").clear().type("HMS-4");
    cy.get("#staffPasswordInput").clear().type("WrongPassword@999");
    cy.get('button.modern-submit-btn, button[type="submit"]').click();

    // Verify user is not logged in / modal remains visible or toast appears
    cy.get("body").should("satisfy", ($body) => {
      return (
        $body.find(".hms-toast-container").length > 0 ||
        $body.find(".split-auth-modal").length > 0 ||
        $body.text().includes("Welcome Back")
      );
    });
  });
});
