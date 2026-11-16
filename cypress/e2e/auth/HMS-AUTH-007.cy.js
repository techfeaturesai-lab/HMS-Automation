import { loginPage } from "../../pages/LoginPage";

/**
 * Test Suite: Authentication & Security
 * Scenario ID: HMS-AUTH-007
 * Scenario Name: Staff Login - Forgot Password Link Interaction
 *
 * Test Steps:
 * 1. Open the Staff Login page/modal.
 * 2. Wait for the Login modal to load.
 * 3. Click the "Forgot Password?" link.
 * 4. Wait for the "Reset Password" screen/modal to load.
 * 5. Review the target fields and active options on Reset Password screen.
 * 6. Verify that clicking "Forgot Password?" opens a password reset modal with input fields and action buttons.
 */
describe("HMS-AUTH-007: Staff Login - Forgot Password Link Interaction", () => {
  beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
    loginPage.visit("home");
    loginPage.waitForLoader();
  });

  it("clicks Forgot Password and verifies interactive password reset form opens with required controls", () => {
    // 1. Step 1-2: Open the Staff Login Modal
    loginPage.openStaffLoginModal();

    // 2. Step 3: Locate and click "Forgot Your Password?" link
    cy.contains(/Forgot.*Password/i).should("be.visible").click();

    // 3. Step 4-6: Verify Reset Password modal and its controls load
    cy.contains("Reset Password", { timeout: 10000 }).should("be.visible");
    cy.contains(/Enter your Staff Number and registered email/i).should("be.visible");
    cy.get("input[placeholder*='HMS'], input[placeholder*='Staff']").should("be.visible");
    cy.get("input[type='email'], input[placeholder*='email']").should("be.visible");
    cy.contains("button", "Send Reset Link").should("be.visible");
  });
});
