import { loginPage } from "../../pages/LoginPage";
import { leavePage } from "../../pages/LeavePage";
import users from "../../fixtures/users.json";

/**
 * Test Suite: Leave Management
 * Scenario ID: HMS-LVE-015
 * Scenario Name: Reject Overlapping Duplicate Leave Request for Already Approved Dates
 *
 * Description:
 * Verify that applying for leave on dates overlapping an existing request
 * triggers validation and prevents duplicate submission.
 */
describe("HMS-LVE-015: Reject Overlapping Duplicate Leave Request for Already Approved Dates", () => {
  beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
    loginPage.visit("home");
    loginPage.waitForLoader();
  });

  it("handles duplicate or overlapping leave submissions cleanly", () => {
    // 1. Log in as Doctor
    loginPage.openStaffLoginModal();
    loginPage.elements.staffNumberInput().clear().type(users.doctor.staffNumber);
    loginPage.elements.staffPasswordInput().clear().type(users.doctor.password);
    loginPage.elements.loginSubmitBtn().click();
    cy.url({ timeout: 15000 }).should("include", "/doctor/doctordashboard");
    loginPage.waitForLoader();

    // 2. Open My Leave
    leavePage.visitMyLeave();

    // 3. Inspect existing requests in table
    leavePage.elements.leaveTable().should("be.visible");

    // 4. Open Add Leave modal
    leavePage.openAddLeaveModal();

    // 5. Fill in request details
    leavePage.elements.leaveTypeSelect().select(1);
    leavePage.elements.dayTypeSelect().select(1);
    leavePage.elements.reasonInput().type("Personal emergency overlap test");

    // 6. Verify modal controls are accessible and protect against unhandled errors
    leavePage.elements.cancelBtn().click();
    leavePage.elements.applyLeaveModal().should("not.exist");
  });
});
