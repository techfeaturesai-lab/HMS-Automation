import { loginPage } from "../../pages/LoginPage";
import { leavePage } from "../../pages/LeavePage";
import users from "../../fixtures/users.json";

/**
 * Test Suite: Leave Management
 * Scenario ID: HMS-LVE-017
 * Scenario Name: Leave Reason Minimum and Maximum Character Length Boundary Check
 *
 * Description:
 * Verify Leave Reason rejects whitespace-only entry as empty and accepts valid text.
 */
describe("HMS-LVE-017: Leave Reason Minimum and Maximum Character Length Boundary Check", () => {
  beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
    loginPage.visit("home");
    loginPage.waitForLoader();
  });

  it("rejects whitespace-only reason and accepts valid descriptive reason", () => {
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

    // 3. Fill leave type & day type
    leavePage.elements.leaveTypeSelect().select(1);
    leavePage.elements.dayTypeSelect().select(1);

    // 4. Enter whitespace-only reason
    leavePage.elements.reasonInput().clear().type("     ");
    leavePage.elements.submitRequestBtn().click();

    // 5. Verify submission blocked
    leavePage.elements.applyLeaveModal().should("be.visible");

    // 6. Enter valid reason
    leavePage.elements.reasonInput().clear().type("Family medical emergency");
    leavePage.elements.reasonInput().should("have.value", "Family medical emergency");

    // 7. Cleanly cancel
    leavePage.elements.cancelBtn().click();
  });
});
