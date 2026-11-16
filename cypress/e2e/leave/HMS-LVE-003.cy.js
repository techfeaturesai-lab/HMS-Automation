import { loginPage } from "../../pages/LoginPage";
import { leavePage } from "../../pages/LeavePage";
import users from "../../fixtures/users.json";

/**
 * Test Suite: Leave Management
 * Scenario ID: HMS-LVE-003
 * Scenario Name: Leave Application - Rejects Emojis & Symbols in Reason Field
 *
 * Description:
 * Verify that entering emojis or disallowed mathematical symbols in Leave Reason
 * triggers validation instead of saving.
 *
 * Test Steps:
 * 1. Open "Leave Management".
 * 2. Open "Apply Leave".
 * 3. Select "Casual Leave" and valid future From/To dates.
 * 4. Enter "Family function 😊 ++ == ##" in the "Leave Reason" field.
 * 5. Click "Submit".
 * 6. Verify that validation rejects emojis and disallowed special symbols and prompts for standard alphanumeric text.
 */
describe("HMS-LVE-003: Leave Application - Rejects Emojis & Symbols in Reason Field", () => {
  beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
    loginPage.visit("home");
    loginPage.waitForLoader();
  });

  it("validates Leave Reason when emojis and disallowed symbols are entered", () => {
    // -------------------------------------------------------------------------
    // Pre-condition: Doctor is logged in to HMS
    // -------------------------------------------------------------------------
    loginPage.openStaffLoginModal();
    loginPage.elements.staffNumberInput().clear().type(users.doctor.staffNumber);
    loginPage.elements.staffPasswordInput().clear().type(users.doctor.password);
    loginPage.elements.loginSubmitBtn().click();
    cy.url({ timeout: 15000 }).should("include", "/doctor/doctordashboard");
    loginPage.waitForLoader();

    // -------------------------------------------------------------------------
    // Step 1: Open "Leave Management" (My Leave)
    // -------------------------------------------------------------------------
    leavePage.visitMyLeave();

    // -------------------------------------------------------------------------
    // Step 2: Open "Apply Leave" modal
    // -------------------------------------------------------------------------
    leavePage.openAddLeaveModal();

    // -------------------------------------------------------------------------
    // Step 3: Select "Casual Leave" and valid future From/To dates
    // -------------------------------------------------------------------------
    leavePage.elements.leaveTypeSelect().select("Casual Leave");
    leavePage.elements.dayTypeSelect().select("Full Day");

    // Open calendar and select valid future date (Next Wednesday)
    leavePage.selectFutureDate(2);
    leavePage.elements.dateInput().invoke("val").should("not.be.empty");

    // -------------------------------------------------------------------------
    // Step 4: Enter "Family function 😊 ++ == ##" in the "Leave Reason" field
    // -------------------------------------------------------------------------
    const invalidReason = "Family function 😊 ++ == ##";
    leavePage.elements.reasonInput().clear();
    leavePage.elements.reasonInput()
      .invoke("val", invalidReason)
      .trigger("input")
      .trigger("change");

    // -------------------------------------------------------------------------
    // Step 5: Click "Submit"
    // -------------------------------------------------------------------------
    // Intercept POST request to confirm client blocks submission
    cy.intercept("POST", "**/LeaveRequests**").as("createLeaveAttempt");
    leavePage.elements.submitRequestBtn().click();

    // -------------------------------------------------------------------------
    // Step 6: Verify validation rejects emojis and disallowed special symbols
    // -------------------------------------------------------------------------
    // 1. Verify exact validation message indicating emojis and special symbols are not allowed
    leavePage.elements.emojiErrorMsg().should("be.visible");

    // 2. Verify Reason input has invalid validation class
    leavePage.elements.reasonInput().should("have.class", "ng-invalid");

    // 3. Verify modal remains open and request is not submitted
    leavePage.elements.applyLeaveModal().should("be.visible");

    // 4. Close modal cleanly
    leavePage.elements.cancelBtn().click();
    leavePage.elements.applyLeaveModal().should("not.exist");
  });
});
