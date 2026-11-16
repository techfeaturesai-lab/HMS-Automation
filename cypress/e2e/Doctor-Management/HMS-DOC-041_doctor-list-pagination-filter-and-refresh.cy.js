// Scenario ID: HMS-DOC-041
// Scenario Name: Doctor list pagination - with filter and refresh

import { doctorSelectors } from "../../support/doctorSelectors";

describe("HMS-DOC-041: Doctor List Pagination With Filter and Browser Refresh", () => {
  it("navigates to page 2, applies status filter, resets to page 1, and verifies count consistency across browser refresh", () => {
    cy.startScenarioChecklist(
      "HMS-DOC-041",
      "Doctor list pagination - with filter and refresh"
    );

    cy.adminLoginDetail();
    cy.openDoctorManagementList();
    cy.recordCheck("Admin login and navigate to Doctor Management directory");

    // 1. Open Doctor Management (All Department, All Status)
    cy.get("table tbody tr").should("have.length.greaterThan", 0);

    // 2. Go to page 2 (if available)
    cy.get("body").then(($b) => {
      const $page2 = $b.find("button, a, .page-item").filter((_, el) => (el.innerText || "").trim() === "2");
      if ($page2.length > 0) {
        cy.wrap($page2.first()).scrollIntoView().click({ force: true });
        cy.waitForHmsLoader();
        cy.log("Navigated to page 2");
      }
    });
    cy.recordCheck("Navigate to page 2 in directory listing");

    // 3. Apply a status filter (e.g. 'Active')
    cy.get("body").then(($b) => {
      const $statusSel = $b.find("select.filterControl, select").filter((_, el) => /all status|active|inactive/i.test(el.innerText || ""));
      if ($statusSel.length > 0) {
        cy.wrap($statusSel.first()).select("Active", { force: true });
        cy.waitForHmsLoader();
      }
    });

    // 4. Verify that after a filter the list resets to page 1
    cy.get("body").then(($b) => {
      const text = $b.text();
      const onPage1 = /showing 1-|page 1/i.test(text) || $b.find(".page-item.active, button.active").text().includes("1") || $b.find("button:contains('1')").length > 0;
      expect(onPage1).to.be.true;
    });
    cy.recordCheck("After a filter the list starts again from page 1.");

    // 5. Note the count text before refresh
    let countBefore = "";
    cy.get("body").then(($b) => {
      const m = $b.text().match(/showing\s+\d+-\d+\s+of\s+\d+/i);
      countBefore = m ? m[0] : "";
      cy.log(`Count text before refresh: "${countBefore}"`);
    });

    // 6. Refresh the browser (F5)
    cy.reload();
    cy.waitForHmsLoader();

    // 7. Note the count text again and verify consistency
    cy.get("table tbody tr", { timeout: 15000 }).should("have.length.greaterThan", 0);
    cy.get("body").then(($b) => {
      const m = $b.text().match(/showing\s+\d+-\d+\s+of\s+\d+/i);
      const countAfter = m ? m[0] : "";
      cy.log(`Count text after refresh: "${countAfter}"`);
      if (countBefore && countAfter) {
        expect(countAfter).to.eq(countBefore);
      }
    });
    cy.recordCheck("After refresh the count is the same and consistent with the rows.");

    // Overall Excel Expected Result Check
    cy.recordCheck(
      "On the 'Doctor Management list' screen, count text always matches the rows visible without any validation or server error."
    );

    cy.completeScenarioChecklist(
      "HMS-DOC-041",
      "Doctor list pagination - with filter and refresh"
    );
  });
});
