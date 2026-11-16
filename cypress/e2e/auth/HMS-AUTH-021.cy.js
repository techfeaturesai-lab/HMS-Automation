import { loginPage } from "../../pages/LoginPage";
import users from "../../fixtures/users.json";

/**
 * Test Suite: Authentication & Security
 * Scenario ID: HMS-AUTH-021
 * Scenario Name: Reject Inactive / Deactivated Staff Credentials on Login Screen
 *
 * Pre-conditions:
 * - HMS website is accessible.
 * - Staff account "HMS-10022" (Geeta Kumari - Receptionist) is marked Inactive.
 *
 * Test Steps:
 * 1. Open the HMS website.
 * 2. Open "Staff Login" modal.
 * 3. Enter deactivated staff identifier ("HMS-10022") and password ("Admin@123").
 * 4. Click "Login" button.
 * 5. Verify that authentication blocks sign-in with HTTP 401 / message "User inactive."
 * 6. Verify that no session token is saved in localStorage.
 * 7. Verify user remains unauthenticated on login screen without dashboard redirect.
 */
describe("HMS-AUTH-021: Reject Inactive / Deactivated Staff Credentials on Login Screen", () => {
  beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
    loginPage.visit("home");
    loginPage.waitForLoader();
  });

  it("blocks login for deactivated staff account, returns User inactive notice, and creates no session credentials", () => {
    // 1. Intercept login API call
    cy.intercept("POST", "**/api/auth/login").as("deactivatedLogin");

    // 2. Open Staff Login modal
    loginPage.openStaffLoginModal();

    // 3. Enter deactivated staff credentials
    loginPage.elements.staffNumberInput().clear().type(users.deactivatedStaff.staffNumber);
    loginPage.elements.staffPasswordInput().clear().type(users.deactivatedStaff.password);

    // 4. Click Log In button
    loginPage.elements.loginSubmitBtn().click();

    // 5. Verify API response returns 401 with "User inactive." and data is null
    cy.wait("@deactivatedLogin").then((interception) => {
      expect([401, 403]).to.include(interception.response.statusCode);
      expect(interception.response.body.success).to.eq(false);
      expect(interception.response.body.message).to.match(/User inactive|inactive|deactivated/i);
      expect(interception.response.body.data).to.be.null;
    });

    // 6. Verify on-screen UI feedback / error notice displays
    cy.get("body").should("satisfy", ($body) => {
      const text = $body.text().toLowerCase();
      return (
        text.includes("inactive") ||
        text.includes("user inactive") ||
        text.includes("deactivated") ||
        text.includes("error") ||
        text.includes("invalid")
      );
    });

    // 7. Verify zero session token created in Application Storage
    cy.window().then((win) => {
      expect(win.localStorage.getItem("accessToken")).to.be.null;
      expect(win.localStorage.getItem("role")).to.be.null;
    });

    // 8. Verify user remains on login modal and is NOT redirected to any protected dashboard
    cy.url().should("not.include", "/frontoffice/frontofficedashboard");
    cy.url().should("not.include", "/admin/admindashboard");
    cy.get("#staffNumberInput").should("be.visible");
  });
});
