import { loginPage } from "../../pages/LoginPage";
import { adminDashboardPage } from "../../pages/AdminDashboardPage";
import users from "../../fixtures/users.json";

/**
 * Test Suite: Authentication & Security
 * Scenario ID: HMS-AUTH-024
 * Scenario Name: Session Persistence Across Hard Refresh vs Clean Termination on Logout
 *
 * Description:
 * Verify that refreshing the page retains the authenticated session seamlessly,
 * and explicit Logout completely terminates the session and blocks private routes.
 */
describe("HMS-AUTH-024: Session Persistence Across Hard Refresh vs Clean Termination", () => {
  beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
    loginPage.visit("home");
    loginPage.waitForLoader();
  });

  it("persists authenticated session on page reload and terminates completely on logout", () => {
    // 1. Log in as Hospital Administrator
    loginPage.openStaffLoginModal();
    loginPage.elements.staffNumberInput().clear().type(users.admin.staffNumber);
    loginPage.elements.staffPasswordInput().clear().type(users.admin.password, { log: false });
    loginPage.elements.loginSubmitBtn().click();

    // 2. Verify Admin Dashboard loaded
    adminDashboardPage.verifyDashboardLoaded();

    // 3. Reload page (F5)
    cy.reload();
    loginPage.waitForLoader();

    // 4. Verify user remains logged in on Admin Dashboard
    cy.url({ timeout: 15000 }).should("include", "/admin/admindashboard");
    adminDashboardPage.verifyAdminProfile("John Doe");

    // 5. Perform explicit Logout
    adminDashboardPage.logout();

    // 6. Verify subsequent attempt to visit Admin Dashboard redirects away
    cy.visit("/admin/admindashboard", { failOnStatusCode: false });
    loginPage.waitForLoader();
    cy.url({ timeout: 10000 }).should("not.include", "/admin/admindashboard");
  });
});
