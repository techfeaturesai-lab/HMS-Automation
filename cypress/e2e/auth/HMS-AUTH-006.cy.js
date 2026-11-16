import { loginPage } from "../../pages/LoginPage";
import { adminDashboardPage } from "../../pages/AdminDashboardPage";
import users from "../../fixtures/users.json";

/**
 * Test Suite: Authentication & Security
 * Scenario ID: HMS-AUTH-006
 * Scenario Name: Role Switch Login - Immediate UI Profile Sync Without Manual Refresh
 *
 * Description:
 * Verify that logging out as Hospital Administrator and logging in as Front Office Receptionist
 * immediately synchronizes the header profile identity and role-specific dashboard without manual refresh.
 */
describe("HMS-AUTH-006: Role Switch Login - Immediate UI Profile Sync Without Manual Refresh", () => {
  beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
    loginPage.visit("home");
    loginPage.waitForLoader();
  });

  it("switches roles between Admin and Receptionist with instant UI profile update", () => {
    // 1. Log in as Hospital Administrator
    loginPage.openStaffLoginModal();
    loginPage.elements.staffNumberInput().clear().type(users.admin.staffNumber);
    loginPage.elements.staffPasswordInput().clear().type(users.admin.password, { log: false });
    loginPage.elements.loginSubmitBtn().click();

    // 2. Verify Admin Dashboard and profile
    adminDashboardPage.verifyDashboardLoaded();
    adminDashboardPage.verifyAdminProfile("John Doe");

    // 3. Log out from Admin Dashboard
    adminDashboardPage.logout();

    // 4. Log in as Front Office Receptionist (HMS-04)
    loginPage.visit("home");
    loginPage.openStaffLoginModal();
    loginPage.elements.staffNumberInput().clear().type(users.receptionist.staffNumber);
    loginPage.elements.staffPasswordInput().clear().type(users.receptionist.password, { log: false });
    loginPage.elements.loginSubmitBtn().click();

    // 5. Verify immediate redirection to Front Office Dashboard without manual refresh
    cy.url({ timeout: 15000 }).should("include", "/frontoffice/frontofficedashboard");
    loginPage.waitForLoader();

    // 6. Verify Receptionist profile card and role badge
    cy.contains(/Receptionist|Aditi Sharma/i, { timeout: 15000 }).should("be.visible");
    cy.get("body").should("not.contain.text", "404");
  });
});
