import { loginPage } from "../../pages/LoginPage";
import users from "../../fixtures/users.json";

/**
 * Test Suite: Authentication & Security
 * Scenario ID: HMS-AUTH-014
 * Scenario Name: Role-Based Access Control - Admin Routes Protection
 *
 * Test Steps:
 * 1. Open the HMS website.
 * 2. Request the Admin Dashboard route directly in the browser address bar (/admin/admindashboard).
 * 3. Wait for redirect away from Admin routes.
 * 4. Verify that unauthenticated requests redirect immediately to Home/Login without displaying admin data.
 * 5. Log in to HMS as Front Office Receptionist (HMS-04).
 * 6. Wait for Front Office Dashboard to load.
 * 7. Request the Admin Dashboard route directly in the browser address bar (/admin/admindashboard).
 * 8. Verify that Front Office Receptionist access to Admin routes is strictly blocked by route guards.
 */
describe("HMS-AUTH-014: Role-Based Access Control - Admin Routes Protection", () => {
  beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
    loginPage.visit("home");
    loginPage.waitForLoader();
  });

  it("redirects unauthenticated visitor away from Admin routes", () => {
    // 1. As unauthenticated guest, directly request Admin Dashboard route
    cy.visit("/admin/admindashboard", { failOnStatusCode: false });
    loginPage.waitForLoader();

    // 2. Verify redirect away from Admin routes to Home/Login
    cy.url({ timeout: 10000 }).should("not.include", "/admin/admindashboard");
    cy.contains(/Admin Dashboard/i).should("not.exist");
  });

  it("blocks Receptionist account from accessing Admin routes", () => {
    cy.intercept("POST", "**/api/auth/login").as("staffLogin");

    // 1. Log in as Front Office Receptionist (HMS-04)
    loginPage.openStaffLoginModal();
    loginPage.elements.staffNumberInput().should("be.visible").clear().type(users.receptionist.staffNumber);
    loginPage.elements.staffPasswordInput().should("be.visible").clear().type(users.receptionist.password);
    loginPage.elements.loginSubmitBtn().click();

    // 2. Wait for successful login API and Receptionist Dashboard
    cy.wait("@staffLogin").its("response.statusCode").should("eq", 200);
    cy.url({ timeout: 15000 }).should("include", "/frontoffice/frontofficedashboard");
    loginPage.waitForLoader();

    // 3. Attempt direct URL navigation to Admin Dashboard
    cy.visit("/admin/admindashboard", { failOnStatusCode: false });
    loginPage.waitForLoader();

    // 4. Verify access is blocked and user is redirected away from Admin Dashboard
    cy.url({ timeout: 10000 }).should("not.include", "/admin/admindashboard");
    cy.contains(/Admin Dashboard/i).should("not.exist");
  });
});
