import { loginPage } from "../../pages/LoginPage";

/**
 * Test Suite: Authentication & Security
 * Scenario ID: HMS-AUTH-025
 * Scenario Name: Prevent Mobile Number Input Exceeding 10 Digits on Patient OTP Login
 *
 * Test Steps:
 * 1. Open HMS Patient Login screen (My Booking modal).
 * 2. Enter 9 digits "987654321".
 * 3. Click "Send OTP".
 * 4. Verify that 9-digit entry is rejected without dispatching OTP API request.
 * 5. Attempt typing 11 digits "98765432109" into mobile field.
 * 6. Verify that input caps at 10 digits (or constrains length to at most 10).
 */
describe("HMS-AUTH-025: Prevent Mobile Number Input Exceeding 10 Digits", () => {
  beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
    loginPage.visit("home");
    loginPage.waitForLoader();
  });

  it("rejects 9 digits without sending OTP and constrains mobile input to maximum 10 numeric digits", () => {
    // 1. Intercept OTP dispatch request to assert no invalid dispatch occurs
    cy.intercept("POST", "**/api/**/otp**").as("otpDispatch");

    // 2. Open Patient Login / My Booking modal
    cy.get(".header-btn-booking, a:contains('My Booking'), button:contains('Sign In')").first().click();
    loginPage.waitForLoader();

    // 3. Locate mobile input
    cy.get("input[type='tel'], input[placeholder*='Mobile'], input[name*='mobile'], #mobileNumber").first().then(($input) => {
      // Step 2-4: Enter 9 digits and click Send OTP
      cy.wrap($input).clear().type("987654321");
      cy.get("button:contains('OTP'), button[type='submit']").first().click({ force: true });

      // Verify no OTP API is dispatched for incomplete 9-digit input
      cy.get("@otpDispatch.all").should("have.length", 0);

      // Step 5-6: Attempt typing 11 digits
      const elevenDigits = "98765432109";
      cy.wrap($input).clear().type(elevenDigits);

      // Verify input value is capped at 10 digits (or maxLength is 10)
      cy.wrap($input).invoke("val").then((val) => {
        const cleaned = val.replace(/\D/g, "");
        expect(cleaned.length).to.be.at.most(10);
      });
    });
  });
});
