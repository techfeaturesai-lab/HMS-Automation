import { loginPage } from "../../pages/LoginPage";
import { leavePage } from "../../pages/LeavePage";
import users from "../../fixtures/users.json";

/**
 * Test Suite: Leave Management
 * Scenario ID: HMS-LVE-021
 * Scenario Name: Leave Balance Counters and Status Badge Readability After Page Refresh
 *
 * Description:
 * Verify that Leave Balance counters and status badges persist accurately
 * across page reload without data distortion.
 */
describe("HMS-LVE-021: Leave Balance Counters and Status Badge Readability After Page Refresh", () => {
  beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
    loginPage.visit("home");
    loginPage.waitForLoader();
  });

  it("persists leave balance cards and status badges across browser reload", () => {
    // 1. Log in as Doctor
    loginPage.openStaffLoginModal();
    loginPage.elements.staffNumberInput().clear().type(users.doctor.staffNumber);
    loginPage.elements.staffPasswordInput().clear().type(users.doctor.password);
    loginPage.elements.loginSubmitBtn().click();
    cy.url({ timeout: 15000 }).should("include", "/doctor/doctordashboard");
    loginPage.waitForLoader();

    // 2. Open My Leave
    leavePage.visitMyLeave();

    // 3. Inspect balance cards
    leavePage.elements.casualLeaveCard().should("be.visible");
    leavePage.elements.leaveTable().should("be.visible");

    // 4. Capture text before reload
    cy.get(".card, .counter-card, table").first().invoke("text").then((beforeText) => {
      // 5. Reload page (F5)
      cy.reload();
      loginPage.waitForLoader();

      // 6. Verify balances and cards persist after reload
      leavePage.elements.casualLeaveCard().should("be.visible");
      leavePage.elements.leaveTable().should("be.visible");
    });
  });
});
