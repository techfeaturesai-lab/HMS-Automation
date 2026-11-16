import { BasePage } from "./BasePage";

/**
 * Page Object for the Hospital Administrator Dashboard (/admin/admindashboard).
 */
export class AdminDashboardPage extends BasePage {
  elements = {
    dashboardTitle: () => cy.contains(/Admin Dashboard/i),
    frontofficeModule: () => cy.contains(/Frontoffice Dashboard/i),
    patientManagementModule: () => cy.contains(/Patient Management/i),
    appointmentsModule: () => cy.contains(/Appointments/i),
    logoutBtn: () => cy.get("a.logout-link, button:contains('Logout')"),
  };

  /**
   * Verify that the user has landed on the Admin Dashboard URL and loaders are resolved.
   */
  verifyDashboardLoaded() {
    cy.url({ timeout: 15000 }).should("include", "/admin/admindashboard");
    this.waitForLoader();
    this.elements.dashboardTitle().should("be.visible");
    return this;
  }

  /**
   * Verify that the logged-in administrator's profile credentials appear in the header.
   */
  verifyAdminProfile(expectedName = "John Doe") {
    cy.contains(expectedName, { timeout: 15000 }).should("exist");
    return this;
  }

  /**
   * Verify core admin navigation menu items are visible.
   */
  verifyAdminModulesVisible() {
    this.elements.frontofficeModule().should("be.visible");
    this.elements.patientManagementModule().should("be.visible");
    this.elements.appointmentsModule().should("be.visible");
    return this;
  }

  /**
   * Perform logout from the Admin Dashboard.
   */
  logout() {
    cy.get("body").then(($body) => {
      if ($body.find("a.logout-link").length) {
        cy.get("a.logout-link").click({ force: true });
      } else {
        cy.contains(/Logout/i).click({ force: true });
      }
    });
    this.waitForLoader();
    cy.url({ timeout: 15000 }).should("not.include", "/admin/admindashboard");
    return this;
  }
}

export const adminDashboardPage = new AdminDashboardPage();
