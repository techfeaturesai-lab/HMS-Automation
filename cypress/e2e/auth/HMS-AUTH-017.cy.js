import { loginPage } from "../../pages/LoginPage";
import users from "../../fixtures/users.json";

/**
 * Test Suite: Authentication & Security
 * Scenario ID: HMS-AUTH-017
 * Scenario Name: Wrong-Role Direct URL Access Prevention for Receptionist Role
 *
 * Description:
 * Verify that a logged-in Front Office Receptionist cannot escalate privileges
 * by directly navigating to Doctor or Administrator dashboards.
 */
describe("HMS-AUTH-017: Wrong-Role Direct URL Access Prevention for Receptionist", () => {
  beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
    loginPage.visit("home");
    loginPage.waitForLoader();
  });

  it("blocks Receptionist from opening Doctor and Admin dashboards", () => {
    // 1. Log in as Front Office Receptionist (HMS-04)
    loginPage.openStaffLoginModal();
    loginPage.elements.staffNumberInput().clear().type(users.receptionist.staffNumber);
    loginPage.elements.staffPasswordInput().clear().type(users.receptionist.password, { log: false });
    loginPage.elements.loginSubmitBtn().click();

    // 2. Wait for Receptionist Dashboard
    cy.url({ timeout: 15000 }).should("include", "/frontoffice/frontofficedashboard");
    loginPage.waitForLoader();

    // 3. Attempt direct access to Doctor Dashboard
    cy.visit("/doctor/doctordashboard", { failOnStatusCode: false });
    loginPage.waitForLoader();
    cy.url({ timeout: 10000 }).should("not.include", "/doctor/doctordashboard");

    // 4. Attempt direct access to Admin Dashboard
    cy.visit("/admin/admindashboard", { failOnStatusCode: false });
    loginPage.waitForLoader();
    cy.url({ timeout: 10000 }).should("not.include", "/admin/admindashboard");
  });
});
