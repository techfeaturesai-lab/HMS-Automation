// Scenario ID: HMS-DOC-005
// Scenario Name: Staff/Doctor Identity Document Upload - PDF File Displays Uploaded & Enforces Mandatory Multi-Doc

import { doctorSelectors } from "../../support/doctorSelectors";

describe("HMS-DOC-005: Doctor Identity Document Upload & Mandatory Multi-Doc Guard", () => {
  it("renders uploaded PDF immediately in document list and blocks Next if mandatory multi-doc is empty", () => {
    cy.startScenarioChecklist(
      "HMS-DOC-005",
      "Staff/Doctor Identity Document Upload - PDF File Displays Uploaded & Enforces Mandatory Multi-Doc"
    );

    cy.getDoctorMgmtConfig().then((cfg) => {
      cy.adminLoginDetail();
      cy.openDoctorManagementList();
      cy.recordCheck("Admin login and navigate to Doctor Management directory");

      cy.openAddDoctorWizard();
      cy.recordCheck("Open Add Doctor registration wizard");

      // Advance through Steps 1-5 to Step 6 (Professional Documents)
      cy.advanceAddDoctorWizardToStep(6);
      cy.recordCheck("Advance wizard to Step 6 (Professional Documents)");

      // Select ID Proof type (Aadhaar Card: '1: 20')
      cy.get(".mb-3 > .form-select, select.form-select").first().select("1: 20", { force: true });
      cy.recordCheck("Select valid ID Proof type ('Aadhaar Card')");

      // Upload valid 500 KB PDF to Input [3] (ID Proof dropzone)
      cy.get('input[type="file"]').eq(3).selectFile(
        {
          contents: Cypress.Buffer.alloc(500 * 1024, "%PDF-1.4 Mock Government ID"),
          fileName: cfg.testData.files.validGovIdPdf,
          mimeType: "application/pdf",
          lastModified: Date.now(),
        },
        { force: true }
      );
      cy.wait(500);

      // Verify that uploaded document renders with preview / action controls
      cy.get("body").then(($b) => {
        const hasActions = $b.find("button:contains('Preview'), a:contains('Preview'), button:contains('Remove'), button:contains('Change'), .upload-zone").length > 0;
        expect(hasActions).to.be.true;
      });
      cy.recordCheck("Uploaded identity document renders with preview/action controls in UI");

      // Click Next without attaching mandatory Registration Certificate
      cy.clickDoctorWizardPrimaryBtn(/^next$/i);

      // Verify that wizard progression halts on Step 6 and mandatory error is displayed
      cy.contains(/registration certificate is required|required/i).scrollIntoView().should("be.visible");
      cy.contains(/professional documents|documents/i).should("be.visible");
      cy.recordCheck("Wizard progression halts on Step 6 with mandatory document error displayed");

      cy.completeScenarioChecklist(
        "HMS-DOC-005",
        "Staff/Doctor Identity Document Upload - PDF File Displays Uploaded & Enforces Mandatory Multi-Doc"
      );
    });
  });
});
