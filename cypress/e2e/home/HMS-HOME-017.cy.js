import { homePage } from "../../pages/HomePage";

/**
 * Test Suite: Home Page & Website
 * Scenario ID: HMS-HOME-017
 * Scenario Name: Verify Public Visitor Cannot Access Protected Staff/Admin Modules
 *
 * Description:
 * Verify that unauthenticated website visitors only see public links,
 * and direct URL access to protected routes (/admin) redirects away from administrative views.
 */
describe("HMS-HOME-017: Route Protection for Unauthenticated Public Visitors", () => {
  it("displays only public links on navigation and blocks direct access to /admin", () => {
    // 1 & 2. Visit public home page
    homePage.visitHomePage();

    // 3 & 4. Verify administrative menu items are absent from public navbar
    const protectedTerms = ["Admin Dashboard", "Manage Staff", "Staff Management", "Leave Approvals", "IPD Ward"];
    protectedTerms.forEach((term) => {
      cy.get(".nav-links-desktop").should("not.contain.text", term);
    });

    // 5 & 6. Attempt direct unauthenticated navigation to /admin
    cy.visit("/admin/admindashboard", { failOnStatusCode: false });
    homePage.waitForLoader();

    // Verify redirected away from /admin (lands on /home or /login)
    cy.url().should("not.include", "admin/admindashboard");
    cy.url().should("satisfy", (url) => url.includes("/home") || url.includes("/login"));
  });
});
