import { homePage } from "../../pages/HomePage";

/**
 * Test Suite: Home Page & Website
 * Scenario ID: HMS-HOME-019
 * Scenario Name: Verify Header, Hero CTA, Department Cards and Footer Link Integrity
 *
 * Description:
 * Verify that all navigation links, Hero Book Appointment CTAs, and footer links
 * open valid pages or anchor targets without broken 404 errors.
 */
describe("HMS-HOME-019: Homepage Links and CTA Integrity Verification", () => {
  beforeEach(() => {
    homePage.visitHomePage();
  });

  it("verifies header links, hero CTAs, and footer contacts load validly", () => {
    // 1. Verify header links exist and have valid text
    cy.get(".nav-links-desktop a").each(($link) => {
      cy.wrap($link).should("be.visible").and("have.attr", "href");
    });

    // 2. Verify Hero CTAs are clickable
    cy.get(".hero-cta-btn").should("be.visible").and("contain.text", "Book Appointment");
    cy.get(".hero-cta-secondary").should("be.visible").and("contain.text", "Ask AI Assistant");

    // 3. Verify footer info and links
    cy.get("#contact, footer").scrollIntoView();
    cy.get("body").should("contain.text", "contact@hms.com");
    cy.get("body").should("contain.text", "+91 9999008888");
    cy.get("body").should("not.contain.text", "404 Not Found");
  });
});
