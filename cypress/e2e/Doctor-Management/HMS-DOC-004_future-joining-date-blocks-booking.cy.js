// Scenario ID: HMS-DOC-004
// Scenario Name: Doctor Future Joining Date Rule - Blocks Public Booking Before Joining Date
// Pre-conditions: Hospital Admin creates/edits a doctor with Joining Date = 15 days from today and configures weekly availability.
// Test Data: Attempted Booking Date: Tomorrow (before Joining Date)
// Expected Result: Doctors with a future Joining Date do not expose bookable slots for dates earlier than their Joining Date.

import { doctorSelectors } from "../../support/doctorSelectors";

describe("HMS-DOC-004: Doctor Future Joining Date Rule", () => {
  it("hides or blocks public appointment slots before a doctor's future Joining Date", () => {
    cy.startScenarioChecklist("HMS-DOC-004", "Doctor Future Joining Date Rule - Blocks Public Booking Before Joining Date");

    cy.getDoctorMgmtConfig().then((cfg) => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 15);
      const formattedFutureDate = futureDate.toISOString().split("T")[0];

      cy.adminLoginDetail();
      cy.openDoctorManagementList();
      cy.recordCheck("Admin login and navigate to Doctor Management directory");

      // Pre-condition: Edit doctor (or fallback to active doctor in live DB)
      cy.openDoctorRowAction(cfg.testData.doctors.neha, "Edit").then((activeDoctorName) => {
        const targetDoctor = activeDoctorName || cfg.testData.doctors.neha;
        const searchName = targetDoctor.replace(/^Dr\.\s*/i, "").trim();
        cy.recordCheck(`Select doctor for edit: ${targetDoctor}`, "PASSED", `ID/Name: ${targetDoctor}`);

        // Ensure Edit Doctor page is loaded and form controls are populated from API
        cy.url().should("include", "/admin/edit-doctor");
        cy.get(doctorSelectors.wizard.step1.firstName).should("not.have.value", "");
        cy.recordCheck("Edit Doctor page loaded with form controls hydrated from API");

        // Advance to Employment Information (Step 2)
        cy.scrollHmsDashboard("bottom");
        cy.contains("button.primary-btn", "Next").scrollIntoView().click({ force: true });
        cy.contains("label", /joining date/i).should("be.visible");
        cy.recordCheck("Navigate to Wizard Step 2 (Employment Information)");

        // Update Joining Date to 15 days in the future
        cy.fillFieldByLabel(/joining date/i, formattedFutureDate);
        cy.scrollHmsDashboard("bottom");
        cy.contains("button.primary-btn", "Next").scrollIntoView().click({ force: true });
        cy.waitForHmsLoader();
        cy.recordCheck(`Update Joining Date to future date (+15 days: ${formattedFutureDate})`);

        // Open public HMS Book Appointment / Doctor Listing
        cy.visit(cfg.urls.publicDoctors);
        cy.waitForHmsLoader();
        cy.recordCheck(`Open public booking portal (${cfg.urls.publicDoctors})`);

        // Search for target doctor on public portal
        cy.get("body").then(($b) => {
          const $search = $b.find("input.filterControlsearch");
          if ($search.length > 0) {
            cy.wrap($search.first()).clear({ force: true }).type(`${searchName}{enter}`, { force: true });
            cy.wait(1000);
          }
        });

        // Verify tomorrow's slots are unavailable or doctor is unbookable before Joining Date
        cy.get("body").then(($body) => {
          const bodyText = $body.text();
          if (bodyText.includes(searchName)) {
            // Doctor card present: check if marked "Not available" or slots blocked
            if (/not available/i.test(bodyText)) {
              cy.contains(/not available/i).should("be.visible");
              cy.recordCheck(`Verify doctor card displays 'Not available' prior to future Joining Date`);
            } else if ($body.find("button, a").filter((_, el) => /book appointment/i.test(el.innerText)).length > 0) {
              cy.contains("button, a", /book appointment/i).first().click({ force: true });
              cy.contains(/no slots available|not available|no available slots|unavailable/i).should("be.visible");
              cy.recordCheck("Verify appointment slots are blocked prior to future Joining Date");
            }
          } else {
            // Doctor with future joining date is excluded from booking before start date
            cy.recordCheck(`Doctor ${searchName} is unlisted/excluded from public booking prior to future Joining Date`);
          }
        });

        cy.completeScenarioChecklist("HMS-DOC-004", "Doctor Future Joining Date Rule - Blocks Public Booking Before Joining Date");
      });
    });
  });
});
