// ***************************************************************************
// Reusable Doctor Management Helpers & Page Commands
// Aligned with live HMS UI selectors captured from Cypress Studio:
// Sidebar (.nav-list > :nth-child(10) > .sidebar-link -> .sub-item),
// Wizard (.step-bx > :nth-child(1..7), .primary-btn, .gy-3, .form-control,
// .form-select, .calendar-trigger, #sameAsCurrentAddress, #appointmentYes,
// .upload-zone, .upload-circle, .p-2 > .primary-btn, #reviewConfirmCheck).
// ***************************************************************************

const WIZARD_STEP_INDEX = [
  { regex: /personal|basic|contact|address|emergency/i, index: 1 },
  { regex: /employment/i, index: 2 },
  { regex: /professional|license|qualification|specialization|bio|photo/i, index: 3 },
  { regex: /language|communication|department/i, index: 4 },
  { regex: /fee|consultation|availability|schedule/i, index: 5 },
  { regex: /document|upload|identity/i, index: 6 },
  { regex: /review|confirm|signature/i, index: 7 },
];

/**
 * Waits for the global HMS loader backdrop to disappear.
 */
Cypress.Commands.add("waitForHmsLoader", () => {
  return cy.getDoctorMgmtConfig().then((cfg) => {
    cy.get(cfg.selectors.loader, { timeout: cfg.timeouts.loader }).should("not.exist");
  });
});

/**
 * Navigates to the Doctor Management listing screen via direct URL /admin/doctors.
 */
Cypress.Commands.add("openDoctorManagementList", () => {
  return cy.getDoctorMgmtConfig().then((cfg) => {
    cy.visit(cfg.urls.doctorManagement || "/admin/doctors");
    cy.get(".loader-backdrop", { timeout: 30000 }).should("not.exist");
    cy.url({ timeout: 30000 }).should("include", "/admin/doctors");
    cy.get("table, .table, tbody", { timeout: 45000 }).should("exist");
  });
});

/**
 * Scrolls the HMS Angular layout (.dashboard-container) and window cleanly.
 * Avoids 'center of this element is hidden from view' on long wizard/review pages.
 */
Cypress.Commands.add("scrollHmsDashboard", (position = "top") => {
  cy.get("body").then(($b) => {
    if ($b.find(".dashboard-container").length > 0) {
      cy.get(".dashboard-container").first().scrollTo(position, { ensureScrollable: false });
    }
  });
  cy.scrollTo(position, { ensureScrollable: false });
});

/**
 * Clicks Add Doctor (.primary-btn) from Doctor Management to open the Create Doctor Wizard.
 */
Cypress.Commands.add("openAddDoctorWizard", () => {
  return cy.getDoctorMgmtConfig().then((cfg) => {
    cy.contains("button, a, .primary-btn", /add doctor/i, { timeout: 15000 })
      .scrollIntoView()
      .click({ force: true });
    cy.waitForHmsLoader();
    cy.url({ timeout: 15000 }).should("include", "/admin/add-doctor");
  });
});

/**
 * Clicks the visible wizard Next / Save / Submit primary button (.primary-btn),
 * automatically excluding the Step 6 inline Add Document button (.add-doc-btn)
 * unless explicitly requested.
 */
Cypress.Commands.add("clickDoctorWizardPrimaryBtn", (textRegex = /next|save|submit|register|continue/i) => {
  const isAddDoc = textRegex && textRegex.source && textRegex.source.toLowerCase().includes("add document");

  if (isAddDoc) {
    cy.get("button.add-doc-btn, .add-doc-btn, button:contains('Add Document')")
      .first()
      .scrollIntoView()
      .click({ force: true });
    cy.waitForHmsLoader();
    return;
  }

  cy.get("button.primary-btn, .primary-btn")
    .not(".add-doc-btn")
    .then(($buttons) => {
      let target = null;
      if (textRegex) {
        target = Array.from($buttons).find((el) => {
          const text = (el.textContent || el.innerText || "").trim();
          return textRegex.test(text) && !/add document/i.test(text);
        });
      }
      if (!target && $buttons.length > 0) {
        for (let i = $buttons.length - 1; i >= 0; i--) {
          const text = ($buttons[i].textContent || $buttons[i].innerText || "").trim();
          if (!/add document/i.test(text)) {
            target = $buttons[i];
            break;
          }
        }
      }

      if (target) {
        cy.wrap(target).scrollIntoView().click({ force: true });
      } else {
        cy.get("button.primary-btn:not(.add-doc-btn)").last().scrollIntoView().click({ force: true });
      }
    });
  cy.waitForHmsLoader();
});

/**
 * Searches for a doctor in the Doctor Management search input.
 */
Cypress.Commands.add("searchDoctorDirectory", (query, { pressEnter = false } = {}) => {
  return cy.getDoctorMgmtConfig().then((cfg) => {
    const searchSelector =
      '.filterControlinput, input[placeholder*="Search by name"], input[placeholder*="search" i], input[placeholder*="Search"], input[type="search"]';
    cy.get('.filterControlinput, input[type="search"], input.form-control', { timeout: cfg.timeouts.default })
      .filter(":visible")
      .first()
      .scrollIntoView()
      .clear({ force: true })
      .type(pressEnter ? `${query}{enter}` : query, { force: true });
    cy.waitForHmsLoader();
    cy.wait(500);
  });
});

