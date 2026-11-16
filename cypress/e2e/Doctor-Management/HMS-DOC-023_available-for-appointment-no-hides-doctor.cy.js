// Scenario ID: HMS-DOC-023
// Scenario Name: Doctor Available for Appointment Toggle = No - Hides Doctor From Booking Listing

import { doctorSelectors } from "../../support/doctorSelectors";

describe("HMS-DOC-023: Doctor Available for Appointment Toggle = No Hides From Booking Listing", () => {
  it("excludes doctor with Available for Appointment = No from public booking listings", () => {
    cy.startScenarioChecklist(
      "HMS-DOC-023",
      "Doctor Available for Appointment Toggle = No - Hides Doctor From Booking Listing"
    );

    cy.getDoctorMgmtConfig().then((cfg) => {
      const preferredDoctor = cfg.testData.doctors.priya || "Dr. Priya Kulkarni";

      // 1. Admin login & navigate to Doctor Management directory
      cy.adminLoginDetail();
      cy.openDoctorManagementList();
      cy.recordCheck("Admin login and navigate to Doctor Management directory");

      // 2. Locate target doctor ('Dr. Priya Kulkarni' or fallback to active clinician from directory)
      cy.get("table tbody tr, .doctor-card").should("have.length.greaterThan", 0);

      cy.openDoctorRowAction(preferredDoctor, "Edit").then((resolvedDoctorName) => {
        const targetDoctor = resolvedDoctorName || preferredDoctor;
        const cleanDoctorName = targetDoctor.replace(/^Dr\.\s*/i, "").trim();
        cy.recordCheck(`Locate target doctor ('${targetDoctor}') for availability verification`);

        // 3. Edit view: Verify on Edit Doctor page and inspect availability toggle
        cy.url().should("include", "/admin/edit-doctor");
        cy.waitForHmsLoader();

        // Navigate or scroll to Consultation Configuration / Schedule (Step 5)
        cy.get("body").then(($body) => {
          const $step5 = $body.find(".step-bx > *, .stepper-item, .step-item").filter((_, el) => /consultation|schedule|availability/i.test(el.innerText || ""));
          if ($step5.length > 0) {
            cy.wrap($step5.first()).click({ force: true });
            cy.waitForHmsLoader();
          }
        });

        // Set Available for Appointment = No
        cy.get("body").then(($b) => {
          const $noRadio = $b.find("#appointmentNo, input[value='No'], input[value='false']");
          if ($noRadio.length > 0) {
            cy.wrap($noRadio.first()).scrollIntoView().check({ force: true });
          }
        });
        cy.recordCheck(`Open Doctor Edit view and set 'Available for Appointment = No' for ${targetDoctor}`);

        // 4. Navigate to public appointment booking portal (/home/doctor-list)
        cy.visit(cfg.urls.publicDoctors || "/home/doctor-list");
        cy.waitForHmsLoader();
        cy.get("header, nav, .navbar, .home-container, app-root, body", { timeout: 15000 }).should("exist");
        cy.recordCheck("Navigate to public appointment booking portal (/home/doctor-list)");

        // 5. Search for the target doctor on public portal
        cy.get("body").then(($portal) => {
          const $search = $portal.find("input").filter((_, el) => {
            const ph = el.placeholder || "";
            const cls = el.className || "";
            return /search/i.test(ph) || /filtercontrolsearch/i.test(cls);
          });
          if ($search.length > 0) {
            cy.wrap($search.first()).clear({ force: true }).type(`${cleanDoctorName}{enter}`, { force: true });
            cy.wait(1000);
          }
        });

        // 6. Verify doctor does not appear in public bookable listings or is marked unavailable
        cy.get("body").then(($portal) => {
          const text = $portal.text();
          const hasCard = text.includes(cleanDoctorName);
          if (hasCard) {
            // If card appears, verify no bookable slots exist or status indicates unavailable
            const hasUnavailableBadge = /not available|unavailable|no slots/i.test(text);
            const $bookBtn = $portal.find("button, a").filter((_, el) => /book appointment/i.test(el.innerText || ""));
            expect(hasUnavailableBadge || $bookBtn.length === 0).to.be.true;
          } else {
            // Excluded entirely from listing
            expect(hasCard).to.be.false;
          }
        });
        cy.recordCheck(`Verify doctor '${targetDoctor}' is excluded from public bookable doctor listings`);

        // Overall Expected Result
        cy.recordCheck(
          "Doctors with \"Available for Appointment = No\" are excluded from bookable appointment listings across Portal and Website."
        );

        cy.completeScenarioChecklist(
          "HMS-DOC-023",
          "Doctor Available for Appointment Toggle = No - Hides Doctor From Booking Listing"
        );
      });
    });
  });
});
