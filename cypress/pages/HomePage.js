import { BasePage } from "./BasePage";

/**
 * Page Object for the public HMS Home Page.
 */
export class HomePage extends BasePage {
  // Selectors
  elements = {
    // Branding & Navigation
    brandTitle: () => cy.get(".nav-brand label"),
    navLinks: () => cy.get(".nav-links-desktop a"),
    headerBookBtn: () => cy.get(".header-btn-book"),
    headerMyBookingBtn: () => cy.get(".header-btn-booking"),
    headerStaffLoginBtn: () => cy.get(".header-staff-btn"),

    // Specialists Section
    specialistsSection: () => cy.get("#specialists, .anaverse-specialists-section"),
    specialistsBadge: () => cy.get(".spec-badge-pill"),
    specialistsTitle: () => cy.get(".spec-title"),
    specialistsDescription: () => cy.get(".spec-desc"),
    seeAllSpecialistsBtn: () => cy.get("#specialists .spec-cta-btn, .anaverse-specialists-section .spec-cta-btn").first(),
    specialistCards: () => cy.get(".spec-doc-card"),
    docName: ($card) => $card.find(".doc-name"),
    docSpecialty: ($card) => $card.find(".doc-specialty"),
    docPhoto: ($card) => $card.find(".doc-photo-img"),
    docRating: ($card) => $card.find(".rating-num"),
  };

  /**
   * Navigate to the home page.
   */
  visitHomePage() {
    this.visit("");
    return this;
  }

  /**
   * Scroll smoothly to the Trusted Specialists section.
   */
  scrollToSpecialists() {
    this.elements.specialistsSection().scrollIntoView({ duration: 500 });
    this.elements.specialistsSection().should("be.visible");
    return this;
  }

  /**
   * Verify that the Trusted Specialists section header is loaded.
   */
  verifySpecialistsSectionHeader() {
    this.elements.specialistsTitle().should("contain.text", "Trusted Specialists");
    this.elements.specialistsBadge().should("contain.text", "Our Specialists");
    return this;
  }

  /**
   * Verify that specialist cards are loaded with non-empty dynamic data (name, specialty, image).
   */
  verifySpecialistCardsLoaded(minCount = 1) {
    this.elements.specialistCards().should("have.length.at.least", minCount);
    this.elements.specialistCards().each(($card) => {
      // Doctor Name should not be empty
      cy.wrap($card).find(".doc-name").invoke("text").should("not.be.empty");
      // Department/Specialty should not be empty
      cy.wrap($card).find(".doc-specialty").invoke("text").should("not.be.empty");
      // Doctor photo should exist and have a valid src
      cy.wrap($card).find(".doc-photo-img").should("have.attr", "src").and("not.be.empty");
    });
    return this;
  }

  /**
   * Click on the 'See All Specialists' / 'See More' button.
   */
  clickSeeAllSpecialists() {
    this.elements.seeAllSpecialistsBtn().should("be.visible").click();
    return this;
  }
}

export const homePage = new HomePage();
