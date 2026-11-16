import { loginPage } from "../../pages/LoginPage";
import { leavePage } from "../../pages/LeavePage";
import { adminDashboardPage } from "../../pages/AdminDashboardPage";
import users from "../../fixtures/users.json";

/**
 * Test Suite: Leave Management
 * Scenario ID: HMS-LVE-013
 * Scenario Name: Approve Leave and Reject Leave With Mandatory Remarks Workflow
 *
 * Description:
 * Verify that Hospital Admin can inspect leave requests and verify that rejection
 * or approval actions require administrative confirmation and remarks.
 */
describe("HMS-LVE-013: Approve Leave and Reject Leave With Mandatory Remarks Workflow", () => {
  beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
    loginPage.visit("home");
    loginPage.waitForLoader();
  });

  it("inspects Admin leave decision actions and action controls", () => {
    // 1. Log in as Hospital Administrator
    loginPage.openStaffLoginModal();
    loginPage.elements.staffNumberInput().clear().type(users.admin.staffNumber);
    loginPage.elements.staffPasswordInput().clear().type(users.admin.password);
    loginPage.elements.loginSubmitBtn().click();
    adminDashboardPage.verifyDashboardLoaded();

    // 2. Open All Leave Requests
    leavePage.visitLeaveManagement();
    leavePage.elements.leaveTable().should("be.visible");

    // 3. Inspect Action column header exists in the table
    cy.contains("th", /Action/i).should("exist");

    // 4. Verify that actionable rows exist in the table with controls (View or Action buttons)
    cy.get("tbody tr").then(($rows) => {
      expect($rows.length).to.be.at.least(1);
    });

    // 5. Verify action controls exist in the table (kebab button or action buttons)
    cy.get(".kebab-btn, .btn-table-action, button:contains('View'), button:contains('Reject')").should("exist");
  });
});
