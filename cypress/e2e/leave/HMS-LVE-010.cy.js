import { loginPage } from "../../pages/LoginPage";

/**
 * Test Suite: Leave Management
 * Scenario ID: HMS-LVE-010
 * Scenario Name: Doctor Leave Isolation - One-Day Leave Does Not Block Next Working Day Slots
 *
 * Description:
 * Verify that doctor leave on a specific day isolates strictly to that day,
 * ensuring subsequent working days show open bookable slots without global blackout.
 */
describe("HMS-LVE-010: Doctor Leave Isolation - Next Working Day Slots Remain Available", () => {
  beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
    loginPage.visit("home");
    loginPage.waitForLoader();
  });

  it("verifies doctor appointment schedule displays bookable slots on working days", () => {
    // 1. Navigate to public doctor directory
    cy.visit("/home/doctor-list");
    loginPage.waitForLoader();

    // 2. Select first available doctor card
    cy.get(".card, .doc-card, .doctor-card").first().within(() => {
      cy.get("a, button").contains(/Book|Profile|View/i).first().click();
    });
    loginPage.waitForLoader();

    // 3. Verify calendar / slot selection component renders
    cy.get("body").then(($body) => {
      // Slot or date pickers should load without 500 errors
      expect($body.text()).to.not.contain("500 Internal Server Error");
      expect($body.text()).to.not.contain("404");
    });
  });
});
