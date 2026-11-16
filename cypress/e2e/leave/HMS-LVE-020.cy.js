import { loginPage } from "../../pages/LoginPage";

/**
 * Test Suite: Leave Management
 * Scenario ID: HMS-LVE-020
 * Scenario Name: Block Patient Direct URL Access to Doctor/Admin Leave Management Endpoints
 *
 * Description:
 * Verify that unauthenticated visitors or patients cannot access Leave Management routes
 * or view staff leave records.
 */
describe("HMS-LVE-020: Block Patient Direct URL Access to Leave Management Endpoints", () => {
  beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
    loginPage.visit("home");
    loginPage.waitForLoader();
  });

  it("blocks direct URL access to Leave Management routes for unauthenticated users", () => {
    // 1. Attempt direct access to All Leave Requests
    cy.visit("/leave/leave-management", { failOnStatusCode: false });
    loginPage.waitForLoader();
    cy.url({ timeout: 10000 }).should("not.include", "/leave/leave-management");

    // 2. Attempt direct access to My Leave
    cy.visit("/leave/my-leave", { failOnStatusCode: false });
    loginPage.waitForLoader();
    cy.url({ timeout: 10000 }).should("not.include", "/leave/my-leave");

    // 3. Verify no staff leave records or table render
    cy.get("table").should("not.exist");
  });
});
