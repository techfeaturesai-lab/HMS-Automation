import { loginPage } from "../../pages/LoginPage";

/**
 * Test Suite: Authentication & Security
 * Scenario ID: HMS-AUTH-023
 * Scenario Name: Password Show/Hide Toggle and Masking Security on Staff Login
 *
 * Description:
 * Verify that the password field defaults to type="password" (masked) and the
 * visibility toggle button toggles between masked and plaintext.
 */
describe("HMS-AUTH-023: Password Show/Hide Toggle and Masking Security on Staff Login", () => {
  beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
    loginPage.visit("home");
    loginPage.waitForLoader();
  });

  it("masks password input by default and toggles plaintext on eye button click", () => {
    // 1. Open the Staff Login Modal
    loginPage.openStaffLoginModal();

    // 2. Type test password
    const testSecret = "Secret@2026";
    loginPage.elements.staffPasswordInput().clear().type(testSecret);

    // 3. Verify input type defaults to "password"
    loginPage.elements.staffPasswordInput().should("have.attr", "type", "password");

    // 4. Locate toggle button inside the password container
    loginPage.elements.staffPasswordInput().parent().find("button, svg, i, .toggle-btn").first().then(($toggle) => {
      if ($toggle.length) {
        cy.wrap($toggle).click();
        // 5. Verify input type changes to "text"
        loginPage.elements.staffPasswordInput().should("have.attr", "type", "text");

        // 6. Click again to re-mask
        cy.wrap($toggle).click();
        loginPage.elements.staffPasswordInput().should("have.attr", "type", "password");
      }
    });
  });
});
