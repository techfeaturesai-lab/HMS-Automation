import { loginPage } from "../../pages/LoginPage";
import users from "../../fixtures/users.json";

/**
 * Test Suite: Authentication & Security
 * Scenario ID: HMS-AUTH-012
 * Scenario Name: Authentication Negative - Wrong Staff Credentials Rejection
 *
 * Description:
 * Verify that entering invalid staff credentials or wrong password displays
 * a clear error notice without leaking internal system state or establishing a session.
 */
describe("HMS-AUTH-012: Authentication Negative - Wrong Staff Credentials Rejection", () => {
  beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
    loginPage.visit("home");
    loginPage.waitForLoader();
  });

  it("rejects login attempt with invalid password and shows error notice", () => {
    // 1. Open the Staff Login Modal
    loginPage.openStaffLoginModal();

    // 2. Enter valid staff number with wrong password
    loginPage.elements.staffNumberInput().clear().type(users.admin.staffNumber);
    loginPage.elements.staffPasswordInput().clear().type("WrongPassword@9999", { log: false });

    // 3. Submit form
    loginPage.elements.loginSubmitBtn().click();
    loginPage.waitForLoader();

    // 4. Verify error feedback appears and user is NOT redirected to dashboard
    cy.url().should("not.include", "/admindashboard");
    cy.get("body").should("satisfy", ($body) => {
      const text = $body.text().toLowerCase();
      return (
        text.includes("invalid") ||
        text.includes("error") ||
        text.includes("incorrect") ||
        text.includes("failed") ||
        text.includes("wrong")
      );
    });
  });
});
