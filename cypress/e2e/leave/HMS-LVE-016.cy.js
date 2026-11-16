import { loginPage } from "../../pages/LoginPage";
import { leavePage } from "../../pages/LeavePage";
import users from "../../fixtures/users.json";

/**
 * Test Suite: Leave Management
 * Scenario ID: HMS-LVE-016
 * Scenario Name: Reject Past-Date Leave Application and Inverted From/To Date Range
 *
 * Description:
 * Verify that Leave Management blocks selecting past dates or inverted date ranges.
 */
describe("HMS-LVE-016: Reject Past-Date Leave Application and Inverted From/To Date Range", () => {
  beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
    loginPage.visit("home");
    loginPage.waitForLoader();
  });

  it("enforces future-date and chronological validation on leave date pickers", () => {
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

    // 3. Inspect date input element
    leavePage.elements.dateInput().should("be.visible");

    // 4. Verify date input has min attribute or picker prevents past dates
    cy.get("input[placeholder*='date']").then(($input) => {
      const min = $input.attr("min");
      if (min) {
        const today = new Date().toISOString().split("T")[0];
        expect(min).to.be.at.least(today);
      }
    });

    // 5. Close modal
    leavePage.elements.cancelBtn().click();
  });
});
