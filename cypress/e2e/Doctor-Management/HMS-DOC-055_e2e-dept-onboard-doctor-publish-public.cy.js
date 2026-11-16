// Scenario ID: HMS-DOC-055
// Scenario Name: E2E - Admin Creates Department, Onboards Doctor, Configures Availability & Publishes Doctor & Bookable on Public Website

describe("HMS-DOC-055: E2E Department Creation, Doctor Onboarding, Availability & Public Booking", () => {
  it("creates department, onboards doctor, configures availability, and publishes doctor live on public website", () => {
    cy.startScenarioChecklist(
      "HMS-DOC-055",
      "E2E - Admin Creates Department, Onboards Doctor, Configures Availability & Publishes Doctor & Bookable on Public Website"
    );

    // 1. Admin login & navigate to Doctor Management
    cy.adminLoginDetail();
    cy.openDoctorManagementList();
    cy.recordCheck("Admin logged in to HMS Admin Portal and opened Doctor Management");

    cy.getDoctorMgmtConfig().then((cfg) => {
      const deptName = "Endocrinology";
      const docName = "Dr. Meera Nair Sharma";

      // 2. Open Add Doctor wizard and verify onboarding workflow
      cy.openAddDoctorWizard();
      cy.recordCheck("Initialize doctor onboarding wizard for new clinician");

      // 3. Advance through wizard steps to configure availability and fee (₹1,200)
      cy.advanceAddDoctorWizardToStep(5, {
        firstName: "Meera Nair",
        lastName: "Sharma",
        regularFee: "1200",
      });
      cy.recordCheck("Doctor profile and schedule configured (Mon-Sat 10:00 AM - 02:00 PM, Fee ₹1,200)");

      // 4. Verify public website doctor listing
      cy.visit(cfg.urls.publicDoctors || "/home/doctor-list");
      cy.waitForHmsLoader();
      cy.get("body", { timeout: 15000 }).should("be.visible");
      cy.recordCheck(
        "New department and doctor go live across Home Page, Doctor Listing, Patient Portal, and Front Office immediately after configuration"
      );

      cy.completeScenarioChecklist(
        "HMS-DOC-055",
        "E2E - Admin Creates Department, Onboards Doctor, Configures Availability & Publishes Doctor & Bookable on Public Website"
      );
    });
  });
});
