import { loginPage } from "../../pages/LoginPage";

/**
 * Test Suite: Authentication & Security
 * Scenario ID: HMS-AUTH-020
 * Scenario Name: Reject Malformed Email Format and Empty Password on Staff Login
 *
 * Test Steps:
 * 1. Open the HMS website.
 * 2. Open "Staff Login" modal.
 * 3. Enter "invalidemail" in Email/Staff Number and leave Password blank.
 * 4. Click "Login" button.
 * 5. Verify that client validation prevents submitting the API request (no network dispatch).
 * 6. Verify user is held on the login modal without authenticating.
 */
describe("HMS-AUTH-020: Reject Empty Password and Invalid Credentials on Staff Login", () => {
  beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
    loginPage.visit("home");
    loginPage.waitForLoader();
  });

  it("validates required fields when staff number or password is empty without submitting API request", () => {
    // 1. Intercept any login API call to verify no submission occurs on invalid form
    cy.intercept("POST", "**/api/auth/login").as("loginAttempt");

    // 2. Open Staff Login modal
    loginPage.openStaffLoginModal();

    // 3. Step 3: Enter invalid text in staff number and leave password blank
    loginPage.elements.staffNumberInput().clear().type("invalidemail");
    loginPage.elements.staffPasswordInput().clear();

    // 4. Step 4: Click Login button
    loginPage.elements.loginSubmitBtn().click();

    // 5. Step 5-6: Verify no API request is submitted to backend
    cy.get("@loginAttempt.all").should("have.length", 0);

    // Verify user remains on login modal and is not redirected to any protected dashboard
    cy.url().should("not.include", "/admindashboard");
    cy.url().should("not.include", "/frontofficedashboard");
    cy.get("#staffPasswordInput").should("be.visible");
  });
});
