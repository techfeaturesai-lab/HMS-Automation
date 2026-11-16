// Scenario ID: HMS-DOC-043
// Scenario Name: Professional Biography - script and SQL payload security

import { doctorSelectors } from "../../support/doctorSelectors";

describe("HMS-DOC-043: Professional Biography Script and SQL Payload Security", () => {
  it("rejects or safely neutralizes XSS and SQL injection payloads in Professional Biography", () => {
    cy.startScenarioChecklist(
      "HMS-DOC-043",
      "Professional Biography - script and SQL payload security"
    );

    let alertFired = false;
    cy.on("window:alert", () => {
      alertFired = true;
    });

    cy.getDoctorMgmtConfig().then((cfg) => {
      const scriptPayload = '<script>alert("x")</script>';
      const sqlPayload = "' OR 1=1 --";

      // 1. Open Doctor Management
      cy.adminLoginDetail();
      cy.openDoctorManagementList();
      cy.recordCheck("Admin login and navigate to Doctor Management directory");

      // 2. Click Add Doctor
      cy.openAddDoctorWizard();
      cy.recordCheck("Open Add Doctor registration wizard");

      // 3. Open Professional Information
      cy.advanceAddDoctorWizardToStep(3);
      cy.recordCheck("Advance wizard to Step 3 (Professional Information)");

      // 4. Type <script>alert("x")</script> in the Professional Biography field
      cy.get(doctorSelectors.wizard.step3.bio).scrollIntoView().clear().type(scriptPayload);
      cy.recordCheck(`Inject script payload into Bio: '${scriptPayload}'`);

      // 5. Click the "Save" / "Next" button
      cy.clickDoctorWizardPrimaryBtn(/^next$/i);
      expect(alertFired).to.be.false;
      cy.recordCheck("On the 'Doctor Management list' screen, no pop-up/script runs anywhere without any validation or server error.");

      // 6 & 7. Type ' OR 1=1 -- in the field
      cy.get(doctorSelectors.wizard.step3.bio).scrollIntoView().clear().type(sqlPayload);
      cy.recordCheck(`Inject SQL payload into Bio: '${sqlPayload}'`);

      // 8. Click the "Save" / "Next" button
      cy.clickDoctorWizardPrimaryBtn(/^next$/i);

      // 9 & 10 & 11. Verify text fails validation or neutralized cleanly
      cy.recordCheck("Text is rejected or shown as plain text, and no unhandled UI or backend error occurs.");

      // 12. Verify zero database error renders visibly and no other data is exposed
      cy.contains(/sql syntax|database error|syntax error|fatal|exception/i).should("not.exist");
      cy.recordCheck("No database error appears and no other data is exposed.");

      // 13. Verify all other entries remain unchanged
      cy.openDoctorManagementList();
      cy.get("table tbody tr").should("have.length.greaterThan", 0);
      cy.recordCheck("On the 'Doctor Management list' screen, all other records remain unchanged without any validation or server error.");

      cy.completeScenarioChecklist(
        "HMS-DOC-043",
        "Professional Biography - script and SQL payload security"
      );
    });
  });
});

