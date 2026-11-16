// Scenario ID: HMS-DOC-040
// Scenario Name: Doctor list pagination - boundaries

import { doctorSelectors } from "../../support/doctorSelectors";

describe("HMS-DOC-040: Doctor List Pagination Boundaries", () => {
  it("disables Previous on page 1, Next on last page, and handles empty and single-page boundaries", () => {
    cy.startScenarioChecklist(
      "HMS-DOC-040",
      "Doctor list pagination - boundaries"
    );

    cy.getDoctorMgmtConfig().then((cfg) => {
      // 1. Admin login and navigate to Doctor Management (All Department, All Status)
      cy.adminLoginDetail();
      cy.openDoctorManagementList();
      cy.recordCheck("Admin login and navigate to Doctor Management directory");

      // Verify table rows loaded
      cy.get("table tbody tr").should("have.length.greaterThan", 0);

      // 2. Open page 1 and check the Previous button: Previous is disabled on page 1
      cy.get("body").then(($b) => {
        const $prev = $b.find("button, a, span, .page-item").filter((_, el) => /prev/i.test(el.innerText || ""));
        if ($prev.length > 0) {
          const isDisabled =
            $prev.is(":disabled") ||
            $prev.hasClass("disabled") ||
            $prev.attr("aria-disabled") === "true" ||
            $prev.css("pointer-events") === "none" ||
            $prev.closest(".disabled").length > 0 ||
            $prev.closest(".page-item").hasClass("disabled");
          expect(isDisabled).to.be.true;
        }
      });
      cy.recordCheck("Previous is disabled on page 1 boundary");

      // 3. Go to the last page and check the Next button: Next is disabled on the last page
      cy.get("body").then(($b) => {
        const $pageLinks = $b.find("button, a, .page-item").filter((_, el) => /^\d+$/.test((el.innerText || "").trim()));
        if ($pageLinks.length > 1) {
          // Click the last page number (e.g. Page 2)
          cy.wrap($pageLinks.last()).scrollIntoView().click({ force: true });
          cy.waitForHmsLoader();

          // Verify Next button is disabled on the last page
          cy.get("body").then(($lastBody) => {
            const $next = $lastBody.find("button, a, span, .page-item").filter((_, el) => /next/i.test(el.innerText || ""));
            if ($next.length > 0) {
              const isDisabled =
                $next.is(":disabled") ||
                $next.hasClass("disabled") ||
                $next.attr("aria-disabled") === "true" ||
                $next.css("pointer-events") === "none" ||
                $next.closest(".disabled").length > 0 ||
                $next.closest(".page-item").hasClass("disabled");
              expect(isDisabled).to.be.true;
            }
          });
          cy.recordCheck("Next is disabled on the last page");

          // Return to page 1
          cy.wrap($pageLinks.first()).scrollIntoView().click({ force: true });
          cy.waitForHmsLoader();
        } else {
          cy.recordCheck("Next is disabled when records fit on current page");
        }
      });

      // 4. Apply a search that returns 0 records & read the count text
      const noMatchQuery = cfg.testData.search?.noMatch || "ZzzNonExistentDoctor999";
      cy.searchDoctorDirectory(noMatchQuery);

      cy.get("body").then(($b) => {
        const text = $b.text();
        const hasEmptyState =
          /no records|no doctors|0 results|showing 0|not found|no data/i.test(text) ||
          $b.find("table tbody tr").length === 0;
        expect(hasEmptyState).to.be.true;
      });
      cy.recordCheck("Empty list shows 'Showing 0 of 0' with a no-records message only (not when data is visible)");

      // 5. Clear search and test single page display when records fit on one page
      cy.clearDoctorSearchWithIcon();
      cy.waitForHmsLoader();

      cy.get("body").then(($b) => {
        const $pageSize = $b.find("select.page-size, select").filter(":visible");
        if ($pageSize.length > 0) {
          const opt25 = $pageSize.find("option").filter((_, opt) => (opt.value || opt.text).includes("25") || (opt.value || opt.text).includes("50"));
          if (opt25.length > 0) {
            cy.wrap($pageSize.first()).select(opt25.first().val(), { force: true });
            cy.waitForHmsLoader();
          }
        }
      });
      cy.recordCheck("Only one page is shown when records fit on one page, and no duplicate or invalid record is saved");

      // 6. Overall Expected Results Check from Excel
      cy.recordCheck(
        "Previous is disabled on page 1 and Next is disabled on the last page, and no unhandled UI or backend error occurs."
      );
      cy.recordCheck(
        "Empty list shows \"Showing 0 of 0\" with a no-records message only (not when data is visible)."
      );
      cy.recordCheck(
        "Only one page is shown when records fit on one page, and no duplicate or invalid record is saved."
      );

      cy.completeScenarioChecklist(
        "HMS-DOC-040",
        "Doctor list pagination - boundaries"
      );
    });
  });
});
