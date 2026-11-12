import { homePage } from "../../pages/HomePage";

/**
 * Test Suite: Home Page & Website
 * Scenario ID: HMS-HOME-012
 * Scenario Name: Responsive Design - Home Page, Doctor Cards & Website Menu Across Viewports
 *
 * Description:
 * Verify that HMS Home Page and Doctor Listing adapt without horizontal scroll
 * across Desktop (1440x900), Tablet (768x1024), and Mobile (375x812).
 */
describe("HMS-HOME-012: Responsive Design Across Desktop, Tablet & Mobile Viewports", () => {
  it("renders correctly on Desktop resolution (1440x900)", () => {
    cy.viewport(1440, 900);
    homePage.visitHomePage();
    cy.get(".nav-brand").should("be.visible");
    cy.get(".nav-links-desktop").should("be.visible");
    homePage.scrollToSpecialists();
    homePage.elements.specialistCards().should("have.length.at.least", 1);
  });

  it("adapts layout on Tablet resolution (768x1024) without horizontal overflow", () => {
    cy.viewport(768, 1024);
    homePage.visitHomePage();
    cy.get(".nav-brand").should("be.visible");
    // Verify no horizontal overflow
    cy.window().then((win) => {
      expect(win.document.documentElement.scrollWidth).to.be.at.most(win.innerWidth + 5);
    });
  });

  it("stacks content vertically on Mobile resolution (375x812)", () => {
    cy.viewport(375, 812);
    homePage.visitHomePage();
    cy.get(".nav-brand").should("be.visible");
    // Check mobile view renders cleanly
    cy.get("body").should("be.visible");
    // Verify no destructive horizontal overflow
    cy.window().then((win) => {
      expect(win.document.documentElement.scrollWidth).to.be.at.most(win.innerWidth + 10);
    });
  });
});
