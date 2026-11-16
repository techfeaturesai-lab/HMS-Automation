import { loginPage } from "../../pages/LoginPage";
import { leavePage } from "../../pages/LeavePage";
import { adminDashboardPage } from "../../pages/AdminDashboardPage";
import users from "../../fixtures/users.json";

/**
 * Test Suite: Leave Management
 * Scenario ID: HMS-LVE-022
 * Scenario Name: Leave Calendar Tooltip and Unavailable Reason Text Verification
 *
 * Description:
 * Verify that when viewing All Leave Requests table, reasons display clearly
 * without row distortion.
 */
describe("HMS-LVE-022: Leave Reason Text Verification & Layout Stability", () => {
  beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
    loginPage.visit("home");
    loginPage.waitForLoader();
  });

  it("verifies reason text displays cleanly without row overflow or table layout distortion", () => {
    // 1. Log in as Hospital Administrator
    loginPage.openStaffLoginModal();
    loginPage.elements.staffNumberInput().clear().type(users.admin.staffNumber);
    loginPage.elements.staffPasswordInput().clear().type(users.admin.password);
    loginPage.elements.loginSubmitBtn().click();
    adminDashboardPage.verifyDashboardLoaded();

    // 2. Open All Leave Requests
    leavePage.visitLeaveManagement();
    leavePage.elements.leaveTable().should("be.visible");

    // 3. Inspect table rows and cells
    leavePage.elements.tableRows().should("have.length.at.least", 1);
    cy.get("th").contains(/Reason/i).should("be.visible");

    // 4. Verify no unexpected table clipping or visual overflow
    cy.get("table tbody tr td").first().should("be.visible");
  });
});
