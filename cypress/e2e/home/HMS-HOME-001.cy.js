import { homePage } from "../../pages/HomePage";
import { doctorDirectoryPage } from "../../pages/DoctorDirectoryPage";

/**
 * Test Suite: Home Page & Website
 * Scenario ID: HMS-HOME-001
 * Scenario Name: Home Page - Dynamic Specialist Cards & See More Navigation
 *
 * Description:
 * Verify that the Home Page specialist cards load live Admin-configured doctor data
 * and "See More" / "See All Specialists" opens the full doctor directory ("Find Doctors by Department").
 */
describe("HMS-HOME-001: Home Page - Dynamic Specialist Cards & See More Navigation", () => {
  beforeEach(() => {
    // 1 & 2. Open the HMS website and load the Home Page
    homePage.visitHomePage();
  });

  it("loads dynamic specialist cards with live doctor data and navigates to Find Doctors directory", () => {
    // 3. Wait for the "Trusted Specialists" section to load and scroll into view
    homePage.scrollToSpecialists();
    homePage.verifySpecialistsSectionHeader();

    // 4 & 5. Inspect specialist cards and verify dynamic content (doctor name, specialty, photo)
    homePage.verifySpecialistCardsLoaded(1);

    // Verify specific specialist card details are rendered dynamically
    homePage.elements.specialistCards().first().within(() => {
      cy.get(".doc-name").should("be.visible").and("not.be.empty");
      cy.get(".doc-specialty").should("be.visible").and("not.be.empty");
      cy.get(".doc-photo-img").should("be.visible").and("have.attr", "src");
    });

    // 6. Click the "See All Specialists" / "See More" button
    homePage.clickSeeAllSpecialists();

    // 7 & 8. Verify the complete "Find Doctors by Department" listing page opens
    doctorDirectoryPage.verifyPageLoaded();
    doctorDirectoryPage.verifyDoctorsListingNotEmpty();
  });
});
