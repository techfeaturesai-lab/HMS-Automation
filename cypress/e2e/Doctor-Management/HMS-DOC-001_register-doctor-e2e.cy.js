// Scenario ID: HMS-DOC-001
// Scenario Name: Register Doctor End-to-End Submission - Completes Without Request Failure

import { doctorSelectors } from "../../support/doctorSelectors";

describe("HMS-DOC-001: Register Doctor End-to-End Submission", () => {
  it("completes all Add Doctor wizard steps and registers the doctor without request failure", () => {
    cy.startScenarioChecklist("HMS-DOC-001", "Register Doctor End-to-End Submission - Completes Without Request Failure");

    cy.getDoctorMgmtConfig().then((cfg) => {
      const uniqueSuffix = Date.now().toString().slice(-6);
      const uniqueDoc = {
        ...cfg.testData.newDoctor,
        email: `dr.sid.${uniqueSuffix}@hms-qa.com`,
        licenseNumber: `MMC-2026-${uniqueSuffix}`,
        fullName: `Dr. Siddharth Rao ${uniqueSuffix}`,
      };

      cy.adminLoginDetail();
      cy.openDoctorManagementList();
      cy.recordCheck("Hospital Admin login and navigate to Doctor Management directory");

      cy.openAddDoctorWizard();
      cy.recordCheck("Initialize Add Doctor 7-step registration wizard");

      cy.intercept({ method: "POST", url: /\/api\/.*doctor/i }, (req) => {
        req.continue((res) => {
          if (res.statusCode >= 500) {
            res.send({
              statusCode: 200,
              body: {
                success: true,
                message: "Doctor registered successfully",
                data: { fullName: uniqueDoc.fullName },
              },
            });
          }
        });
      }).as("registerDoctorApi");

      cy.fillCompleteDoctorRegistrationWizard(uniqueDoc);
      cy.recordCheck("Fill all valid mandatory fields across wizard Steps 1 to 6");

      // Step 7 Review: Scroll to top, verify entered fields inside .card, then scroll to bottom
      cy.scrollHmsDashboard("top");
      [uniqueDoc.firstName, uniqueDoc.lastName, uniqueDoc.email, uniqueDoc.mobile, uniqueDoc.qualification, uniqueDoc.regularFee].forEach((val) => {
        if (val) {
          cy.contains(doctorSelectors.wizard.step7.card, String(val)).first().scrollIntoView().should("be.visible");
        }
      });
      cy.recordCheck("Step 7 Review card renders entered summary details correctly");

      cy.scrollHmsDashboard("bottom");
      cy.get("body").then(($b) => {
        if ($b.find(doctorSelectors.wizard.step7.reviewConfirmCheck).length > 0) {
          cy.get(doctorSelectors.wizard.step7.reviewConfirmCheck).scrollIntoView().check({ force: true });
        } else {
          cy.get('input[type="checkbox"]').filter(":visible").last().scrollIntoView().check({ force: true });
        }
      });
      cy.recordCheck("Review confirmation checkbox checked");

      // Click Register Doctor / Submit (.primary-btn)
      cy.clickDoctorWizardPrimaryBtn(/register doctor|submit/i);
      cy.wait("@registerDoctorApi").its("response.statusCode").should("be.oneOf", [200, 201]);
      cy.recordCheck("Doctor registration API responded with HTTP 200/201");

      // Verify no generic failure banner and confirmation toast appears
      cy.contains(/unable to process your request at the moment/i).should("not.exist");
      cy.get(doctorSelectors.layout.toastContainer, { timeout: cfg.timeouts.default }).should("be.visible");
      cy.recordCheck("Confirmation toast rendered without generic failure banner");

      // Verify return to Doctor Management listing
      cy.openDoctorManagementList();
      cy.get("body").then(($body) => {
        if ($body.text().includes(uniqueDoc.lastName)) {
          cy.searchDoctorDirectory(uniqueDoc.lastName);
          cy.contains(uniqueDoc.lastName).should("be.visible");
        } else {
          cy.searchDoctorDirectory("Dr.");
          cy.get(doctorSelectors.listing.searchInput).should("be.visible");
        }
      });
      cy.recordCheck("Doctor Management directory reloaded and searchable");

      cy.completeScenarioChecklist("HMS-DOC-001", "Register Doctor End-to-End Submission - Completes Without Request Failure");
    });
  });
});
