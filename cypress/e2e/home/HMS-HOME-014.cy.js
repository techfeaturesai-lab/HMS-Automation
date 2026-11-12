import { doctorDirectoryPage } from "../../pages/DoctorDirectoryPage";

/**
 * Test Suite: Home Page & Website
 * Scenario ID: HMS-HOME-014
 * Scenario Name: Reject Special Characters and Non-Matching Queries in Doctor Search
 *
 * Description:
 * Verify that entering special symbols or non-existent keywords in the public Doctor Search
 * displays a clean zero-results state without runtime errors or XSS vulnerability.
 */
describe("HMS-HOME-014: Reject Special Characters and Non-Matching Queries in Doctor Search", () => {
  beforeEach(() => {
    doctorDirectoryPage.visitDirectory();
  });

  it("handles special characters and script tags safely with zero-results state", () => {
    const stub = cy.stub();
    cy.on("window:alert", stub);

    // 1, 2, 3. Search for special symbols
    doctorDirectoryPage.searchDoctor("@@@###$$$");
    cy.wait(400);

    // 4 & 5. Verify clean empty-state message renders without crash
    doctorDirectoryPage.verifyEmptyState();

    // 6 & 7. Clear search and test potential XSS payload
    doctorDirectoryPage.clearSearch();
    cy.wait(400);
    doctorDirectoryPage.searchDoctor("<script>alert(1)</script>");
    cy.wait(400);

    // 8. Verify no JavaScript alert was fired (zero XSS execution)
    expect(stub).to.not.be.called;
    doctorDirectoryPage.verifyEmptyState();
  });
});
