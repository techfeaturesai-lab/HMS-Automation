import { loginPage } from "../../pages/LoginPage";
import { adminDashboardPage } from "../../pages/AdminDashboardPage";
import users from "../../fixtures/users.json";

/**
 * Test Suite: Authentication & Security
 * Scenario ID: HMS-AUTH-018
 * Scenario Name: Successful Staff Login With Valid Credentials and Role Dashboard Redirect
 *
 * Description:
 * Verify that the Hospital Administrator (HMS-01) can successfully log in
 * via the Staff Login modal and land on the Admin Dashboard (/admin/admindashboard)
 * with administrative privileges, profile identification, and module navigation.
 */
describe("HMS-AUTH-018: Successful Staff Login With Valid Credentials and Role Dashboard Redirect", () => {
  beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
    loginPage.visit("home");
    loginPage.waitForLoader();
  });

  it("authenticates Hospital Admin (HMS-01) and loads Admin Dashboard with full administrative access", () => {
    // 1. Open the Staff Login modal
    loginPage.openStaffLoginModal();

    // 2. Enter Admin credentials and submit
    loginPage.elements.staffNumberInput().clear().type(users.admin.staffNumber);
    loginPage.elements.staffPasswordInput().clear().type(users.admin.password, { log: false });
    loginPage.elements.loginSubmitBtn().click();

    // 3. Verify successful redirection to the Admin Dashboard
    adminDashboardPage.verifyDashboardLoaded();

    // 4. Verify Administrator profile identity in the header
    adminDashboardPage.verifyAdminProfile("John Doe");

    // 5. Verify Administrator sidebar navigation modules are accessible
    adminDashboardPage.verifyAdminModulesVisible();

    // 6. Clean session logout
    adminDashboardPage.logout();
  });
});
