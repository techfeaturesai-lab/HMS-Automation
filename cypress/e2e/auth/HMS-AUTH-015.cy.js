import { loginPage } from "../../pages/LoginPage";
import { adminDashboardPage } from "../../pages/AdminDashboardPage";
import users from "../../fixtures/users.json";

/**
 * Test Suite: Authentication & Security
 * Scenario ID: HMS-AUTH-015
 * Scenario Name: Session Lifecycle - Browser Back Button Blocked Post-Logout
 *
 * Description:
 * Verify that clicking the browser Back button after an explicit Logout
 * blocks re-entry to cached administrative pages and keeps the user logged out.
 */
describe("HMS-AUTH-015: Session Lifecycle - Browser Back Button Blocked Post-Logout", () => {
  beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
    loginPage.visit("home");
    loginPage.waitForLoader();
  });

  it("prevents browser Back button from accessing authenticated Admin Dashboard post-logout", () => {
    // 1. Log in as Hospital Administrator
    loginPage.openStaffLoginModal();
    loginPage.elements.staffNumberInput().clear().type(users.admin.staffNumber);
    loginPage.elements.staffPasswordInput().clear().type(users.admin.password, { log: false });
    loginPage.elements.loginSubmitBtn().click();

    // 2. Wait for Admin Dashboard
    adminDashboardPage.verifyDashboardLoaded();

    // 3. Perform logout
    adminDashboardPage.logout();

    // 4. Trigger browser Back navigation
    cy.go("back");
    loginPage.waitForLoader();

    // 5. Verify user is NOT permitted back into the active Admin Dashboard
    cy.url({ timeout: 10000 }).should("not.include", "/admin/admindashboard");
  });
});
