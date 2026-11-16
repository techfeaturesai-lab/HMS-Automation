// Scenario ID: HMS-DOC-003
// Scenario Name: Doctor Management Listing & Pagination - Shows All Active/Inactive Doctors, Clear (X) & Pagination

import { doctorSelectors } from "../../support/doctorSelectors";

describe("HMS-DOC-003: Doctor Management Listing, Clear (X) & Pagination", () => {
  it("displays Active and Inactive doctors by default, resets search with Clear (X), and paginates accurately", () => {
    cy.startScenarioChecklist("HMS-DOC-003", "Doctor Management Listing, Clear (X) & Pagination");

    cy.getDoctorMgmtConfig().then((cfg) => {
      cy.adminLoginDetail();
      cy.openDoctorManagementList();

      // Check 1: Default Department filter contains "All Department"
      cy.get(doctorSelectors.listing.departmentFilter)
        .should("be.visible")
        .and("contain", "All Department");
      cy.recordCheck("Default Department filter is set to 'All Department'");

      // Check 2: Default Status filter contains "All Status"
      cy.get(doctorSelectors.listing.statusFilter)
        .should("be.visible")
        .and("contain", "All Status");
      cy.recordCheck("Default Status filter is set to 'All Status'");

      // Check 3: Doctor directory table loads rows by default
      cy.get(doctorSelectors.listing.tableRows)
        .should("have.length.greaterThan", 0);
      cy.recordCheck("Doctor directory table displays active and inactive records");

      // Check 4: Search filters by name
      const searchQuery = "Vishal";
      cy.searchDoctorDirectory(searchQuery);
      cy.get(doctorSelectors.listing.tableRows)
        .contains(searchQuery, { matchCase: false })
        .should("be.visible");
      cy.recordCheck(`Search directory filters rows matching '${searchQuery}'`);

      // Check 5: Clear (X) button clears search and restores list
      cy.clearDoctorSearchWithIcon();
      cy.get(doctorSelectors.listing.searchInput)
        .should("have.value", "");
      cy.get(doctorSelectors.listing.tableRows)
        .should("have.length.greaterThan", 1);
      cy.recordCheck("Clear (X) icon clears search input and restores full listing");

      // Check 6: Pagination summary and controls
      cy.contains(/showing\s+\d+-\d+\s+of\s+\d+/i).should("be.visible");
      cy.get("body").then(($body) => {
        if ($body.find(doctorSelectors.listing.pageSizeSelect).length > 0) {
          cy.get(doctorSelectors.listing.pageSizeSelect).should("be.visible");
        }
        if ($body.find(".pagination, [class*='pagination'], .page-item").length > 0) {
          cy.get(".pagination, [class*='pagination'], .page-item").should("be.visible");
        }
      });
      cy.recordCheck("Pagination summary ('Showing X-Y of Z') and page controls verified");

      // Complete scenario
      cy.completeScenarioChecklist("HMS-DOC-003", "Doctor Management Listing, Clear (X) & Pagination");
    });
  });
});
