import { homePage } from "../../pages/HomePage";

/**
 * Test Suite: Home Page & Website
 * Scenario ID: HMS-HOME-011
 * Scenario Name: Home Page Top Navigation and Footer Link Routing
 *
 * Description:
 * Verify that every top header navigation item on the HMS Home Page
 * opens its destination route without 404 or blank pages.
 */
describe("HMS-HOME-011: Home Page Top Navigation and Footer Link Routing", () => {
  beforeEach(() => {
    // 1 & 2. Open the HMS website and load home
    homePage.visitHomePage();
  });

  it("navigates cleanly through top navigation links without 404 or dead links", () => {
    // 3 & 4. Click "About" in top navigation bar
    cy.get(".nav-links-desktop a").contains("About").click();
    homePage.waitForLoader();
    cy.url().should("include", "/about-us");
    cy.get("body").should("not.contain.text", "404").and("contain.text", "About");

    // 5 & 6. Click "Contact" in top navigation bar
    homePage.visitHomePage();
    cy.get(".nav-links-desktop a").contains("Contact").click();
    cy.url().should("satisfy", (url) => url.includes("contact") || url.includes("home"));
    cy.get("body").should("contain.text", "+91 9999008888");

    // 7 & 8. Click Doctor Listing ("See All Specialists" or header specialist route)
    homePage.visitHomePage();
    homePage.scrollToSpecialists();
    homePage.clickSeeAllSpecialists();
    homePage.waitForLoader();
    cy.url().should("include", "/home/doctor-list");
    cy.contains("Find Doctors by Department").should("be.visible");
    cy.get("body").should("not.contain.text", "404");
  });
});
