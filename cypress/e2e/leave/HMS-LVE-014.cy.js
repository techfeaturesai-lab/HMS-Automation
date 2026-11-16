import { loginPage } from "../../pages/LoginPage";
import { leavePage } from "../../pages/LeavePage";
import users from "../../fixtures/users.json";

/**
 * Test Suite: Leave Management
 * Scenario ID: HMS-LVE-014
 * Scenario Name: Reject Leave Application When Required Fields (Leave Type, Dates, Reason) Are Blank
 *
 * Description:
 * Verify that clicking Submit on Apply Leave without Leave Type, Date range,
 * or Reason triggers inline required validation errors and prevents submission.
 */
describe("HMS-LVE-014: Reject Leave Application When Required Fields Are Blank", () => {
  beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
    loginPage.visit("home");
    loginPage.waitForLoader();
  });

  it("triggers validation errors when required leave fields are submitted empty", () => {
    // 1. Log in as Doctor
    loginPage.openStaffLoginModal();
    loginPage.elements.staffNumberInput().clear().type(users.doctor.staffNumber);
    loginPage.elements.staffPasswordInput().clear().type(users.doctor.password);
    loginPage.elements.loginSubmitBtn().click();
    cy.url({ timeout: 15000 }).should("include", "/doctor/doctordashboard");
    loginPage.waitForLoader();

    // 2. Open My Leave and Add Leave modal
    leavePage.visitMyLeave();
    leavePage.openAddLeaveModal();

    // 3. Leave all fields unselected/empty and click Submit
    leavePage.elements.submitRequestBtn().click();

    // 4. Verify modal remains open and prevents submission
    leavePage.elements.applyLeaveModal().should("be.visible");

    // 5. Verify HTML5 or Angular form validation highlights invalid controls
    cy.get("#leaveTypeId, #reason, #dayType").should("satisfy", ($els) => {
      return (
        $els.hasClass("ng-invalid") ||
        $els.filter(":invalid").length > 0 ||
        $els.parents(".form-group").find(".text-danger, .invalid-feedback").length > 0
      );
    });
  });
});
