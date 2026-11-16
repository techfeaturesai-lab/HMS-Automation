import { loginPage } from "../../pages/LoginPage";
import users from "../../fixtures/users.json";

/**
 * Test Suite: Authentication & Security
 * Scenario ID: HMS-AUTH-009
 * Scenario Name: Authorization Security - Modified or Cross-User Access Token Rejected
 *
 * Pre-conditions:
 * - HMS website is accessible.
 * - Doctor user is authenticated in HMS Portal.
 *
 * Test Steps:
 * 1. Click "Sign In" on the top navigation bar.
 * 2. Select "Staff Login".
 * 3. Enter Doctor credentials ("HMS-02") in the identifier field.
 * 4. Enter the account password in the "Password" field.
 * 5. Click the "Sign In" button.
 * 6. Wait for the Doctor OPD Queue / Dashboard screen to load (/doctor/doctordashboard).
 * 7. Retrieve the legitimate JWT Access Token from browser localStorage.
 * 8. Replace or tamper with the "Access Token" signature in localStorage.
 * 9. Verify that direct API requests with the tampered token return HTTP 401 Unauthorized with no protected hospital data.
 * 10. Reload the application with the tampered token in localStorage and verify the browser's internal API requests receive HTTP 401 Unauthorized.
 */
describe("HMS-AUTH-009: Authorization Security - Modified or Cross-User Access Token Rejected", () => {
  beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
    loginPage.visit("home");
    loginPage.waitForLoader();
  });

  it("authenticates Doctor, alters the token in localStorage, and verifies server rejects tampered token with HTTP 401", () => {
    cy.intercept("POST", "**/api/auth/login").as("doctorLogin");

    // 1. Steps 1-5: Log in as Doctor (HMS-02)
    loginPage.openStaffLoginModal();
    loginPage.elements.staffNumberInput().clear().type(users.doctor.staffNumber);
    loginPage.elements.staffPasswordInput().clear().type(users.doctor.password);
    loginPage.elements.loginSubmitBtn().click();

    // 2. Step 6: Wait for Doctor Dashboard screen to load
    cy.wait("@doctorLogin").its("response.statusCode").should("eq", 200);
    cy.url({ timeout: 15000 }).should("include", "/doctor/doctordashboard");
    loginPage.waitForLoader();

    // 3. Step 7-8: Retrieve original token from localStorage and alter/tamper it
    cy.window().then((win) => {
      const originalToken = win.localStorage.getItem("accessToken");
      expect(originalToken, "Original JWT token exists in localStorage").to.be.a("string").and.not.be.empty;

      // Tamper with the token signature (corrupting cryptographic integrity)
      const tamperedToken = originalToken.slice(0, -15) + "TAMPERED_SIG_99";
      win.localStorage.setItem("accessToken", tamperedToken);

      // Verify localStorage reflects the tampered token
      expect(win.localStorage.getItem("accessToken")).to.eq(tamperedToken);

      // 4. Step 9: Send request to protected endpoint using the tampered token from localStorage
      cy.request({
        method: "GET",
        url: "https://devhmsapi.techfeatures.ai/api/auth/permissions/my-permissions",
        headers: {
          Authorization: `Bearer ${tamperedToken}`,
        },
        failOnStatusCode: false,
      }).then((response) => {
        // Assert server validates JWT signature and returns 401 Unauthorized
        expect(response.status).to.eq(401);
        expect(response.body).to.not.have.property("data");
      });

      // Send request to another protected endpoint (notifications) with tampered token
      cy.request({
        method: "GET",
        url: "https://devhmsapi.techfeatures.ai/api/staff-notifications/today",
        headers: {
          Authorization: `Bearer ${tamperedToken}`,
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(401);
        expect(response.body).to.not.have.property("data");
      });
    });

    // 5. Step 10: Reload the application with the tampered token in localStorage
    // The Angular browser client will make requests with the modified token from localStorage
    cy.intercept("GET", "**/api/auth/permissions/my-permissions").as("tamperedAppRequest");
    cy.reload();

    // Verify the server rejects the application's tampered token request with HTTP 401
    cy.wait("@tamperedAppRequest").its("response.statusCode").should("eq", 401);
    loginPage.waitForLoader();
  });
});
