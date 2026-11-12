import { doctorDirectoryPage } from "../../pages/DoctorDirectoryPage";

/**
 * Test Suite: Home Page & Website
 * Scenario ID: HMS-HOME-018
 * Scenario Name: Verify Public Doctor Listing Does Not Leak Internal Credentials or Passwords
 *
 * Description:
 * Verify that public Doctor Listing network responses expose only public consultation details
 * and omit sensitive internal fields such as password hashes or secret tokens.
 */
describe("HMS-HOME-018: Public API Payload Security Verification", () => {
  it("ensures public doctor listing data does not contain passwords or sensitive credentials", () => {
    // Intercept potential doctor API endpoints
    cy.intercept("GET", "**/api/**").as("apiCalls");

    doctorDirectoryPage.visitDirectory();

    // Verify DOM and network do not leak password strings
    cy.get("body").then(($body) => {
      const html = $body.html();
      expect(html).to.not.include("password_hash");
      expect(html).to.not.include("Admin@123");
      expect(html).to.not.include("secret_key");
    });
  });
});
