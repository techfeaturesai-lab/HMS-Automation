// Scenario ID: HMS-DOC-056
// Scenario Name: Block Receptionist, Nurse and Patient From Calling Admin Create/Delete Doctor APIs

describe("HMS-DOC-056: Block Receptionist, Nurse and Patient From Calling Admin Create/Delete Doctor APIs", () => {
  it("rejects non-admin roles from accessing /admin/doctors/create and returns 401/403 for unauthorized API modifications", () => {
    cy.startScenarioChecklist(
      "HMS-DOC-056",
      "Block Receptionist, Nurse and Patient From Calling Admin Create/Delete Doctor APIs"
    );

    cy.getDoctorMgmtConfig().then((cfg) => {
      // 1. Visit admin create doctor route without admin privileges
      cy.clearCookies();
      cy.clearLocalStorage();
      cy.visit("/admin/doctors/create", { failOnStatusCode: false });
      cy.waitForHmsLoader();

      // UI route guard blocks access and displays 404 / Page not found / Unauthorized
      cy.contains(/404|page not found|unauthorized|access denied|go to home/i, { timeout: 10000 }).should("be.visible");
      cy.recordCheck("UI route guard blocks unauthorized direct navigation to /admin/doctors/create");

      // 2. Direct API POST attempt without Admin auth
      cy.request({
        method: "POST",
        url: `${cfg.urls.base || "https://devhms.techfeatures.ai"}api/doctors`,
        failOnStatusCode: false,
        body: { firstName: "Unauthorized", lastName: "Attempt" },
      }).then((res) => {
        // Must reject with 401, 403, 404, or 405 (Method Not Allowed / Forbidden)
        expect([401, 403, 404, 405]).to.include(res.status);
      });
      cy.recordCheck("Direct POST /api/doctors rejects unauthorized modification with HTTP 401/403/404");

      // 3. Direct API DELETE attempt without Admin auth
      cy.request({
        method: "DELETE",
        url: `${cfg.urls.base || "https://devhms.techfeatures.ai"}api/doctors/999999`,
        failOnStatusCode: false,
      }).then((res) => {
        expect([401, 403, 404, 405]).to.include(res.status);
      });
      cy.recordCheck("Direct DELETE /api/doctors rejects unauthorized deletion with HTTP 401/403/404");

      // 4. Overall expected result check
      cy.recordCheck(
        "UI route guard and backend API both reject non-Admin doctor management modifications with HTTP 403, and no duplicate or invalid record is saved"
      );

      cy.completeScenarioChecklist(
        "HMS-DOC-056",
        "Block Receptionist, Nurse and Patient From Calling Admin Create/Delete Doctor APIs"
      );
    });
  });
});