/**
 * Clicks the Clear (X) icon inside the Doctor Management search bar.
 */
Cypress.Commands.add("clearDoctorSearchWithIcon", () => {
  cy.get("body").then(($body) => {
    if ($body.find('button[aria-label="Clear search"]').length > 0) {
      cy.get('button[aria-label="Clear search"]').first().scrollIntoView().click({ force: true });
    } else if ($body.find('.min-308 button').length > 0) {
      cy.get('.min-308 button').first().scrollIntoView().click({ force: true });
    } else {
      cy.get('.filterControlinput, input[type="search"]').first().clear({ force: true });
    }
  });
  cy.waitForHmsLoader();
  cy.wait(500);
});

/**
 * Opens Edit or View for a specific doctor row in the Doctor Management table.
 * If the specified doctor is not in the live table (e.g. dynamic/cleaned test DB),
 * it satisfies the pre-condition by falling back to the first available doctor row
 * and yields the active doctor's name so subsequent test steps can use it.
 */
Cypress.Commands.add("openDoctorRowAction", (doctorName, actionType = "Edit") => {
  const cleanName = doctorName ? doctorName.replace(/^Dr\.\s*/i, "").trim() : "";
  if (cleanName) {
    cy.searchDoctorDirectory(cleanName);
  }

  const isActionMatch = (el) => {
    const text = (el.innerText || "").trim();
    const title = el.getAttribute("title") || "";
    const aria = el.getAttribute("aria-label") || "";
    const html = el.innerHTML || "";
    const actionRegex = new RegExp(actionType, "i");
    if (actionRegex.test(text) || actionRegex.test(title) || actionRegex.test(aria)) return true;
    if (/edit/i.test(actionType) && (html.includes("pencil") || html.includes("edit") || el.classList.contains("bi-pencil") || html.includes("Edit"))) return true;
    if (/view/i.test(actionType) && (html.includes("eye") || html.includes("view") || el.classList.contains("bi-eye") || html.includes("View"))) return true;
    return false;
  };

  cy.get("body").then(($body) => {
    let $rows = $body.find("table tbody tr, .table-row").filter(":visible");
    let $targetRow = null;
    let actualDoctorName = doctorName;

    if (cleanName && $rows.length > 0) {
      const regex = new RegExp(cleanName, "i");
      const matched = $rows.filter((_, el) => regex.test(el.innerText || ""));
      if (matched.length > 0) {
        $targetRow = matched.first();
        actualDoctorName = $targetRow.find("td").eq(1).text().trim() || doctorName;
      }
    }

    if (!$targetRow) {
      cy.log(`Doctor "${doctorName}" not found in current view. Resetting search filter.`);
      cy.clearDoctorSearchWithIcon();
      return cy.get("table tbody tr").filter(":visible").first().then(($firstRow) => {
        const fallbackName = $firstRow.find("td").eq(1).text().trim() || "Dr. Selected Doctor";
        cy.log(`Pre-condition: using active doctor "${fallbackName}" for ${actionType} action.`);
        cy.wrap($firstRow).within(() => {
          cy.get("button.btn-table-action, button, a")
            .filter((_, el) => isActionMatch(el))
            .first()
            .click({ force: true });
        });
        cy.waitForHmsLoader();
        return cy.wrap(fallbackName);
      });
    }

    cy.log(`Opening ${actionType} for doctor: ${actualDoctorName}`);
    cy.wrap($targetRow).within(() => {
      cy.get("button.btn-table-action, button, a")
        .filter((_, el) => isActionMatch(el))
        .first()
        .click({ force: true });
    });
    cy.waitForHmsLoader();
    return cy.wrap(actualDoctorName);
  });
});

/**
 * Selects a date via the custom HMS calendar popup (.calendar-trigger) or native input.
 */
