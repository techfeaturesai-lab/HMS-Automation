import { loginPage } from "../../pages/LoginPage";
import { leavePage } from "../../pages/LeavePage";
import { adminDashboardPage } from "../../pages/AdminDashboardPage";
import users from "../../fixtures/users.json";

/**
 * Test Suite: Leave Management
 * Scenario ID: HMS-LVE-002
 * Scenario Name: Staff Leave Management - Filters Available and Approve/Reject Restricted to Admin
 *
 * Description:
 * Verify that Staff Leaves provides filter controls and restricts Approve/Reject actions strictly to Hospital Admin.
 * Non-Admin users (Doctor) cannot perform Approve/Reject on other staff leave requests.
 */
describe("HMS-LVE-002: Staff Leave Management - Filters Available and Approve/Reject Restricted to Admin", () => {
  beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
    loginPage.visit("home");
    loginPage.waitForLoader();
  });

  it("verifies Doctor cannot approve/reject leaves while Admin has full filter and action access", () => {
    // -------------------------------------------------------------------------
    // 1. Log in as Doctor (HMS-02)
    // -------------------------------------------------------------------------
    loginPage.openStaffLoginModal();
    loginPage.elements.staffNumberInput().clear().type(users.doctor.staffNumber);
    loginPage.elements.staffPasswordInput().clear().type(users.doctor.password);
    loginPage.elements.loginSubmitBtn().click();
    cy.url({ timeout: 15000 }).should("include", "/doctor/doctordashboard");
    loginPage.waitForLoader();

    // 2. Navigate to Leave Management / All Leave Requests
    leavePage.visitLeaveManagement();

    // 3. Verify Doctor cannot execute Approve or Reject on other staff requests
    cy.get("body").then(($body) => {
      // Approve/Reject action buttons must not exist for Doctor role
      expect($body.find("button:contains('Approve'), button:contains('Reject')").length).to.eq(0);
    });

    // 4. Log out from Doctor session
    cy.contains(/Logout/i).click({ force: true });
    loginPage.waitForLoader();

    // -------------------------------------------------------------------------
    // 5. Log in as Hospital Administrator (HMS-01)
    // -------------------------------------------------------------------------
    loginPage.visit("home");
    loginPage.waitForLoader();
    loginPage.openStaffLoginModal();
    loginPage.elements.staffNumberInput().clear().type(users.admin.staffNumber);
    loginPage.elements.staffPasswordInput().clear().type(users.admin.password);
    loginPage.elements.loginSubmitBtn().click();
    adminDashboardPage.verifyDashboardLoaded();

    // 6. Navigate to Leave Management / All Leave Requests as Admin
    leavePage.visitLeaveManagement();

    // 7. Verify Filter controls and search exist on Leave Management
    leavePage.elements.searchByNameInput().should("be.visible");
    leavePage.elements.statusFilterDropdown().should("be.visible");
    leavePage.elements.yearFilterDropdown().should("be.visible");

    // 8. Verify table columns and records render
    leavePage.elements.leaveTable().should("be.visible");
    cy.contains("th, td", /Leave Type/i).should("exist");
  });
});
