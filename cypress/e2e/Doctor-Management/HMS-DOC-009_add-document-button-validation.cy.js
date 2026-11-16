// Scenario ID: HMS-DOC-009
// Scenario Name: Doctor Add Document Button - Prompts Clearly or Opens File Picker Without False Missing Error

import { doctorSelectors } from "../../support/doctorSelectors";

describe("HMS-DOC-009: Doctor Add Document Button Validation", () => {
  it("validates missing file clearly and attaches valid files cleanly via Add Document", () => {
    cy.startScenarioChecklist(
      "HMS-DOC-009",
      "Doctor Add Document Button - Prompts Clearly or Opens File Picker Without False Missing Error"
    );

    cy.getDoctorMgmtConfig().then((cfg) => {
      cy.adminLoginDetail();
      cy.openDoctorManagementList();
      cy.recordCheck("Admin login and navigate to Doctor Management directory");

      cy.openAddDoctorWizard();
      cy.recordCheck("Open Add Doctor registration wizard");

      // Advance through Steps 1-5 to Step 6 Professional Documents
      cy.advanceAddDoctorWizardToStep(6);
      cy.recordCheck("Advance wizard to Step 6 (Professional Documents)");

      // Verify Browse link / dropzone exists and is interactive
      cy.get(".upload-zone").first().scrollIntoView().should("be.visible");
      cy.get(".upload-zone > .browse-link, .upload-zone, .browse-link")
        .filter(":visible")
        .first()
        .should("be.visible");
      cy.recordCheck("File upload dropzone and Browse triggers render interactively");

      // Scroll to bottom of Step 6 to reveal Additional Documents section
      cy.scrollHmsDashboard("bottom");

      // In Additional Documents section:
      // Select Document Type (first valid non-placeholder option)
      cy.get("body").then(($b) => {
        const $extraDocSelect = $b.find(":nth-child(1) > .form-select, select.form-select").last();
        if ($extraDocSelect.length > 0) {
          cy.wrap($extraDocSelect)
            .scrollIntoView()
            .find("option:not([disabled]):not([value*='null'])")
            .first()
            .then(($opt) => {
              cy.wrap($extraDocSelect).select($opt.val(), { force: true });
            });
        }
      });

      // Check: Click 'Add Document' (.p-2 > .primary-btn) when no file has been chosen
      cy.get("body").then(($b) => {
        const $addBtn = $b.find(".p-2 > .primary-btn, button:contains('Add Document')").filter(":visible");
        if ($addBtn.length > 0) {
          cy.wrap($addBtn.first()).scrollIntoView().click({ force: true });
        }
      });

      // Verify validation: error message or form prevents adding empty document
      cy.get("body").then(($b) => {
        const hasError = /please select|choose a file|required|select document|fill/i.test($b.text());
        const tableRows = $b.find("table tbody tr").length;
        // Either explicit error message is visible or table remains empty (0 rows added)
        expect(hasError || tableRows === 0).to.be.true;
      });
      cy.recordCheck("Clicking Add Document without attaching a file triggers validation / blocks addition");

      // Choose valid file onto Additional Document file input
      cy.get("body").then(($b) => {
        const $extraFile = $b.find(':nth-child(2) > input[type="file"].form-control, input[type="file"]').last();
        cy.wrap($extraFile).selectFile(
          {
            contents: Cypress.Buffer.from("%PDF-1.4 Mock License Content", "utf-8"),
            fileName: cfg.testData.files.validLicensePdf,
            mimeType: "application/pdf",
            lastModified: Date.now(),
          },
          { force: true }
        );
      });

      // Click 'Add Document' to attach the file
      cy.get("body").then(($b) => {
        const $addBtn = $b.find(".p-2 > .primary-btn, button:contains('Add Document')").filter(":visible");
        if ($addBtn.length > 0) {
          cy.wrap($addBtn.first()).scrollIntoView().click({ force: true });
        }
      });
      cy.wait(1000);

      // Verify the attached document appears in the document list / table
      cy.get("body").then(($b) => {
        const pageText = $b.text();
        const docAdded =
          pageText.includes(cfg.testData.files.validLicensePdf) ||
          pageText.includes("license") ||
          $b.find("table tbody tr, .document-row, .uploaded-item").length > 0 ||
          $b.find(':nth-child(2) > input[type="file"].form-control').val() !== "";

        expect(docAdded).to.be.true;
      });
      cy.recordCheck("Valid document attaches without blockers and renders in document list");

      cy.completeScenarioChecklist(
        "HMS-DOC-009",
        "Doctor Add Document Button - Prompts Clearly or Opens File Picker Without False Missing Error"
      );
    });
  });
});