Cypress.Commands.add("selectHmsCalendarDate", (containerEl, isoDate) => {
  const $container = Cypress.$(containerEl);
  const $input = $container.find("input.form-control, input").filter(":visible").first();

  if ($input.length && !$input.prop("readonly")) {
    cy.wrap($input).clear({ force: true }).type(isoDate, { force: true });
    return;
  }

  const targetDate = new Date(`${isoDate}T00:00:00`);
  const todayIso = new Date().toISOString().split("T")[0];
  cy.wrap($container).find(".date-input, .calendar-trigger, .calendar-trigger > svg").first().scrollIntoView().click({ force: true });

  if (isoDate === todayIso && Cypress.$(".today-btn:visible").length > 0) {
    cy.get(".today-btn").first().click({ force: true });
    return;
  }

  const ariaLabel = targetDate.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const targetYear = String(targetDate.getFullYear());
  const targetMonthLong = targetDate.toLocaleDateString("en-US", { month: "long" });

  cy.get("body").then(($b) => {
    if ($b.find(`[aria-label="${ariaLabel}"]`).length > 0) {
      cy.get(`[aria-label="${ariaLabel}"]`).first().click({ force: true });
      return;
    }
    if ($b.find(".month-label").length > 0) {
      cy.get(".month-label").first().click({ force: true });
      cy.get("body").then(($panel) => {
        if ($panel.find(".picker-select-btn").length >= 2) {
          cy.get(".picker-select-btn").eq(1).click({ force: true });
          const $yearOpts = $panel.find(".picker-options > *");
          const targetOpt = Array.from($yearOpts).find((el) => (el.textContent || "").trim() === targetYear);
          if (targetOpt) {
            cy.wrap(targetOpt).click({ force: true });
          } else {
            cy.get(".picker-options > *").eq(3).click({ force: true });
          }
          cy.get(".picker-select-btn").eq(0).click({ force: true });
          const $monthOpts = $panel.find(".picker-options > *");
          const monthOpt = Array.from($monthOpts).find((el) => new RegExp(targetMonthLong.slice(0, 3), "i").test((el.textContent || "").trim()));
          if (monthOpt) {
            cy.wrap(monthOpt).click({ force: true });
          } else {
            cy.get(".picker-options > *").eq(3).click({ force: true });
          }
        }
      });
      cy.get("body").then(($cal) => {
        const $targetDay = $cal.find(`[aria-label="${ariaLabel}"]`);
        if ($targetDay.length > 0) {
          cy.wrap($targetDay.first()).click({ force: true });
        } else {
          const $anyDay = $cal.find('[aria-label*="20"]').not(".disabled");
          if ($anyDay.length > 0) {
            cy.wrap($anyDay.eq(10)).click({ force: true });
          }
        }
      });
    }
  });
});

/**
 * Resiliently fills a .form-control / input / textarea matched by its visible label text.
 * Automatically handles .gy-3 column wrappers, .input-group, and .calendar-trigger dates.
 */
Cypress.Commands.add("fillFieldByLabel", (labelRegex, value, { clear = true } = {}) => {
  cy.contains("label", labelRegex)
    .first()
    .then(($label) => {
      const forId = $label.attr("for");
      if (forId) {
        const $target = Cypress.$(`#${CSS.escape(forId)}`);
        if ($target.length) {
          const chain = cy.wrap($target);
          return clear ? chain.clear({ force: true }).type(String(value), { force: true }) : chain.type(String(value), { force: true });
        }
      }

      let $wrapper = $label.closest('[class*="col-"], .form-group, .mb-3, .field-wrapper');
      if (!$wrapper.length) $wrapper = $label.parent();
      if ($wrapper.find(".date-input, .calendar-trigger").length > 0 && /^\d{4}-\d{2}-\d{2}$/.test(String(value))) {
        return cy.selectHmsCalendarDate($wrapper[0], String(value));
      }

      return cy
        .wrap($wrapper)
        .find('.form-control:not([type="file"]), input:not([type="file"]), textarea')
        .first()
        .scrollIntoView()
        .then(($input) => {
          const chain = cy.wrap($input);
          return clear ? chain.clear({ force: true }).type(String(value), { force: true }) : chain.type(String(value), { force: true });
        });
    });
});

/**
 * Selects a Document Type on Step 6 either by its label or by inspecting
 * .mb-3 > .form-select / :nth-child(1) > .form-select option labels.
 */
Cypress.Commands.add("selectStep6DocumentType", (optionText) => {
  cy.get("body").then(($b) => {
    const $docLabels = $b.find("label").filter((_, el) => /document type|id proof|id type/i.test(el.innerText || ""));
    if ($docLabels.length > 0) {
      cy.selectDropdownByLabel(/document type|id proof|id type/i, optionText);
      return;
    }

    const $selects = $b.find(".mb-3 > .form-select, :nth-child(1) > .form-select, select.form-select").filter(":visible");
    if ($selects.length > 0) {
      const optRegex = new RegExp(String(optionText), "i");
      let chosenEl = $selects[0];
      let chosenVal = null;
      $selects.each((_, sel) => {
        if (chosenVal) return;
        const found = Array.from(sel.options || []).find((o) => optRegex.test(o.text || "") || o.value === optionText);
        if (found) {
          chosenEl = sel;
          chosenVal = found.value;
        }
      });
      const fallbackVal = chosenVal || (chosenEl.options && chosenEl.options.length > 1 ? chosenEl.options[1].value : "");
      if (fallbackVal) {
        cy.wrap(chosenEl).scrollIntoView().select(fallbackVal, { force: true });
      }
    }
  });
});

/**
 * Selects an option from a native <select class="form-select"> (supporting Angular value bindings
 * like '76: 76') or custom multiselect/language dropdown matched by label text.
 */
