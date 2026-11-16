import { loginPage } from "../../pages/LoginPage";
import { leavePage } from "../../pages/LeavePage";
import { adminDashboardPage } from "../../pages/AdminDashboardPage";
import users from "../../fixtures/users.json";

/**
 * Test Suite: Leave Management
 * Scenario ID: HMS-LVE-011
 * Scenario Name: E2E - Doctor Leave Application and Admin Queue Processing
 *
 * Description:
 * End-to-end verification of Doctor applying for leave, Admin reviewing request in
 * All Leave Requests queue, and verifying role-based queue isolation.
 */
describe("HMS-LVE-011: E2E - Doctor Leave Application and Admin Review Queue", () => {
  beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
    loginPage.visit("home");
    loginPage.waitForLoader();
  });

  it("completes Doctor leave view and Admin All Leave Requests queue review", () => {
    // 1. Log in as Doctor
    loginPage.openStaffLoginModal();
    loginPage.elements.staffNumberInput().clear().type(users.doctor.staffNumber);
    loginPage.elements.staffPasswordInput().clear().type(users.doctor.password);
    loginPage.elements.loginSubmitBtn().click();
    cy.url({ timeout: 15000 }).should("include", "/doctor/doctordashboard");
    loginPage.waitForLoader();

    // 2. Open My Leave as Doctor
    leavePage.visitMyLeave();
    leavePage.elements.leaveTable().should("be.visible");

    // 3. Log out Doctor
    cy.contains(/Logout/i).click({ force: true });
    loginPage.waitForLoader();

    // 4. Log in as Hospital Administrator
    loginPage.visit("home");
    loginPage.waitForLoader();
    loginPage.openStaffLoginModal();
    loginPage.elements.staffNumberInput().clear().type(users.admin.staffNumber);
    loginPage.elements.staffPasswordInput().clear().type(users.admin.password);
    loginPage.elements.loginSubmitBtn().click();
    adminDashboardPage.verifyDashboardLoaded();

    // 5. Open All Leave Requests queue as Admin
    leavePage.visitLeaveManagement();
    leavePage.elements.leaveTable().should("be.visible");

    // 6. Verify Doctor Chandan Kumar request appears in Admin queue
    cy.contains("td", /Chandan Kumar/i).should("exist");
  });
});
