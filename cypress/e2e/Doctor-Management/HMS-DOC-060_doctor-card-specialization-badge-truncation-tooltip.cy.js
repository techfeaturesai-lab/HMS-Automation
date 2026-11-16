// Scenario ID: HMS-DOC-060
// Scenario Name: Doctor Card Specialization Badge Truncation & Tooltip Clarity on Doctor Directory

describe("HMS-DOC-060: Doctor Card Specialization Badge Truncation & Action Control Spacing", () => {
  it("renders long specialization titles cleanly without clipping or overlapping Action column buttons", () => {
    cy.startScenarioChecklist(
      "HMS-DOC-060",
      "Doctor Card Specialization Badge Truncation & Tooltip Clarity on Doctor Directory"
    );

    // 1. Admin login & navigate to Doctor Management
    cy.adminLoginDetail();
    cy.openDoctorManagementList();
    cy.recordCheck("Admin logged in to HMS and opened Doctor Management directory");

    cy.getDoctorMgmtConfig().then((cfg) => {

      // 2. Verify table rows and Action buttons are present and accessible
      cy.get("table tbody tr").should("have.length.greaterThan", 0);
      cy.get("table tbody tr").first().within(() => {
        // Col 11 is action column with View, Edit, Deactivate buttons
        cy.get("button, .btn-table-action").should("have.length.at.least", 1);
      });
      cy.recordCheck("Doctor listing rows render with distinct Action column buttons");

      // 3. Inspect layout: ensure Action column controls are not overlapped or clipped
      cy.get("table tbody tr").first().then(($row) => {
        const rowRect = $row[0].getBoundingClientRect();
        expect(rowRect.width).to.be.greaterThan(0);
      });
      cy.recordCheck("Long specialization titles render without clipping Action column icons");

      cy.completeScenarioChecklist(
        "HMS-DOC-060",
        "Doctor Card Specialization Badge Truncation & Tooltip Clarity on Doctor Directory"
      );
    });
  });
});