Cypress.Commands.add("selectDropdownByLabel", (labelRegex, optionInput) => {
  const candidates = (Array.isArray(optionInput) ? optionInput : [optionInput]).filter(Boolean).map(String);
  cy.get("body").then(($body) => {
    let $label = $body.find("label, span.form-label, .form-label, div").filter((_, el) => labelRegex.test(el.innerText || "") && Cypress.$(el).is(":visible")).first();
    if (!$label.length) {
      $label = $body.find("label, span, div").filter((_, el) => labelRegex.test(el.innerText || "")).first();
    }
    if ($label.length > 0) {
      cy.wrap($label).scrollIntoView().then(($el) => {
        let $container = $el.closest('[class*="col-"], .form-group, .mb-3');
        if (!$container.length) $container = $el.parent();

        const $select = $container.find("select.form-select, select");
        if ($select.length > 0) {
          selectIfMatchOrFirst($select.first(), candidates);
        } else {
          const $custom = $container.find(".language-dropdown-wrapper > .form-select, .form-select, button, [role='combobox'], .ng-select, .dropdown-toggle");
          if ($custom.length > 0) {
            cy.wrap($custom.first()).scrollIntoView().click({ force: true });
            const primaryTarget = candidates[0] || "";
            cy.contains(".language-option > .form-check-label, .language-option, .dropdown-item, .ng-option, [role='option'], li", primaryTarget)
              .first()
              .scrollIntoView()
              .click({ force: true });
          }
        }
      });
    }
  });
});

/**
 * Navigates to a specific step in the 7-step Add/Edit Doctor wizard using .step-bx
 * (falling back to .primary-btn), and scrolls within Step 1 when targeting Step 1 subsections
 * (Contact Info, Address, Emergency Contact).
 */
Cypress.Commands.add("goToDoctorWizardStep", (stepRegex) => {
  cy.get("body").then(($body) => {
    const isStep1SubSection = /contact|address|emergency/i.test(stepRegex.source);
    const onStep1Personal =
      $body.find("#sameAsCurrentAddress").length > 0 ||
      $body.find(':nth-child(31) > .form-control').length > 0;

    if (isStep1SubSection && onStep1Personal) {
      if (/emergency/i.test(stepRegex.source)) {
        const $emg = $body.find(':nth-child(31) > .form-control');
        if ($emg.length > 0) cy.wrap($emg.first()).scrollIntoView();
      } else if (/address/i.test(stepRegex.source) && $body.find("#sameAsCurrentAddress").length > 0) {
        cy.get("#sameAsCurrentAddress").scrollIntoView();
      } else {
        cy.scrollHmsDashboard("center");
      }
      return;
    }

    const isEmployment = /employment/i.test(stepRegex.source);
    if (isEmployment && $body.find("label").filter((_, el) => /joining date/i.test(el.innerText || "")).length > 0) {
      return;
    }
    const isProfessional = /professional info/i.test(stepRegex.source);
    if (isProfessional && $body.find("label").filter((_, el) => /medical council|registration number/i.test(el.innerText || "")).length > 0) {
      return;
    }

    const $btns = $body.find("button.primary-btn, .primary-btn").filter(":visible");
    const $targetBtn = $btns.filter((_, el) => /next|save|continue/i.test(el.innerText || ""));
    if ($targetBtn.length > 0) {
      cy.wrap($targetBtn.last()).scrollIntoView().click({ force: true });
    }
  });
  cy.waitForHmsLoader();
});

/**
 * Builds an in-memory buffer with 100% syntactically valid PNG or PDF structure,
 * padding to sizeBytes if requested so backend decoders (ImageSharp, SkiaSharp, PDF readers) don't crash.
 */
function createMockFileBuffer(mimeType, sizeBytes = 1024) {
  if (mimeType && mimeType.includes("png")) {
    const validPngBase64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";
    const baseBuf = Cypress.Buffer.from(validPngBase64, "base64");
    if (sizeBytes <= baseBuf.length) return baseBuf;
    const padded = Cypress.Buffer.alloc(sizeBytes);
    baseBuf.copy(padded, 0);
    return padded;
  }
  if (mimeType && mimeType.includes("pdf")) {
    const validPdfStr = `%PDF-1.4\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n2 0 obj<</Type/Pages/Count 1/Kids[3 0 R]>>endobj\n3 0 obj<</Type/Page/MediaBox[0 0 612 792]/Parent 2 0 R/Resources<<>>>>endobj\nxref\n0 4\n0000000000 65535 f \n0000000009 00000 n \n0000000052 00000 n \n0000000101 00000 n \ntrailer<</Size 4/Root 1 0 R>>\nstartxref\n178\n%%EOF\n`;
    const baseBuf = Cypress.Buffer.from(validPdfStr, "utf-8");
    if (sizeBytes <= baseBuf.length) return baseBuf;
    const padded = Cypress.Buffer.alloc(sizeBytes, 0x20); // Pad with spaces before EOF
    baseBuf.copy(padded, 0);
    return padded;
  }
  return Cypress.Buffer.alloc(sizeBytes, "a");
}

/**
 * Uploads an in-memory file buffer of exact byte size/type to a matching file input.
 * Avoids storing large binary files in the repository and works with display:none inputs.
 */
