import { loginPage } from "../../pages/LoginPage";
import users from "../../fixtures/users.json";

/**
 * Test Suite: Authentication & Security
 * Scenario ID: HMS-AUTH-008
 * Scenario Name: Authorization Security - Client Local Storage Tampering Blocked by Server
 *
 * Test Steps:
 * 1. Open HMS website.
 * 2. Click "Sign In" / "Staff Login".
 * 3. Enter Doctor credentials (HMS-02).
 * 4. Enter Doctor password.
 * 5. Click "Sign In".
 * 6. Wait for Doctor OPD Queue / Dashboard screen to load (/doctor/doctordashboard).
 * 7. Open Local Storage.
 * 8. Modify "roleId", "userId", and "role" to match an Administrator account.
 * 9. Refresh browser page (F5 / cy.reload()).
 * 10. Inspect visible navigation menu.
 * 11. Attempt Admin-only action (direct URL navigation to /admin/admindashboard).
 * 12. Verify Administrator menus remain inaccessible and server RBAC rejects privilege escalation.
 */
describe("HMS-AUTH-008: Authorization Security - Client Local Storage Tampering Blocked", () => {
  beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
    loginPage.visit("home");
    loginPage.waitForLoader();
  });

  it("blocks doctor account from accessing admin dashboard even after local storage tampering", () => {
    cy.intercept("POST", "**/api/auth/login").as("doctorLogin");

    // 1. Steps 1-5: Log in as Doctor (HMS-02)
    loginPage.openStaffLoginModal();
    loginPage.elements.staffNumberInput().clear().type(users.doctor.staffNumber);
    loginPage.elements.staffPasswordInput().clear().type(users.doctor.password, { log: false });
    loginPage.elements.loginSubmitBtn().click();

    // 2. Step 6: Wait for Doctor Dashboard
    cy.wait("@doctorLogin").its("response.statusCode").should("eq", 200);
    cy.url({ timeout: 15000 }).should("include", "/doctor/doctordashboard");
    loginPage.waitForLoader();

    // 3. Steps 7-8: Modify roleId, userId, and role in Local Storage to impersonate Admin
    cy.window().then((win) => {
      win.localStorage.setItem("roleId", "6");
      win.localStorage.setItem("userId", "1");
      win.localStorage.setItem("role", "Admin");
      win.localStorage.setItem("roleDisplay", "Admin");
    });

    // 4. Step 9: Refresh browser page (F5)
    cy.reload();
    loginPage.waitForLoader();

    // 5. Step 10: Inspect visible navigation menu - Admin-only management menus must not exist
    cy.contains("Department Management").should("not.exist");
    cy.contains("Staff Management").should("not.exist");

    // 6. Step 11-12: Attempt Admin-only route navigation
    cy.visit("/admin/admindashboard", { failOnStatusCode: false });
    loginPage.waitForLoader();

    // Verify server/client route guard redirects away from Admin Dashboard
    cy.url({ timeout: 10000 }).should("not.include", "/admin/admindashboard");
  });
});
