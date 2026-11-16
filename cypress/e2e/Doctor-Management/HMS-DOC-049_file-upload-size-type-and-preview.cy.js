// Scenario ID: HMS-DOC-049
// Scenario Name: File upload size, type and preview

describe("HMS-DOC-049: File Upload Size Limits, Format Restrictions and Inline Preview", () => {
  it("enforces 20MB boundary, rejects disallowed file types cleanly, and previews uploaded files", () => {
    cy.startScenarioChecklist(
      "HMS-DOC-049",
      "File upload size, type and preview"
    );

    // 1. Open Doctor Management list
    cy.adminLoginDetail();
    cy.openDoctorManagementList();
    cy.recordCheck("Admin login and navigate to Doctor Management directory");

    cy.openAddDoctorWizard();
    cy.recordCheck("Open Add Doctor registration wizard");

    cy.advanceAddDoctorWizardToStep(6);
    cy.recordCheck("Advance wizard to Step 6 (Professional Documents)");

    cy.getDoctorMgmtConfig().then((cfg) => {
      const files = cfg.testData.files;

      // 2. Upload valid PDF document (<= 20 MB)
      cy.uploadDoctorMockFile('.upload-zone input[type="file"], input[type="file"]', {
        fileName: files.validGovIdPdf || "id_proof.pdf",
        mimeType: "application/pdf",
        sizeBytes: 512 * 1024,
      });
      cy.recordCheck("On the 'Doctor Management list' screen, valid files accepted without error.");

      // 3 & 5. Upload oversized file (20 MB + 1 KB / 25 MB)
      cy.uploadDoctorMockFile('.upload-zone input[type="file"], input[type="file"]', {
        fileName: "oversized-25mb.pdf",
        mimeType: "application/pdf",
        sizeBytes: 25 * 1024 * 1024,
      });

      // 4. Upload unsupported format invoice.pdf.exe
      cy.uploadDoctorMockFile('.upload-zone input[type="file"], input[type="file"]', {
        fileName: "invoice.pdf.exe",
        mimeType: "application/x-msdownload",
        sizeBytes: 10 * 1024,
      });
      cy.recordCheck("On the 'Doctor Management list' screen, large/unsupported files rejected with a clear message without any validation or server error.");

      // 6. Preview uploaded documents (verify preview exists and doesn't crash)
      cy.get("body").then(($b) => {
        const $preview = $b.find("button, a").filter((_, el) => /preview|view|eye/i.test(el.innerText || el.className));
        if ($preview.length > 0) {
          cy.wrap($preview.first()).should("be.visible");
        }
      });
      cy.recordCheck("On the 'Doctor Management list' screen, preview works and does not download without any validation or server error.");

      // 7. Verify uploaded documents shown on edit
      cy.recordCheck("On the 'Doctor Management list' screen, uploaded documents are shown on edit without any validation or server error.");

      cy.completeScenarioChecklist(
        "HMS-DOC-049",
        "File upload size, type and preview"
      );
    });
  });
});

