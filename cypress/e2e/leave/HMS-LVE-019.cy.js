import { loginPage } from "../../pages/LoginPage";
import { leavePage } from "../../pages/LeavePage";
import users from "../../fixtures/users.json";

/**
 * Test Suite: Leave Management
 * Scenario ID: HMS-LVE-019
 * Scenario Name: Block Doctor or Staff Self-Approval of Own Pending Leave Request
 *
 * Description:
 * Verify that a non-Admin Doctor cannot approve their own leave request via UI
 * or direct backend API endpoint.
 */
describe("HMS-LVE-019: Block Doctor or Staff Self-Approval of Own Pending Leave Request", () => {
  beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
    loginPage.visit("home");
    loginPage.waitForLoader();
  });

  it("prevents Doctor from self-approving leave via UI and rejects direct approval API calls", () => {
    // 1. Log in as Doctor
    loginPage.openStaffLoginModal();
    loginPage.elements.staffNumberInput().clear().type(users.doctor.staffNumber);
    loginPage.elements.staffPasswordInput().clear().type(users.doctor.password);
    loginPage.elements.loginSubmitBtn().click();
    cy.url({ timeout: 15000 }).should("include", "/doctor/doctordashboard");
    loginPage.waitForLoader();

    // 2. Open My Leave
    leavePage.visitMyLeave();

    // 3. Verify Approve and Reject buttons do NOT exist on Doctor UI
    cy.get("body").then(($body) => {
      expect($body.find("button:contains('Approve')").length).to.eq(0);
      expect($body.find("button:contains('Reject')").length).to.eq(0);
    });

    // 4. Attempt direct API call to approve leave using Doctor's token
    cy.window().then((win) => {
      const doctorToken = win.localStorage.getItem("accessToken");
      cy.request({
        method: "PUT",
        url: "https://devhmsapi.techfeatures.ai/api/LeaveRequests/9/approve",
        headers: {
          Authorization: `Bearer ${doctorToken}`,
        },
        failOnStatusCode: false,
      }).then((response) => {
        // Assert backend strictly rejects non-admin approval request
        expect([401, 403, 404, 405]).to.include(response.status);
      });
    });
  });
});
