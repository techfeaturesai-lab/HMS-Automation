import { homePage } from "../../pages/HomePage";

/**
 * Test Suite: Home Page & Website
 * Scenario ID: HMS-HOME-021
 * Scenario Name: Accessibility - Alt Text on Doctor Photos and Keyboard Focus
 *
 * Description:
 * Verify that public Home Page doctor photos include descriptive alt attributes
 * and primary action buttons maintain proper accessibility focus targets.
 */
describe("HMS-HOME-021: Homepage Accessibility Verification", () => {
  beforeEach(() => {
    homePage.visitHomePage();
  });

  it("verifies doctor photos carry alt text and action buttons are focusable", () => {
    // 1 & 2. Scroll to specialists section
    homePage.scrollToSpecialists();

    // 3. Verify each specialist doctor photo has an alt attribute
    homePage.elements.specialistCards().each(($card) => {
      cy.wrap($card).find(".doc-photo-img").should("have.attr", "alt").and("not.be.empty");
    });

    // 4. Verify primary CTA buttons are focusable
    cy.get(".header-btn-book").focus().should("be.focused");
    cy.get(".hero-cta-btn").focus().should("be.focused");
  });
});
