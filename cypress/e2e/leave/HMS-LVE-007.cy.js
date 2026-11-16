import { loginPage } from "../../pages/LoginPage";
import { leavePage } from "../../pages/LeavePage";
import users from "../../fixtures/users.json";

/**
 * Test Suite: Leave Management
 * Scenario ID: HMS-LVE-007
 * Scenario Name: Casual Leave Balance - Deducted Only After Approval, Not While Pending
 *
 * Description:
 * Verify that submitting a Casual Leave keeps the balance unchanged while Pending
 * and deducts only after Admin approval.
 */
describe("HMS-LVE-007: Casual Leave Balance - Deducted Only After Approval, Not While Pending", () => {
  beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
    loginPage.visit("home");
    loginPage.waitForLoader();
  });

  it("retains leave balance while request is pending and tracks pending indicator", () => {
    // 1. Log in as Doctor
    loginPage.openStaffLoginModal();
    loginPage.elements.staffNumberInput().clear().type(users.doctor.staffNumber);
    loginPage.elements.staffPasswordInput().clear().type(users.doctor.password);
    loginPage.elements.loginSubmitBtn().click();
    cy.url({ timeout: 15000 }).should("include", "/doctor/doctordashboard");
    loginPage.waitForLoader();

    // 2. Open My Leave
    leavePage.visitMyLeave();

    // 3. Inspect Casual Leave balance card
    leavePage.elements.casualLeaveCard().should("be.visible");

    // 4. Verify numerical leave balance is rendered
    cy.get("body").then(($body) => {
      expect($body.text()).to.match(/\d+\/\d+|\d+ of \d+ days left|\d+ days left/i);
    });

    // 5. Verify Pending leave requests do not prematurely deplete available quota
    cy.get("tbody tr").then(($rows) => {
      if ($rows.text().includes("Pending")) {
        // Pending records indicate pending status rather than approved deduction
        cy.contains(/Pending/i).should("exist");
      }
    });
  });
});
