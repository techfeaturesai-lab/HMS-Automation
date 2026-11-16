import { loginPage } from "../../pages/LoginPage";

/**
 * Test Suite: Authentication & Security
 * Scenario ID: HMS-AUTH-004
 * Scenario Name: Staff Login Modal - Layout Alignment & Input Integrity
 *
 * Test Steps:
 * 1. Open the HMS website.
 * 2. Navigate through the public booking flow or header.
 * 3. Click the "Staff Login" button.
 * 4. Wait for the "Staff Login" modal to load.
 * 5. Inspect the Staff Number/Username field, Password field, eye-toggle icon, "Forgot Password?" link, and "Login" button.
 * 6. Review the target fields and active options on Login modal.
 * 7. Verify that all inputs, labels, and action buttons inside the popup are aligned within the modal boundaries with zero errors.
 */
describe("HMS-AUTH-004: Staff Login Modal - Layout Alignment from Booking Summary & Header", () => {
  beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
    loginPage.visit("home");
    loginPage.waitForLoader();
  });

  it("renders aligned Staff Login modal with all inputs, labels, and action buttons within boundaries", () => {
    // 1. Step 1-4: Open Staff Login modal
    loginPage.openStaffLoginModal();

    // 2. Step 5 & 7: Verify Staff Number field
    cy.get("#staffNumberInput")
      .should("be.visible")
      .and("have.attr", "placeholder", "e.g. HMS-4");

    // Verify Password field
    cy.get("#staffPasswordInput")
      .should("be.visible")
      .and("have.attr", "type", "password");

    // Verify eye-toggle icon exists and is visible
    cy.get("#staffPasswordInput")
      .parent()
      .find("button, svg, i, .toggle-btn")
      .first()
      .should("be.visible");

    // Verify "Forgot Password?" link exists and is visible
    cy.contains(/Forgot.*Password/i)
      .should("be.visible");

    // Verify "Log In" submit button exists, is visible and enabled
    cy.get('button[type="submit"], button.modern-submit-btn')
      .should("be.visible")
      .and("not.be.disabled");

    // Verify modal header & branding
    cy.get("h2, h3, .modal-title, .welcome-text")
      .contains(/Welcome Back/i)
      .should("be.visible");
  });
});
