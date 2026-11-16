import { loginPage } from "../../pages/LoginPage";
import { adminDashboardPage } from "../../pages/AdminDashboardPage";
import users from "../../fixtures/users.json";

/**
 * Test Suite: Authentication & Security
 * Scenario ID: HMS-AUTH-011
 * Scenario Name: Staff login - forgot password, profile info, session expiry
 *
 * Description:
 * Verify Staff Login Forgot Password link response, top-bar logged-in user profile
 * accuracy across sequential logins, and redirect on session expiration.
 *
 * Test Steps:
 * 1. Open the HMS website.
 * 2. Click "Sign In" / "Staff Login".
 * 3. Select "Staff Login".
 * 4. Click the "Forgot Password?" link on the Staff Login card.
 * 5. Wait for the "Reset Password" screen to load.
 * 6. Verify that the Forgot Password link triggers a visible reset form.
 * 7. Return to "Staff Login".
 * 8. Enter the Front Office Receptionist credentials (HMS-04).
 * 9. Enter the account password.
 * 10. Click "Sign In".
 * 11. Inspect the user name and role badge shown in the top-right header ("Aditi Sharma", "Receptionist").
 * 12. Click the "Logout" button.
 * 13. Enter the Hospital Administrator credentials (HMS-01).
 * 14. Enter the account password.
 * 15. Click "Sign In".
 * 16. Verify that the header profile updates immediately to Hospital Admin ("John Doe") without stale Receptionist info.
 * 17. Clear/expire the active authentication token in Application Storage.
 * 18. Attempt navigation to protected Admin routes (e.g. /admin/admindashboard).
 * 19. Verify that expired session tokens block access and redirect away from private routes.
 */
describe("HMS-AUTH-011: Staff login - forgot password, profile info, session expiry", () => {
  beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
    loginPage.visit("home");
    loginPage.waitForLoader();
  });

  it("executes forgot password flow, verifies profile sync across role switch, and asserts session expiry route guard", () => {
    // -------------------------------------------------------------------------
    // Phase 1: Forgot Password Link Interaction & Reset Screen (Steps 1–7)
    // -------------------------------------------------------------------------
    loginPage.openStaffLoginModal();

    // Click "Forgot Your Password?" link
    cy.contains(/Forgot.*Password/i).should("be.visible").click();

    // Verify Reset Password modal and its controls load
    cy.contains("Reset Password", { timeout: 10000 }).should("be.visible");
    cy.contains(/Enter your Staff Number and registered email/i).should("be.visible");
    cy.contains("button", "Send Reset Link").should("be.visible");

    // Return to Staff Login by closing the reset dialog
    cy.get("button.modal-close-btn, button.close_btn").filter(":visible").first().click();
    cy.contains("Reset Password").should("not.exist");

    // -------------------------------------------------------------------------
    // Phase 2: First Role Login - Front Office Receptionist (Steps 8–12)
    // -------------------------------------------------------------------------
    cy.intercept("POST", "**/api/auth/login").as("receptionistLogin");
    loginPage.openStaffLoginModal();
    loginPage.elements.staffNumberInput().clear().type(users.receptionist.staffNumber);
    loginPage.elements.staffPasswordInput().clear().type(users.receptionist.password);
    loginPage.elements.loginSubmitBtn().click();

    // Wait for Receptionist login & Front Office Dashboard
    cy.wait("@receptionistLogin").its("response.statusCode").should("eq", 200);
    cy.url({ timeout: 15000 }).should("include", "/frontoffice/frontofficedashboard");
    loginPage.waitForLoader();

    // Verify Receptionist user name in header and role badge in profile
    cy.contains(".user-name, span, p, div", "Aditi Sharma", { timeout: 15000 }).should("be.visible");
    cy.contains(/Receptionist/i, { timeout: 15000 }).should("exist");

    // Log out from Front Office Dashboard
    cy.get("body").then(($body) => {
      if ($body.find("a.logout-link").length) {
        cy.get("a.logout-link").click({ force: true });
      } else {
        cy.contains(/Logout/i).click({ force: true });
      }
    });
    loginPage.waitForLoader();
    cy.url({ timeout: 15000 }).should("not.include", "/frontoffice/frontofficedashboard");

    // -------------------------------------------------------------------------
    // Phase 3: Sequential Role Login - Hospital Administrator (Steps 13–16)
    // -------------------------------------------------------------------------
    cy.intercept("POST", "**/api/auth/login").as("adminLogin");
    loginPage.visit("home");
    loginPage.waitForLoader();

    loginPage.openStaffLoginModal();
    loginPage.elements.staffNumberInput().clear().type(users.admin.staffNumber);
    loginPage.elements.staffPasswordInput().clear().type(users.admin.password);
    loginPage.elements.loginSubmitBtn().click();

    // Wait for Admin login & Admin Dashboard
    cy.wait("@adminLogin").its("response.statusCode").should("eq", 200);
    adminDashboardPage.verifyDashboardLoaded();

    // Verify header updates immediately to Hospital Admin (John Doe)
    adminDashboardPage.verifyAdminProfile("John Doe");

    // Verify previous Receptionist profile info is not cached
    cy.contains("Aditi Sharma").should("not.exist");

    // -------------------------------------------------------------------------
    // Phase 4: Session Expiry Token Clearance & Route Guard (Steps 17–19)
    // -------------------------------------------------------------------------
    // Expire active authentication token from application storage
    cy.clearLocalStorage();
    cy.clearCookies();

    // Attempt access to private Admin Dashboard route with expired token
    cy.visit("/admin/admindashboard", { failOnStatusCode: false });
    loginPage.waitForLoader();

    // Verify access is blocked and user is redirected away from private admin route
    cy.url({ timeout: 10000 }).should("not.include", "/admin/admindashboard");
  });
});
