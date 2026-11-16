// ***************************************************************************
// QA Audit Tracker & Live Traceability System
// Captures and logs every single verification checkpoint matching Excel Expected Results.
// Supports: cy.auditCheck(scenarioId, checkLabel, callback)
// ***************************************************************************

let activeCheckContext = null;
let activeScenarioContext = null;

Cypress.Commands.add("setAuditScenario", (scenarioId, scenarioName) => {
  activeScenarioContext = { scenarioId, scenarioName };
  cy.task("startScenarioAudit", { scenarioId, scenarioName });
});

/**
 * Executes a verification checkpoint, tracks execution in audit log,
 * and records expected vs actual result on PASS or FAIL.
 * 
 * @param {string} scenarioId - e.g. "HMS-DOC-001"
 * @param {string} checkLabel - Requirement description from Excel Expected Result
 * @param {Function} [callback] - Optional Cypress assertion callback
 */
Cypress.Commands.add("auditCheck", (scenarioId, checkLabel, callback) => {
  const currentId = scenarioId || activeScenarioContext?.scenarioId || "GENERAL";
  activeCheckContext = { scenarioId: currentId, checkLabel, startTime: Date.now() };

  cy.log(`📋 [AUDIT CHECK] [${currentId}] ${checkLabel}`);
  cy.task("recordAuditCheck", {
    scenarioId: currentId,
    checkLabel,
    status: "IN_PROGRESS",
    timestamp: new Date().toISOString(),
  });

  if (typeof callback === "function") {
    // Run the assertion block
    callback();
  }

  // Once all chained commands in this step succeed:
  cy.then(() => {
    cy.task("recordAuditCheck", {
      scenarioId: currentId,
      checkLabel,
      status: "PASSED",
      timestamp: new Date().toISOString(),
    });
    cy.task("logCheck", {
      description: checkLabel,
      status: "PASSED",
      details: "Verified successfully",
    });
    activeCheckContext = null;
  });
});

// Hook into Cypress failures to capture exact failed checkpoint, expected vs actual, and root cause
Cypress.on("fail", (error, runnable) => {
  if (activeCheckContext) {
    const details = {
      scenarioId: activeCheckContext.scenarioId,
      checkLabel: activeCheckContext.checkLabel,
      status: "FAILED",
      errorMessage: error.message || "Assertion failed",
      expected: error.expected !== undefined ? String(error.expected) : "Expected condition to be met",
      actual: error.actual !== undefined ? String(error.actual) : "Failed or timed out",
      stack: error.stack ? error.stack.split("\n").slice(0, 5).join("\n") : "",
      timestamp: new Date().toISOString(),
    };

    // Synchronously queue recording task if Cypress is still processing
    try {
      cy.task("recordAuditCheck", details);
      cy.task("logCheck", {
        description: activeCheckContext.checkLabel,
        status: "FAILED",
        details: error.message,
      });
    } catch (e) {
      // ignore secondary errors during fail handler
    }
    activeCheckContext = null;
  }
  throw error;
});

