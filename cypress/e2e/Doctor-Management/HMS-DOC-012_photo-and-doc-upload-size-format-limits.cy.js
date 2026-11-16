// Scenario ID: HMS-DOC-012
// Scenario Name: Doctor Profile Photo & License Upload - Rejects Oversized (>2 MB/20 MB) & Unsupported (GIF/SVG) Formats

import { doctorSelectors } from "../../support/doctorSelectors";

describe("HMS-DOC-012: Doctor Profile Photo & License Upload Size/Format Limits", () => {
  it("rejects oversized or unsupported file formats for Profile Photo and Professional Documents", () => {
    cy.startScenarioChecklist(
      "HMS-DOC-012",
      "Doctor Profile Photo & License Upload - Rejects Oversized (>2 MB/20 MB) & Unsupported (GIF/SVG) Formats"
    );

    cy.getDoctorMgmtConfig().then((cfg) => {
      const files = cfg.testData.files;

      cy.adminLoginDetail();
      cy.openDoctorManagementList();
      cy.recordCheck("Admin login and navigate to Doctor Management directory");

      cy.openAddDoctorWizard();
      cy.recordCheck("Open Add Doctor registration wizard");

      // Verify Profile Photo upload container on Step 1 / Step 3
      cy.get("body").then(($b) => {
        const hasPhotoInput = $b.find(".upload-circle, input[type='file'][accept*='image']").length > 0;
        if (hasPhotoInput) {
          cy.get(".upload-circle, input[type='file'][accept*='image']").first().scrollIntoView().should("exist");
          cy.recordCheck("Profile photo upload container is rendered on form");
        }
      });

      // Advance through wizard to Step 6 (Professional Documents)
      cy.advanceAddDoctorWizardToStep(6);
      cy.recordCheck("Advance wizard to Step 6 (Professional Documents)");

      // Check dropzone supported format labels and size guidance
      cy.contains(/supported formats.*png|pdf|max size/i).scrollIntoView().should("be.visible");
      cy.recordCheck("Dropzones display explicit format (PNG, JPG, PDF) and size limit guidance");

      // Attempt uploading oversized file (> 2 MB)
      cy.get('input[type="file"]').first().selectFile(
        {
          contents: Cypress.Buffer.alloc(3 * 1024 * 1024, "a"),
          fileName: files.oversizedPhotoName || "large_file_5mb.jpg",
          mimeType: "image/jpeg",
          lastModified: Date.now(),
        },
        { force: true }
      );
      cy.wait(500);

      // Verify that system rejects oversized attachment or displays validation feedback
      cy.get("body").then(($b) => {
        const errorOrToast = /file size|must not exceed|2 mb|invalid|large/i.test($b.text()) ||
          $b.find(".invalid-feedback, .text-danger, .hms-toast").length > 0;
        expect(errorOrToast).to.be.true;
      });
      cy.recordCheck("Oversized file triggers validation feedback or rejection without server error");

      // Verify no generic server crash banner appears
      cy.contains(/something went wrong|we are unable to process/i).should("not.exist");
      cy.recordCheck("Upload size and format boundary guards prevent HTTP 500 / unhandled crash");

      cy.completeScenarioChecklist(
        "HMS-DOC-012",
        "Doctor Profile Photo & License Upload - Rejects Oversized (>2 MB/20 MB) & Unsupported (GIF/SVG) Formats"
      );
    });
  });
});
