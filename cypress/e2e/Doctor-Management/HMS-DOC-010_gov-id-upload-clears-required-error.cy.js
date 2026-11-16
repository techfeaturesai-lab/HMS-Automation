// Scenario ID: HMS-DOC-010
// Scenario Name: Doctor Gov ID Upload Validation - Clears Required Error Immediately After Uploading Document

describe("HMS-DOC-010: Doctor Government ID Upload Clears Required Error", () => {
  it("clears 'ID Proof document and type are required.' immediately after selecting ID type and uploading pan_card.pdf", () => {
    cy.startScenarioChecklist(
      "HMS-DOC-010",
      "Doctor Gov ID Upload Validation - Clears Required Error Immediately After Uploading Document"
    );

    cy.getDoctorMgmtConfig().then((cfg) => {
      cy.adminLoginDetail();
      cy.openDoctorManagementList();
      cy.recordCheck("Admin login and navigate to Doctor Management directory");

      cy.openAddDoctorWizard();
      cy.recordCheck("Open Add Doctor registration wizard");

      // Advance Steps 1-5 to Step 6 (Professional Documents)
      cy.advanceAddDoctorWizardToStep(6);
      cy.recordCheck("Advance wizard to Step 6 (Professional Documents)");

      // Click Next to trigger required validation errors
      cy.clickDoctorWizardPrimaryBtn(/^next$/i);

      // Verify required error appears for ID Proof
      cy.contains(/id proof document and type are required|is required/i)
        .scrollIntoView()
        .should("be.visible");
      cy.recordCheck("Inline error 'ID Proof document and type are required' is displayed when empty");

      // Select ID Proof type: '1: 20' (Aadhaar Card)
      cy.get(".mb-3 > .form-select, select.form-select").first().select("1: 20", { force: true });
      cy.recordCheck("Select valid ID Proof type ('Aadhaar Card')");

      // Upload valid pan_card.pdf specifically into Input [3] (ID Proof dropzone)
      cy.get('input[type="file"]').eq(3).selectFile(
        {
          contents: Cypress.Buffer.from("%PDF-1.4 Mock PAN Card Content", "utf-8"),
          fileName: cfg.testData.files.validPanPdf,
          mimeType: "application/pdf",
          lastModified: Date.now(),
        },
        { force: true }
      );

      // Verify that ID Proof required error clears immediately
      cy.contains(/id proof document and type are required/i).should("not.exist");
      cy.recordCheck("ID Proof required error clears immediately after uploading document");

      // Fulfill remaining mandatory documents (Inputs 0, 1, 2) to demonstrate clean step progression
      [0, 1, 2].forEach((idx) => {
        cy.get('input[type="file"]').eq(idx).selectFile(
          {
            contents: Cypress.Buffer.from("%PDF-1.4 Mock Certificate", "utf-8"),
            fileName: cfg.testData.files.validLicensePdf,
            mimeType: "application/pdf",
            lastModified: Date.now(),
          },
          { force: true }
        );
      });

      // Click Next and verify advancement to Step 7 (Review & Register)
      cy.clickDoctorWizardPrimaryBtn(/^next$/i);
      cy.scrollHmsDashboard("top");
      cy.get(".card, .dashboard-container", { timeout: 15000 }).should("exist");
      cy.contains("button, .primary-btn", /register doctor|submit/i)
        .scrollIntoView()
        .should("be.visible");
      cy.recordCheck("Wizard advances to Step 7 (Review & Register) without blockers");

      cy.completeScenarioChecklist(
        "HMS-DOC-010",
        "Doctor Gov ID Upload Validation - Clears Required Error Immediately After Uploading Document"
      );
    });
  });
});
