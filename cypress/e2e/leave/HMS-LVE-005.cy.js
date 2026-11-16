import { loginPage } from "../../pages/LoginPage";
import { leavePage } from "../../pages/LeavePage";
import { adminDashboardPage } from "../../pages/AdminDashboardPage";
import users from "../../fixtures/users.json";

/**
 * Test Suite: Leave Management
 * Scenario ID: HMS-LVE-005
 * Scenario Name: All Leave Requests - Status Filter Returns Matching Records Only
 *
 * Description:
 * Verify that selecting Pending, Approved, or Rejected in the Status filter
 * filters All Leave Requests accurately.
 */
describe("HMS-LVE-005: All Leave Requests - Status Filter Returns Matching Records Only", () => {
  beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
    loginPage.visit("home");
    loginPage.waitForLoader();
  });

  it("filters leave requests accurately based on selected status", () => {
    // 1. Log in as Hospital Administrator
    loginPage.openStaffLoginModal();
    loginPage.elements.staffNumberInput().clear().type(users.admin.staffNumber);
    loginPage.elements.staffPasswordInput().clear().type(users.admin.password);
    loginPage.elements.loginSubmitBtn().click();
    adminDashboardPage.verifyDashboardLoaded();

    // 2. Open All Leave Requests
    leavePage.visitLeaveManagement();
    leavePage.waitForLoader();

    // 3. Wait for the status dropdown options to populate asynchronously
    leavePage.elements.statusFilterSelect().find("option").should("have.length.greaterThan", 2);

    // 4. Intercept the history reload on filter change and select Approved
    cy.intercept("GET", "**/LeaveRequests/**").as("getHistory");
    leavePage.elements.statusFilterSelect().select("Approved");
    cy.wait("@getHistory");
    leavePage.waitForLoader();

    // 5. Verify displayed rows exclusively reflect Approved status
    leavePage.elements.tableRows().each(($row) => {
      cy.wrap($row).should("contain.text", "Approved");
    });
  });
});
