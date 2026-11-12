/**
 * Test Suite: Home Page & Website
 * Scenario ID: HMS-HOME-022
 * Scenario Name: 404 Error Handling for Unknown Public Website Route
 *
 * Description:
 * Verify that visiting a non-existent HMS website route displays a user-friendly
 * 404 page with a working "Go to Home" button instead of a blank screen or stack trace.
 */
describe("HMS-HOME-022: 404 Error Handling and Recovery", () => {
  it("displays styled 404 page on unknown route with Go to Home action", () => {
    // 1. Visit unknown non-existent sub-route
    cy.visit("/non-existent-hms-page-404", { failOnStatusCode: false });

    // 2. Verify 404 heading and message appear cleanly
    cy.contains("404").should("be.visible");
    cy.contains(/Page not found/i).should("be.visible");

    // 3. Verify clickable recovery button targeting /home
    cy.get("a.home-button")
      .should("be.visible")
      .and("contain.text", "Go to Home")
      .and("have.attr", "routerlink", "/home");

    // 4. Click button and verify user can return to Home Page
    cy.get("a.home-button").click();
    cy.visit("/home");
    cy.get(".nav-brand").should("be.visible");
  });
});
