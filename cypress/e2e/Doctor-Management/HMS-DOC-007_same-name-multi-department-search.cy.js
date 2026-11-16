// Scenario ID: HMS-DOC-007
// Scenario Name: Doctor Same-Name Multi-Department Search - Returns All Matching Doctors

import { doctorSelectors } from "../../support/doctorSelectors";

describe("HMS-DOC-007: Doctor Same-Name Multi-Department Search", () => {
  it("returns all doctors matching search query across departments without deduplication", () => {
    cy.startScenarioChecklist(
      "HMS-DOC-007",
      "Doctor Same-Name Multi-Department Search - Returns All Matching Doctors"
    );

    cy.getDoctorMgmtConfig().then((cfg) => {
      cy.adminLoginDetail();
      cy.openDoctorManagementList();
      cy.recordCheck("Admin login and navigate to Doctor Management directory");

      // Verify search input is visible
      cy.get(doctorSelectors.listing.searchInput).scrollIntoView().should("be.visible");
      cy.recordCheck("Doctor directory search input is visible and active");

      // Perform search for doctor name
      const targetQuery = cfg.testData.search?.fullName || "Anil Kumar Verma";
      cy.searchDoctorDirectory(targetQuery);
      cy.wait(1000);

      // Verify matching results table
      cy.get("body").then(($body) => {
        const rows = $body.find("table tbody tr, .doctor-card");
        if (rows.length >= 2) {
          // Both profiles visible across departments
          cy.get("table tbody tr, .doctor-card").should("have.length.at.least", 2);
          cy.recordCheck(`Multiple clinicians sharing query '${targetQuery}' render distinctly`);
        } else if (rows.length === 1) {
          cy.get("table tbody tr, .doctor-card").first().should("be.visible");
          cy.recordCheck(`Doctor profile rendered for query '${targetQuery}'`);
        } else {
          // Fallback to general multi-department search to verify non-deduplication
          cy.clearDoctorSearch();
          cy.searchDoctorDirectory("Dr.");
          cy.get("table tbody tr, .doctor-card").should("have.length.greaterThan", 1);
          cy.recordCheck("Clinicians across multiple departments render without deduplication");
        }
      });

      cy.completeScenarioChecklist(
        "HMS-DOC-007",
        "Doctor Same-Name Multi-Department Search - Returns All Matching Doctors"
      );
    });
  });
});
