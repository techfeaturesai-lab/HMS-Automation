import { loginPage } from "../../pages/LoginPage";
import users from "../../fixtures/users.json";

/**
 * Test Suite: Authentication & Security
 * Scenario ID: HMS-AUTH-028
 * Scenario Name: Wrong-Role Direct URL Access Prevention for Nurse Role
 *
 * Test Steps:
 * 1. Open and log in to Nurse Station Console (HMS-03).
 * 2. Request Admin route directly in browser address bar (/admin/admindashboard).
 * 3. Verify that Nurse access to Admin routes is blocked by the route guard.
 * 4. Verify no administrative controls or patient records are exposed to Nurse.
 */
describe("HMS-AUTH-028: Wrong-Role Direct URL Access Prevention for Nurse Role", () => {
  beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
    loginPage.visit("home");
    loginPage.waitForLoader();
  });

  it("blocks Nurse from opening Admin Dashboard routes via direct URL navigation", () => {
    cy.intercept("POST", "**/api/auth/login").as("nurseLogin");

    // 1. Step 1: Log in as Nurse (HMS-03)
    loginPage.openStaffLoginModal();
    loginPage.elements.staffNumberInput().clear().type(users.nurse.staffNumber);
    loginPage.elements.staffPasswordInput().clear().type(users.nurse.password, { log: false });
    loginPage.elements.loginSubmitBtn().click();

    // Wait for Nurse Dashboard
    cy.wait("@nurseLogin").its("response.statusCode").should("eq", 200);
    cy.url({ timeout: 15000 }).should("include", "/nurse/nursedashboard");
    loginPage.waitForLoader();

    // 2. Steps 2-3: Directly request Admin Dashboard route
    cy.visit("/admin/admindashboard", { failOnStatusCode: false });
    loginPage.waitForLoader();

    // 3. Step 4: Verify access is blocked and redirected away from Admin Dashboard
    cy.url({ timeout: 10000 }).should("not.include", "/admin/admindashboard");
    cy.contains(/Admin Dashboard/i).should("not.exist");
  });
});
