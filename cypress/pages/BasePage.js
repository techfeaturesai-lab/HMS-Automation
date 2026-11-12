/**
 * BasePage provides shared interactions and helper utilities
 * across all Page Objects in the HMS application.
 */
export class BasePage {
  /**
   * Wait for the initial Angular loader backdrop to disappear.
   */
  waitForLoader(timeout = 15000) {
    cy.get(".loader-backdrop", { timeout }).should("not.exist");
    return this;
  }

  /**
   * Navigate to a path relative to baseUrl.
   * @param {string} path - The sub-path to visit.
   */
  visit(path = "") {
    cy.visit(path);
    this.waitForLoader();
    return this;
  }

  /**
   * Scroll element into view with smooth behavior.
   * @param {string} selector 
   */
  scrollTo(selector) {
    cy.get(selector).scrollIntoView();
    return this;
  }
}