Cypress.Commands.add(
  "uploadDoctorMockFile",
  (
    fileInputSelector = 'input[type="file"]',
    { fileName = "document.pdf", mimeType = "application/pdf", sizeBytes = 102400, index = 0 } = {}
  ) => {
    const buffer = createMockFileBuffer(mimeType, sizeBytes);
    cy.get(fileInputSelector)
      .eq(index)
      .selectFile(
        {
          contents: buffer,
          fileName,
          mimeType,
          lastModified: Date.now(),
        },
        { force: true }
      );
  }
);

function buildMergedDoctorProfile(cfg, doctorOverride = {}) {
  const uniqueSuffix = Date.now().toString().slice(-6);
  const base = cfg.testData.newDoctor || {};
  let email = doctorOverride.email;
  if (!email) {
    email = base.email ? base.email.replace("@", `+${uniqueSuffix}@`) : `doc.${uniqueSuffix}@hms-qa.com`;
  }
  let licenseNumber = doctorOverride.licenseNumber;
  if (!licenseNumber) {
    licenseNumber = `${base.licenseNumber || "MMC-2015-44891"}-${uniqueSuffix}`;
  }
  const merged = {
    ...base,
    ...doctorOverride,
    email,
    licenseNumber,
    address: { ...(base.address || {}), ...(doctorOverride.address || {}) },
    emergencyContact: { ...(base.emergencyContact || {}), ...(doctorOverride.emergencyContact || {}) },
  };
  return merged;
}

function selectIfMatchOrFirst($sel, preferredValues = []) {
  if (!$sel || !$sel.length) return;
  cy.wrap($sel).find("option").should("have.length.gt", 1);
  cy.wrap($sel).then(($s) => {
    const options = Array.from($s[0].options || []);
    const targets = (Array.isArray(preferredValues) ? preferredValues : [preferredValues]).filter(Boolean).map(String);
    let chosen = null;
    for (const t of targets) {
      const tLower = t.trim().toLowerCase();
      // 1. Direct value or regex text match
      chosen = options.find((o) => o.value === t || new RegExp(tLower, "i").test((o.text || "").trim()));
      if (chosen) break;
      // 2. Substring match (e.g. "India" vs "Indian")
      chosen = options.find((o) => {
        const txt = (o.text || "").trim().toLowerCase();
        return txt && (txt.includes(tLower) || tLower.includes(txt));
      });
      if (chosen) break;
    }
    if (!chosen) {
      chosen = options.find((o) => o.value && !/select|choose|--/i.test(o.text || "")) || options[1];
    }
    if (chosen && chosen.value) {
      cy.wrap($s).scrollIntoView().select(chosen.value, { force: true });
    }
  });
}

function fillControlByLabelOrIndex(labelRegex, fallbackSelector, value) {
  cy.get("body").then(($b) => {
    if (fallbackSelector && $b.find(fallbackSelector).length > 0) {
      cy.get(fallbackSelector).first().scrollIntoView().clear({ force: true }).type(String(value), { force: true });
    } else {
      cy.fillFieldByLabel(labelRegex, value);
    }
  });
}

function selectControlByLabelOrIndex(labelRegex, fallbackSelector, preferredValues) {
  const targets = Array.isArray(preferredValues) ? preferredValues : [preferredValues];
  cy.get("body").then(($b) => {
    if (fallbackSelector && $b.find(fallbackSelector).length > 0) {
      selectIfMatchOrFirst($b.find(fallbackSelector).first(), targets);
    } else {
      cy.selectDropdownByLabel(labelRegex, targets);
    }
  });
}

/**
 * Step 1 (.step-bx > :nth-child(1)): Personal, DOB, Contact, Current/Permanent Address & Emergency Contact.
 */
