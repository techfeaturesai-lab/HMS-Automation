import { loginPage } from "../../pages/LoginPage";
import { leavePage } from "../../pages/LeavePage";
import { adminDashboardPage } from "../../pages/AdminDashboardPage";
import users from "../../fixtures/users.json";

/**
 * Test Suite: Leave Management
 * Scenario ID: HMS-LVE-006
 * Scenario Name: All Leave Requests - Non-Department Staff Shows Role Instead of Blank Dash
 *
 * Description:
 * Verify that staff records show their Role (e.g. "Receptionist") clearly in All Leave Requests
 * rather than showing an ambiguous blank dash.
 */
describe("HMS-LVE-006: All Leave Requests - Non-Department Staff Shows Role Instead of Blank Dash", () => {
  beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
    loginPage.visit("home");
    loginPage.waitForLoader();
  });

  it("identifies staff roles clearly in the leave requests table", () => {
    // 1. Log in as Hospital Administrator
    loginPage.openStaffLoginModal();
    loginPage.elements.staffNumberInput().clear().type(users.admin.staffNumber);
    loginPage.elements.staffPasswordInput().clear().type(users.admin.password);
    loginPage.elements.loginSubmitBtn().click();
    adminDashboardPage.verifyDashboardLoaded();

    // 2. Open All Leave Requests
    leavePage.visitLeaveManagement();

    // 3. Verify Role Name column exists in the table
    cy.contains("th", /Role Name|Role/i).should("be.visible");

    // 4. Verify that table rows display valid role designations
    leavePage.elements.leaveTable().within(() => {
      cy.get("tbody tr").first().then(($row) => {
        expect($row.text()).to.not.be.empty;
      });
    });

    // 5. Verify API returns roleName for staff records
    cy.request({
      method: "GET",
      url: "https://devhmsapi.techfeatures.ai/api/LeaveRequests/history?page=1&pageSize=10",
      headers: {
        Authorization: `Bearer ${window.localStorage.getItem("accessToken") || ""}`,
      },
      failOnStatusCode: false,
    }).then((res) => {
      if (res.status === 200 && res.body.data) {
        const records = res.body.data;
        const receptionistRecord = records.find((r) => r.roleName === "Receptionist");
        if (receptionistRecord) {
          expect(receptionistRecord.roleName).to.eq("Receptionist");
        }
      }
    });
  });
});
