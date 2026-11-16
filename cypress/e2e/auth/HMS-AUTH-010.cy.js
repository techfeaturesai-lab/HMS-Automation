import { loginPage } from "../../pages/LoginPage";
import users from "../../fixtures/users.json";

/**
 * Test Suite: Authentication & Security
 * Scenario ID: HMS-AUTH-010
 * Scenario Name: Role Tampering & Direct URL Session Guard (Nurse Role)
 *
 * Test Steps:
 * 1. Open the HMS website.
 * 2. Click "Sign In" / "Staff Login".
 * 3. Enter Nurse credentials (HMS-03).
 * 4. Enter the account password.
 * 5. Click "Sign In".
 * 6. Wait for the Nurse Station Console screen to load (/nurse/nursedashboard).
 * 7. Open Local Storage and alter the stored role value to "Admin".
 * 8. Press F5 (reload) to refresh.
 * 9. Navigate directly to Admin routes (/admin/admindashboard, /admin/department-management).
 * 10. Verify that client-side storage tampering is ignored by server RBAC validation.
 * 11. Click "Logout" in the profile menu.
 * 12. Wait for Login / Home screen to load.
 * 13. Press the Browser "Back" button once.
 * 14. Verify that pressing Back after Logout denies viewing cached Nurse station data.
 */
describe("HMS-AUTH-010: Role Tampering & Direct URL Session Guard (Nurse Role)", () => {
  beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
    loginPage.visit("home");
    loginPage.waitForLoader();
  });

  it("denies Nurse access to Admin routes after tampering and prevents session restore via Back button", () => {
    cy.intercept("POST", "**/api/auth/login").as("nurseLogin");

    // 1. Steps 1-5: Log in as Nurse (HMS-03)
    loginPage.openStaffLoginModal();
    loginPage.elements.staffNumberInput().clear().type(users.nurse.staffNumber);
    loginPage.elements.staffPasswordInput().clear().type(users.nurse.password, { log: false });
    loginPage.elements.loginSubmitBtn().click();

    // 2. Step 6: Wait for Nurse Dashboard
    cy.wait("@nurseLogin").its("response.statusCode").should("eq", 200);
    cy.url({ timeout: 15000 }).should("include", "/nurse/nursedashboard");
    loginPage.waitForLoader();

    // 3. Step 7: Open Local Storage and alter stored role value to "Admin"
    cy.window().then((win) => {
      win.localStorage.setItem("role", "Admin");
      win.localStorage.setItem("roleDisplay", "Admin");
      win.localStorage.setItem("roleId", "6");
    });

    // 4. Step 8: Press F5 to refresh
    cy.reload();
    loginPage.waitForLoader();

    // 5. Steps 9-10: Navigate directly to Admin routes and verify access is blocked
    cy.visit("/admin/admindashboard", { failOnStatusCode: false });
    loginPage.waitForLoader();
    cy.url({ timeout: 10000 }).should("not.include", "/admin/admindashboard");

    // 6. Step 11-12: Click "Logout"
    cy.get("body").then(($body) => {
      if ($body.find("a.logout-link").length) {
        cy.get("a.logout-link").click({ force: true });
      } else {
        cy.contains(/Logout/i).click({ force: true });
      }
    });
    loginPage.waitForLoader();
    cy.url().should("not.include", "/nurse/nursedashboard");

    // 7. Steps 13-14: Press Browser "Back" button once
    cy.go("back");
    loginPage.waitForLoader();

    // Verify user is held on sign-in / home and denied viewing authenticated Nurse data
    cy.url().should("not.include", "/nurse/nursedashboard");
  });
});