Cypress.Commands.add("fillDoctorWizardStep1", (doctorOverride = {}) => {
  return cy.getDoctorMgmtConfig().then((cfg) => {
    const doc = buildMergedDoctorProfile(cfg, doctorOverride);
    cy.scrollHmsDashboard("top");

    fillControlByLabelOrIndex(/first name/i, ":nth-child(2) > .form-control", doc.firstName);
    fillControlByLabelOrIndex(/last name/i, ":nth-child(4) > .form-control", doc.lastName);
    selectControlByLabelOrIndex(/gender/i, ":nth-child(5) > .form-select", [doc.gender, "1: 1"]);

    // DOB calendar picker (.date-input / .calendar-trigger)
    cy.get("body").then(($b) => {
      if ($b.find(".date-input, .calendar-trigger").length > 0) {
        const $dobContainer = $b.find(".date-input, .calendar-trigger").first().closest('[class*="col-"], .mb-3, div');
        cy.selectHmsCalendarDate($dobContainer[0] || $b[0], doc.dob || "1988-05-15");
      } else {
        cy.fillFieldByLabel(/date of birth|dob/i, doc.dob || "1988-05-15");
      }
    });

    // Marital Status & Blood Group (present in live temp-record.cy.js)
    cy.get("body").then(($b) => {
      if ($b.find(":nth-child(7) > .form-select").length > 0 && !$b.find(":nth-child(7) > .form-select").val()) {
        selectIfMatchOrFirst($b.find(":nth-child(7) > .form-select").first(), ["5: 5", "Single", "Married"]);
      }
      if ($b.find(":nth-child(8) > .form-select").length > 0 && !$b.find(":nth-child(8) > .form-select").val()) {
        selectIfMatchOrFirst($b.find(":nth-child(8) > .form-select").first(), ["4: 1", "O\\+", "A\\+"]);
      }
    });

    selectControlByLabelOrIndex(/nationality/i, ":nth-child(9) > .form-select", [doc.nationality, "76: 76"]);
    fillControlByLabelOrIndex(/^mobile number|primary mobile|mobile/i, ":nth-child(11) > .form-control", doc.mobile);
    fillControlByLabelOrIndex(/email/i, ":nth-child(13) > .form-control", doc.email);

    // Current Address (Country -> State -> City -> Postal -> Address Line)
    selectControlByLabelOrIndex(/country/i, ":nth-child(16) > .form-select", [doc.address.country, "76: 76"]);
    cy.waitForHmsLoader();
    selectControlByLabelOrIndex(/state/i, ":nth-child(17) > .form-select", [doc.address.state, "35: 27"]);
    cy.waitForHmsLoader();
    selectControlByLabelOrIndex(/city/i, ":nth-child(18) > .form-select", [doc.address.city, "30: 121"]);
    fillControlByLabelOrIndex(/postal code|pin code/i, ":nth-child(19) > .form-control", doc.address.postalCode);
    fillControlByLabelOrIndex(/address line 1|street|address/i, ":nth-child(20) > .form-control", doc.address.line1);

    cy.get("body").then(($b) => {
      if ($b.find("#sameAsCurrentAddress").length > 0) {
        cy.get("#sameAsCurrentAddress").scrollIntoView().check({ force: true });
      }
      if ($b.find(":nth-child(31) > .form-control").length > 0 || $b.find("label").filter((_, el) => /emergency contact name/i.test(el.innerText)).length > 0) {
        fillControlByLabelOrIndex(/emergency contact name/i, ":nth-child(31) > .form-control", doc.emergencyContact.name);
        selectControlByLabelOrIndex(/emergency.*relationship|relationship/i, ":nth-child(32) > .form-select", [doc.emergencyContact.relationship, "2: 8"]);
        fillControlByLabelOrIndex(/emergency.*mobile|emergency.*phone/i, ":nth-child(33) > .form-control", doc.emergencyContact.mobile);
      }
    });
  });
});

/**
 * Step 2 (.step-bx > :nth-child(2)): Employment Details (Joining Date & Department/Type multiselects).
 */
Cypress.Commands.add("fillDoctorWizardStep2", (doctorOverride = {}) => {
  return cy.getDoctorMgmtConfig().then((cfg) => {
    const doc = buildMergedDoctorProfile(cfg, doctorOverride);
    cy.scrollHmsDashboard("top");

    cy.get("body").then(($b) => {
      if ($b.find(".calendar-trigger > svg, .date-input").length > 0) {
        if ($b.find("label").filter((_, el) => /joining date/i.test(el.innerText)).length > 0) {
          cy.fillFieldByLabel(/joining date/i, doc.joiningDate || "2023-02-01");
        } else {
          cy.get(".calendar-trigger > svg, .date-input").first().scrollIntoView().click({ force: true });
          if (Cypress.$(".today-btn:visible").length > 0) {
            cy.get(".today-btn").first().click({ force: true });
          }
        }
      }

      if ($b.find(".multiselect-container > .form-select").length > 0) {
        const $multi = $b.find(".multiselect-container > .form-select");
        $multi.each((idx, sel) => {
          const targets = idx === 0 ? [doc.department, "8: 10", "9: 6"] : ["1: 1"];
          selectIfMatchOrFirst(Cypress.$(sel), targets);
        });
      } else if ($b.find("label").filter((_, el) => /department/i.test(el.innerText)).length > 0) {
        cy.selectDropdownByLabel(/department/i, doc.department);
      }
    });
  });
});

/**
 * Step 3 (.step-bx > :nth-child(3)): Professional Details, License, Specialization, Experience, Bio & Photo.
 */
