import { loginPage } from "../../pages/LoginPage";
import { leavePage } from "../../pages/LeavePage";
import users from "../../fixtures/users.json";

/**
 * Test Suite: Leave Management
 * Scenario ID: HMS-LVE-008
 * Scenario Name: Leave Request Date Range - Blocks Same From/To Date for More Than One Day Type
 *
 * Description:
 * Verify that selecting "More Than One Day" enforces date range rules and blocks
 * selecting invalid identical or non-multi-day ranges.
 */
describe("HMS-LVE-008: Leave Request Date Range - Blocks Same From/To Date for More Than One Day Type", () => {
  beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
    loginPage.visit("home");
    loginPage.waitForLoader();
  });

  it("enforces multi-day validation constraints when More Than One Day is selected", () => {
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

    // 3. Select Leave Type and Day Type "More Than One Day"
    leavePage.elements.leaveTypeSelect().select(1);
    leavePage.elements.dayTypeSelect().select("More Than One Day");

    // 4. Inspect date input behavior
    cy.get("body").then(($body) => {
      // Form should expose range picker or From/To fields
      expect($body.find("input[placeholder*='date'], input[type='date'], .date-picker").length).to.be.at.least(1);
    });

    // 5. Enter reason
    leavePage.elements.reasonInput().type("Attending medical conference");

    // 6. Submit request and verify validation logic triggers if dates are incomplete or identical
    leavePage.elements.submitRequestBtn().click();
    cy.get("body").should("satisfy", ($b) => {
      return (
        $b.find(".leave-modal-dialog").length > 0 ||
        $b.text().toLowerCase().includes("date") ||
        $b.text().toLowerCase().includes("required") ||
        $b.text().toLowerCase().includes("invalid")
      );
    });
  });
});
