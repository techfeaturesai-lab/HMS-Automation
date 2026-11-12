// ***********************************************
// Custom Cypress Commands for HMS Front Office
// ***********************************************

/**
 * Custom command to log in as a staff member.
 * @param {string} staffNumber - Staff Number (default: HMS-4)
 * @param {string} password - Password (default: Admin@123)
 */
Cypress.Commands.add("login", (staffNumber = "HMS-4", password = "Admin@123") => {
  cy.visit("");
  cy.get(".loader-backdrop", { timeout: 15000 }).should("not.exist");

  // Open the Staff Login Modal
  cy.get(".header-staff-btn").should("be.visible").click();

  // Enter credentials
  cy.get("#staffNumberInput").should("be.visible").clear().type(staffNumber);
  cy.get("#staffPasswordInput").should("be.visible").clear().type(password, { log: false });

  // Submit form
  cy.get('button.modern-submit-btn, button[type="submit"]').click();

  // Verify dashboard navigation and receptionist profile
  cy.url({ timeout: 15000 }).should("include", "/frontofficedashboard");
  cy.get(".profile-name", { timeout: 15000 }).should("contain.text", "Aditi Sharma");
  cy.get(".profile-role").should("contain.text", "Receptionist");
});