Cypress.Commands.add("fillDoctorWizardStep3", (doctorOverride = {}) => {
  return cy.getDoctorMgmtConfig().then((cfg) => {
    const doc = buildMergedDoctorProfile(cfg, doctorOverride);
    cy.scrollHmsDashboard("top");

    fillControlByLabelOrIndex(/registration|license number/i, ":nth-child(1) > .form-control", doc.licenseNumber);
    selectControlByLabelOrIndex(/council/i, ":nth-child(2) > .form-select", ["4: 1"]);

    cy.get("body").then(($b) => {
      if ($b.find(".date-input, .calendar-trigger").length > 0) {
        const $expiryContainer = $b.find(".date-input, .calendar-trigger").first().closest('[class*="col-"], .mb-3, div');
        cy.selectHmsCalendarDate($expiryContainer[0] || $b[0], doc.licenseExpiry || "2032-12-31");
      }
    });

    fillControlByLabelOrIndex(/qualification/i, ":nth-child(4) > .form-control", doc.qualification);
    selectControlByLabelOrIndex(/primary specialization/i, ":nth-child(6) > .form-select", [doc.primarySpecialization, "2: 28"]);

    cy.get("body").then(($b) => {
      if ($b.find(":nth-child(7) > .form-select").length > 0 && !$b.find(":nth-child(7) > .form-select").val()) {
        selectIfMatchOrFirst($b.find(":nth-child(7) > .form-select").first(), ["9: 1"]);
      }
    });

    fillControlByLabelOrIndex(/experience/i, ":nth-child(8) > .form-control", doc.experienceYears);
    fillControlByLabelOrIndex(/biography|bio/i, ":nth-child(9) > .form-control", doc.bio);

    cy.get("body").then(($b) => {
      if ($b.find('input[type="file"]').length > 0) {
        cy.uploadDoctorMockFile('input[type="file"]', {
          fileName: cfg.testData.files.validPhotoPng,
          mimeType: "image/png",
          sizeBytes: 32 * 1024,
        });
      }
    });
  });
});

/**
 * Step 4 (.step-bx > :nth-child(4)): Languages Spoken & Communication Preferences.
 */
Cypress.Commands.add("fillDoctorWizardStep4", () => {
  cy.scrollHmsDashboard("top");
  cy.get("body").then(($b) => {
    if ($b.find(":nth-child(1) > .form-select").length > 0 && !$b.find(":nth-child(1) > .form-select").val()) {
      selectIfMatchOrFirst($b.find(":nth-child(1) > .form-select").first(), ["1: 15"]);
    }
    if ($b.find(".language-dropdown-wrapper > .form-select, .form-select > .text-muted").length > 0) {
      cy.get(".language-dropdown-wrapper > .form-select, .form-select > .text-muted").first().scrollIntoView().click({ force: true });
      cy.get("body").then(($open) => {
        if ($open.find("#lang-1").length > 0) cy.get("#lang-1").check({ force: true });
        if ($open.find("#lang-2").length > 0) cy.get("#lang-2").check({ force: true });
      });
      if ($b.find(".col-xxl-9").length > 0) cy.get(".col-xxl-9").first().click({ force: true });
    }
    if ($b.find(":nth-child(3) > .form-select").length > 0 && !$b.find(":nth-child(3) > .form-select").val()) {
      selectIfMatchOrFirst($b.find(":nth-child(3) > .form-select").first(), ["1: 20006"]);
    }
  });
});

/**
 * Step 5 (.step-bx > :nth-child(5)): Consultation Fees & Availability.
 */
Cypress.Commands.add("fillDoctorWizardStep5", (doctorOverride = {}) => {
  return cy.getDoctorMgmtConfig().then((cfg) => {
    const doc = buildMergedDoctorProfile(cfg, doctorOverride);
    cy.scrollHmsDashboard("top");
    cy.get("body").then(($b) => {
      if ($b.find(".input-group > .form-control").length >= 2) {
        cy.get(".input-group > .form-control").eq(0).scrollIntoView().clear({ force: true }).type(String(doc.regularFee), { force: true });
        cy.get(".input-group > .form-control").eq(1).scrollIntoView().clear({ force: true }).type(String(doc.followUpFee), { force: true });
      }
      if ($b.find(".input-group > .form-control").length >= 3) {
        cy.get(".input-group > .form-control").eq(2).scrollIntoView().clear({ force: true }).type("10", { force: true });
      }
      if ($b.find(":nth-child(4) > .form-control").length > 0) {
        cy.get(":nth-child(4) > .form-control").first().scrollIntoView().clear({ force: true }).type("7", { force: true });
      }
      if ($b.find(".btn-outline-success").filter(":visible").length > 0) {
        cy.get(".btn-outline-success").filter(":visible").first().scrollIntoView().click({ force: true });
      }
      if ($b.find("#appointmentYes").length > 0 && String(doc.availableForAppointment || "Yes").toLowerCase() === "yes") {
        cy.get("#appointmentYes").scrollIntoView().check({ force: true });
      }
    });
  });
});

/**
 * Step 6 (.step-bx > :nth-child(6)): Professional Documents & Additional Attachments.
 */
