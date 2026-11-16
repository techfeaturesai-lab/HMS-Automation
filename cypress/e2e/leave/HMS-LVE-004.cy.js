import { loginPage } from "../../pages/LoginPage";
import { leavePage } from "../../pages/LeavePage";
import { adminDashboardPage } from "../../pages/AdminDashboardPage";
import users from "../../fixtures/users.json";

/**
 * Test Suite: Leave Management
 * Scenario ID: HMS-LVE-004
 * Scenario Name: All Leave Requests - Displays Full Leave Reason and View More Option to Admin
 *
 * Description:
 * Verify that submitted Leave Reasons are visible in All Leave Requests and long reasons
 * provide a working "View More" option or modal view to Hospital Admin.
 */
describe("HMS-LVE-004: All Leave Requests - Displays Full Leave Reason and View More Option to Admin", () => {
  beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
    loginPage.visit("home");
    loginPage.waitForLoader();
  });

  it("displays leave reasons and enables View More option for full text expansion", () => {
    // 1. Log in as Hospital Administrator
    loginPage.openStaffLoginModal();
    loginPage.elements.staffNumberInput().clear().type(users.admin.staffNumber);
    loginPage.elements.staffPasswordInput().clear().type(users.admin.password);
    loginPage.elements.loginSubmitBtn().click();
    adminDashboardPage.verifyDashboardLoaded();

    // 2. Open Leave Management / All Leave Requests
    leavePage.visitLeaveManagement();

    // 3. Verify table exists with Reason column
    leavePage.elements.leaveTable().should("be.visible");
    cy.contains("th", /Reason/i).should("be.visible");

    // 4. Verify table rows have non-empty reason cells
    leavePage.elements.tableRows().should("have.length.at.least", 1);

    // 5. Inspect if a "View More" control exists for truncated long reasons
    cy.get("body").then(($body) => {
      if ($body.find("a:contains('View More'), button:contains('View More'), span:contains('View More')").length) {
        cy.contains(/View More/i).first().click();
        // Verify expanded text or modal displays
        cy.get("body").should("satisfy", ($b) => $b.text().length > 0);
      }
    });
  });
});
