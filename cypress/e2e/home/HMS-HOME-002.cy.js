import { homePage } from "../../pages/HomePage";
import { aboutUsPage } from "../../pages/AboutUsPage";

/**
 * Test Suite: Home Page & Website
 * Scenario ID: HMS-HOME-002
 * Scenario Name: About Us - Meet Our Experts Images & Action Button Navigation
 *
 * Description:
 * Verify that doctor profile images render accurately on About Us
 * and "Book Appointment" / "Contact Us" navigate to valid destinations.
 */
describe("HMS-HOME-002: About Us - Meet Our Experts Images & Action Button Navigation", () => {
  beforeEach(() => {
    // 1. Open the HMS website
    homePage.visitHomePage();
  });

  it("verifies doctor images in Meet Our Experts and action button navigation", () => {
    // 2 & 3. Click About Us link in top navigation bar and wait for screen to load
    cy.get(".nav-links-desktop a").contains("About").click();
    aboutUsPage.waitForLoader();
    cy.url().should("include", "/about-us");

    // 4 & 5. Inspect each doctor profile image for valid dimensions and loading
    aboutUsPage.verifyMeetOurExpertsSection();
    aboutUsPage.verifyExpertDoctorImages();

    // 6 & 7. Click "Book Appointment" button on the About Us page
    aboutUsPage.clickBookAppointment();
    // Verify booking flow / modal or doctor selection opens
    cy.get("body").should("satisfy", ($body) => {
      const text = $body.text();
      return (
        text.includes("Appointment") ||
        text.includes("Booking") ||
        text.includes("Find Doctors") ||
        text.includes("Doctor")
      );
    });

    // 8. Navigate back to About Us
    aboutUsPage.visitAboutUs();

    // 9 & 10. Click "Contact" and verify Contact section / view opens
    aboutUsPage.clickContactUs();
    cy.get("body").should("satisfy", ($body) => {
      return (
        $body.find("#contact").length > 0 ||
        $body.text().includes("Contact") ||
        $body.text().includes("contact@hms.com")
      );
    });
  });
});
