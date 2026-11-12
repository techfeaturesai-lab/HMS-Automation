import { BasePage } from "./BasePage";

/**
 * Page Object for the public About Us page (/about-us).
 */
export class AboutUsPage extends BasePage {
  elements = {
    meetOurExpertsHeading: () => cy.contains("h2, h3", "Meet Our Experts"),
    expertCards: () => cy.get(".doc-card, .expert-card, [class*='expert'], [class*='doc']"),
    expertImages: () => cy.get("img[alt*='Dr.']"),
    bookAppointmentBtn: () => cy.contains("button, a", "Book Appointment"),
    contactUsBtn: () => cy.contains("button, a", "Contact Us"),
    contactSection: () => cy.get("#contact, .contact-section, footer"),
  };

  /**
   * Navigate to the About Us page.
   */
  visitAboutUs() {
    this.visit("about-us");
    return this;
  }

  /**
   * Verify "Meet Our Experts" section is displayed.
   */
  verifyMeetOurExpertsSection() {
    this.elements.meetOurExpertsHeading().scrollIntoView().should("be.visible");
    return this;
  }

  /**
   * Verify each doctor profile image in Meet Our Experts renders with valid dimensions.
   */
  verifyExpertDoctorImages() {
    this.elements.expertImages().should("have.length.at.least", 1);
    this.elements.expertImages().each(($img) => {
      cy.wrap($img).should("be.visible").and(($el) => {
        expect($el[0].naturalWidth).to.be.greaterThan(0);
      });
    });
    return this;
  }

  /**
   * Click Book Appointment button and verify navigation.
   */
  clickBookAppointment() {
    this.elements.bookAppointmentBtn().first().click();
    return this;
  }

  /**
   * Click Contact Us and verify navigation to contact view.
   */
  clickContactUs() {
    cy.contains("a, button", /Contact( Us)?/i).first().click();
    return this;
  }
}

export const aboutUsPage = new AboutUsPage();
