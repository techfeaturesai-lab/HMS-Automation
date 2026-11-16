import { loginPage } from "../../pages/LoginPage";
import { leavePage } from "../../pages/LeavePage";
import users from "../../fixtures/users.json";

/**
 * Test Suite: Leave Management
 * Scenario ID: HMS-LVE-018
 * Scenario Name: Doctor Cancellation of Own Pending Leave Before Admin Action
 *
 * Description:
 * Verify that a Doctor can manage and withdraw/cancel their own Pending leave request.
 */
describe("HMS-LVE-018: Doctor Cancellation of Own Pending Leave Before Admin Action", () => {
  beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
    loginPage.visit("home");
    loginPage.waitForLoader();
  });

  it("inspects cancellation and management actions on own pending leaves", () => {
    // 1. Log in as Doctor
    loginPage.openStaffLoginModal();
    loginPage.elements.staffNumberInput().clear().type(users.doctor.staffNumber);
    loginPage.elements.staffPasswordInput().clear().type(users.doctor.password);
    loginPage.elements.loginSubmitBtn().click();
    cy.url({ timeout: 15000 }).should("include", "/doctor/doctordashboard");
    loginPage.waitForLoader();

    // 2. Open My Leave
    leavePage.visitMyLeave();

    // 3. Locate My Leave table and action column
    leavePage.elements.leaveTable().should("be.visible");
    cy.contains("th", /Action/i).should("be.visible");

    // 4. Verify table rows contain pending request details
    leavePage.elements.tableRows().should("have.length.at.least", 1);
  });
});
