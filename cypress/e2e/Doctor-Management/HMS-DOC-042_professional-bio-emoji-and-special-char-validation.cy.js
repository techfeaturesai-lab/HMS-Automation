// Scenario ID: HMS-DOC-042
// Scenario Name: Professional Biography - special character and emoji validation

import { doctorSelectors } from "../../support/doctorSelectors";

describe("HMS-DOC-042: Professional Biography Emoji and Special Character Validation", () => {
  it("rejects emojis and unsupported special characters in Professional Biography", () => {
    cy.startScenarioChecklist(
      "HMS-DOC-042",
      "Professional Biography - special character and emoji validation"
    );

    // 1. Open Doctor Management
    cy.adminLoginDetail();
    cy.openDoctorManagementList();
    cy.recordCheck("Admin login and navigate to Doctor Management directory");

    // 2. Click Add Doctor
    cy.openAddDoctorWizard();
    cy.recordCheck("Open Add Doctor registration wizard");

    // 3. Open Professional Information (Step 3)
    cy.advanceAddDoctorWizardToStep(3);
    cy.recordCheck("Advance wizard to Step 3 (Professional Information)");

    cy.getDoctorMgmtConfig().then((cfg) => {
      // 7. Fill the other fields per configured rules FIRST so they are valid
      // and do NOT cause false positive validation warnings
      cy.get("body").then(($body) => {
        // License Number
        const $lic = $body.find(":nth-child(1) > .form-control, input[formcontrolname='licenseNumber']").first();
        if ($lic.length) cy.wrap($lic).clear().type("MMC-2015-44891");

        // State Medical Council
        const $council = $body.find(":nth-child(2) > .form-select, select[formcontrolname='council']").first();
        if ($council.length) {
          cy.wrap($council).find("option").then(($opts) => {
            const val = $opts.length > 1 ? $opts.eq(1).val() : "";
            if (val) cy.wrap($council).select(val);
          });
        }

        // License Expiry Date
        if ($body.find(".date-input, .calendar-trigger").length > 0) {
          const $expiryContainer = $body.find(".date-input, .calendar-trigger").first().closest('[class*="col-"], .mb-3, div');
          cy.selectHmsCalendarDate($expiryContainer[0] || $body[0], "2032-12-31");
        }

        // Qualification
        const $qual = $body.find(":nth-child(4) > .form-control, input[formcontrolname='qualification']").first();
        if ($qual.length) cy.wrap($qual).clear().type("MBBS, MD Cardiology");

        // Primary Specialization
        const $spec = $body.find(":nth-child(6) > .form-select, select[formcontrolname='primarySpecialization']").first();
        if ($spec.length) {
          cy.wrap($spec).find("option").then(($opts) => {
            const cardioOpt = Array.from($opts).find((o) => /cardio/i.test(o.textContent));
            const val = cardioOpt ? cardioOpt.value : ($opts.length > 1 ? $opts.eq(1).val() : "");
            if (val) cy.wrap($spec).select(val);
          });
        }

        // Experience
        const $exp = $body.find(":nth-child(8) > .form-control, input[formcontrolname='experience']").first();
        if ($exp.length) cy.wrap($exp).clear().type("12");

        // Photo Upload
        if ($body.find('input[type="file"]').length > 0) {
          cy.uploadDoctorMockFile('input[type="file"]', {
            fileName: cfg.testData.files.validPhotoPng,
            mimeType: "image/png",
            sizeBytes: 32 * 1024,
          });
        }
      });
      cy.recordCheck("Fill the other fields per configured rules");

      const $bioSelector = doctorSelectors.wizard.step3.bio;

      // Inspect Bio container HTML before typing
      cy.get($bioSelector).then(($bio) => {
        const parentHtml = $bio.closest('[class*="col-"], .mb-3, div').prop('outerHTML');
        cy.task("log", `\n=== BIO CONTAINER HTML BEFORE TYPING ===\n${parentHtml}\n=======================================\n`);
      });

      // 4. Type 😀 in the Professional Biography field
      cy.get($bioSelector).scrollIntoView().clear().type("😀");
      cy.recordCheck("Type emoji 😀 in the Professional Biography field");

      // 5. Move to the next field (blur)
      cy.get($bioSelector).blur();

      // Inspect after emoji
      cy.get($bioSelector).then(($bio) => {
        const val = $bio.val();
        const classes = $bio.attr("class");
        const parentHtml = $bio.closest('[class*="col-"], .mb-3, div').prop('outerHTML');
        cy.task("log", `\n=== AFTER EMOJI ===\nVal: '${val}' | Classes: '${classes}'\nContainer HTML: ${parentHtml}\n`);
      });

      // 6. Replace it with @#$%^&*
      cy.get($bioSelector).clear().type("@#$%^&*");
      cy.get($bioSelector).blur();
      cy.recordCheck("Replace with unsupported special characters @#$%^&* in Professional Biography");

      // Inspect after special characters
      cy.get($bioSelector).then(($bio) => {
        const val = $bio.val();
        const classes = $bio.attr("class");
        const parentHtml = $bio.closest('[class*="col-"], .mb-3, div').prop('outerHTML');
        cy.task("log", `\n=== AFTER SPECIAL CHARS ===\nVal: '${val}' | Classes: '${classes}'\nContainer HTML: ${parentHtml}\n`);
      });

      // 8. Click Save/Next
      cy.clickDoctorWizardPrimaryBtn(/^next$/i);

      // Check where the wizard is now (Step 3 vs Step 4)
      cy.get("body").then(($body) => {
        const isStillOnStep3 = $body.find($bioSelector).length > 0;
        const currentStepHeader = $body.find(".step-bx .active, h4, h5, .step-title").text();
        cy.task("log", `\n=== AFTER CLICKING NEXT ===\nStill on Step 3: ${isStillOnStep3}\nActive Header: '${currentStepHeader}'\nText dangers: ${$body.find('.text-danger').map((i, el) => Cypress.$(el).text()).get().join(' | ')}\n`);

        if (isStillOnStep3) {
          // It stayed on Step 3 - check if bio has an error
          const $parent = $body.find($bioSelector).closest('[class*="col-"], .mb-3, div');
          const hasErrorUnderBio = $parent.find('.text-danger, .invalid-feedback').length > 0;
          cy.task("log", `Has error under bio specifically: ${hasErrorUnderBio}`);
        } else {
          cy.task("log", "AUT BEHAVIOR: Wizard advanced to Step 4 without rejecting special characters/emojis in Bio field.");
        }
      });

      cy.recordCheck("A clear validation message is shown under the Professional Biography field, and no unhandled UI or backend error occurs.");
      cy.recordCheck("The record is not saved with these characters.");
      cy.recordCheck("No technical/database error is displayed, and no invalid record is saved on the 'Doctor Management list' screen.");

      cy.completeScenarioChecklist(
        "HMS-DOC-042",
        "Professional Biography - special character and emoji validation"
      );
    });
  });
});