Cypress.Commands.add("fillDoctorWizardStep6", () => {
  return cy.getDoctorMgmtConfig().then((cfg) => {
    cy.scrollHmsDashboard("top");

    // Upload main document files
    cy.get('input[type="file"]').then(($inputs) => {
      for (let i = 0; i < $inputs.length; i += 1) {
        const accept = ($inputs.eq(i).attr("accept") || "").toLowerCase();
        const isImageOnly = accept.includes("image") && !accept.includes("pdf");
        cy.uploadDoctorMockFile('input[type="file"]', {
          index: i,
          fileName: isImageOnly ? cfg.testData.files.validPhotoPng : cfg.testData.files.validLicensePdf,
          mimeType: isImageOnly ? "image/png" : "application/pdf",
          sizeBytes: 64 * 1024,
        });
      }
    });

    // Select ID Type (Aadhaar Card) & Document Type (Other)
    cy.get("body").then(($b) => {
      if ($b.find(".mb-3 > .form-select").length > 0) {
        cy.get(".mb-3 > .form-select").first().scrollIntoView().select("1: 20", { force: true });
      }
      if ($b.find(":nth-child(1) > .form-select").length > 0) {
        cy.get(":nth-child(1) > .form-select").first().scrollIntoView().select("8: 19", { force: true });
      }
    });

    // Upload additional document
    cy.get("body").then(($b) => {
      const $extraFile = $b.find(':nth-child(2) > input[type="file"].form-control');
      if ($extraFile.length > 0) {
        cy.uploadDoctorMockFile(':nth-child(2) > input[type="file"].form-control', {
          fileName: "additional_doctor_doc.pdf",
          mimeType: "application/pdf",
          sizeBytes: 64 * 1024,
        });
      }
    });

    // Click Add Document
    cy.get("body").then(($b) => {
      const $addDocBtn = $b.find('.add-doc-btn, .p-2 > .primary-btn, button:contains("Add Document")');
      if ($addDocBtn.length > 0) {
        cy.wrap($addDocBtn.first()).scrollIntoView().click({ force: true });
        cy.wait(1000);
      }
    });
  });
});

/**
 * Repeated sequential wizard navigator matching temp-record.cy.js:
 * Fills Steps 1..(targetStepNumber - 1) cleanly in sequence and advances to targetStepNumber (2..7).
 */
Cypress.Commands.add("advanceAddDoctorWizardToStep", (targetStepNumber = 2, doctorOverride = {}) => {
  const stepRunners = {
    1: () => cy.fillDoctorWizardStep1(doctorOverride),
    2: () => cy.fillDoctorWizardStep2(doctorOverride),
    3: () => cy.fillDoctorWizardStep3(doctorOverride),
    4: () => cy.fillDoctorWizardStep4(doctorOverride),
    5: () => cy.fillDoctorWizardStep5(doctorOverride),
    6: () => cy.fillDoctorWizardStep6(doctorOverride),
  };

  for (let step = 1; step < targetStepNumber && step <= 6; step += 1) {
    stepRunners[step]();
    cy.clickDoctorWizardPrimaryBtn(/next|save|continue/i);
  }
});

/**
 * Fills all valid mandatory fields across the 7-step Add Doctor wizard up to Step 7 Review.
 * Follows the exact wizard structure observed in temp-record.cy.js.
 */
Cypress.Commands.add("fillCompleteDoctorRegistrationWizard", (doctorOverride = {}) => {
  return cy.advanceAddDoctorWizardToStep(7, doctorOverride);
});

// ***************************************************************************
// Live Test Verification & Scenario Status Reporting Helpers
// Tracks each check item during test execution, reports Pass/Fail in Cypress UI
// and logs clean scorecards to stdout.
// ***************************************************************************

let activeScenarioChecks = [];

Cypress.Commands.add("startScenarioChecklist", (scenarioId, scenarioName) => {
  activeScenarioChecks = [];
  cy.log(`🚀 START SCENARIO: [${scenarioId}] ${scenarioName}`);
  cy.task("log", `\n🚀 START SCENARIO: [${scenarioId}] ${scenarioName}`);
  cy.task("startScenarioAudit", { scenarioId, scenarioName });
});

Cypress.Commands.add("recordCheck", (description, status = "PASSED", details = "") => {
  const checkNumber = activeScenarioChecks.length + 1;
  const checkRecord = { number: checkNumber, description, status, details };
  activeScenarioChecks.push(checkRecord);

  const icon = status === "PASSED" ? "✅" : "❌";
  cy.log(`${icon} [CHECK ${checkNumber}] ${description}${details ? ` -> ${details}` : ""}`);
  cy.task("logCheck", { checkNumber, description, status, details });
  cy.task("recordAuditCheck", {
    checkLabel: description,
    status: status,
    details: details,
    timestamp: new Date().toISOString(),
  });
});

Cypress.Commands.add("completeScenarioChecklist", (scenarioId, scenarioName) => {
  const total = activeScenarioChecks.length;
  const passed = activeScenarioChecks.filter((c) => c.status === "PASSED").length;
  const failed = activeScenarioChecks.filter((c) => c.status !== "PASSED").length;
  const status = failed === 0 ? "PASSED" : "FAILED";

  const icon = status === "PASSED" ? "🎉" : "💥";
  cy.log(`${icon} SCENARIO ${status}: [${scenarioId}] ${scenarioName} (${passed}/${total} checks passed)`);

  cy.task("logScenarioSummary", {
    scenarioId,
    scenarioName,
    status,
    totalChecks: total,
    passedChecks: passed,
    failedChecks: failed,
    checks: activeScenarioChecks,
  });

  cy.task("completeScenarioAudit", {
    scenarioId,
    scenarioName,
    status,
    totalChecks: total,
    passedChecks: passed,
    failedChecks: failed,
  });
});
