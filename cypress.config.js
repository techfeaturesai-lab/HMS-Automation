import { defineConfig } from "cypress";
import fs from "fs";
import path from "path";
import { execSync } from "child_process";

const auditFilePath = path.resolve("cypress/reports/audit_data.json");

function loadAuditData() {
  try {
    if (fs.existsSync(auditFilePath)) {
      return JSON.parse(fs.readFileSync(auditFilePath, "utf8"));
    }
  } catch (e) {
    console.error("Failed to read audit data:", e);
  }
  return { scenarios: {}, lastUpdated: new Date().toISOString() };
}

function saveAuditData(data) {
  try {
    const dir = path.dirname(auditFilePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(auditFilePath, JSON.stringify(data, null, 2), "utf8");
  } catch (e) {
    console.error("Failed to write audit data:", e);
  }
}

let auditStore = loadAuditData();
let currentScenarioId = null;

export default defineConfig({
  e2e: {
    baseUrl: "https://devhms.techfeatures.ai/",
    experimentalStudio: true,
    specPattern: "cypress/e2e/**/*.cy.{js,jsx,ts,tsx}",
    viewportWidth: 1366,
    viewportHeight: 768,
    chromeWebSecurity: false,
    defaultCommandTimeout: 20000,
    pageLoadTimeout: 120000,
    retries: {
      runMode: 2,
      openMode: 0,
    },
    setupNodeEvents(on, config) {
      on("before:browser:launch", (browser = {}, launchOptions) => {
        if (browser.name === "chrome") {
          launchOptions.args.push("--ssl-version-max=tls1.2");
          launchOptions.args.push("--disable-features=PostQuantumCECPQ2,TLS13EarlyData");
          launchOptions.args.push("--disable-gpu");
        }
        return launchOptions;
      });
      on("task", {
        log(message) {
          console.log(message);
          return null;
        },
        logCheck({ checkNumber, description, status, details }) {
          const isPass = status === "PASSED";
          const icon = isPass ? "  [✔ PASSED]" : "  [✖ FAILED]";
          const checkText = checkNumber ? ` Check ${checkNumber}:` : "";
          console.log(`${icon}${checkText} ${description}${details ? ` -> ${details}` : ""}`);
          return null;
        },
        logScenarioSummary({ scenarioId, scenarioName, status, totalChecks, passedChecks, failedChecks, checks }) {
          const border = "=".repeat(75);
          const header = status === "PASSED" 
            ? `✔ SCENARIO PASSED: [${scenarioId}] ${scenarioName}`
            : `✖ SCENARIO FAILED: [${scenarioId}] ${scenarioName}`;
          
          console.log(`\n${border}`);
          console.log(` ${header}`);
          console.log("-".repeat(75));
          if (Array.isArray(checks)) {
            checks.forEach((c, idx) => {
              const icon = c.status === "PASSED" ? "✔" : "✖";
              console.log(`  [${icon}] (${idx + 1}/${checks.length}) ${c.description || c.checkLabel} [${c.status}]`);
            });
          }
          console.log("-".repeat(75));
          console.log(` Result: ${passedChecks}/${totalChecks} checks passed | Final: ${status}`);
          console.log(`${border}\n`);
          return null;
        },
        startScenarioAudit({ scenarioId, scenarioName }) {
          auditStore = loadAuditData();
          currentScenarioId = scenarioId;
          if (!auditStore.scenarios[scenarioId]) {
            auditStore.scenarios[scenarioId] = {
              scenarioId,
              scenarioName,
              status: "RUNNING",
              startTime: new Date().toISOString(),
              checks: [],
            };
          } else {
            auditStore.scenarios[scenarioId].scenarioName = scenarioName || auditStore.scenarios[scenarioId].scenarioName;
            auditStore.scenarios[scenarioId].status = "RUNNING";
          }
          saveAuditData(auditStore);
          return null;
        },
        recordAuditCheck(data) {
          auditStore = loadAuditData();
          const scId = data.scenarioId || currentScenarioId || "GENERAL";
          if (!auditStore.scenarios[scId]) {
            auditStore.scenarios[scId] = {
              scenarioId: scId,
              status: "RUNNING",
              startTime: new Date().toISOString(),
              checks: [],
            };
          }
          const checks = auditStore.scenarios[scId].checks;
          const label = data.checkLabel || data.description;
          const existingIdx = checks.findIndex((c) => (c.checkLabel || c.description) === label);
          if (existingIdx >= 0) {
            checks[existingIdx] = { ...checks[existingIdx], ...data };
          } else {
            checks.push(data);
          }
          saveAuditData(auditStore);
          return null;
        },
        completeScenarioAudit({ scenarioId, scenarioName, status, totalChecks, passedChecks, failedChecks }) {
          auditStore = loadAuditData();
          const scId = scenarioId || currentScenarioId;
          if (scId && auditStore.scenarios[scId]) {
            auditStore.scenarios[scId].status = status;
            auditStore.scenarios[scId].totalChecks = totalChecks;
            auditStore.scenarios[scId].passedChecks = passedChecks;
            auditStore.scenarios[scId].failedChecks = failedChecks;
            auditStore.scenarios[scId].endTime = new Date().toISOString();
          }
          saveAuditData(auditStore);
          return null;
        },
      });

      on("after:spec", (spec, results) => {
        auditStore = loadAuditData();
        const specName = path.basename(spec.relative || spec.name || "");
        const match = specName.match(/(HMS-DOC-\d{3})/);
        const specScenarioId = match ? match[1] : currentScenarioId;

        if (results && results.stats && results.stats.failures > 0 && specScenarioId) {
          if (auditStore.scenarios[specScenarioId] && auditStore.scenarios[specScenarioId].status === "RUNNING") {
            auditStore.scenarios[specScenarioId].status = "FAILED";
            saveAuditData(auditStore);
          }
        }
        try {
          execSync("node scripts/generate-qa-report.mjs", { stdio: "inherit" });
        } catch (e) {
          console.warn("[QA-REPORT] Post-spec report generation failed:", e.message);
        }
      });

      on("after:run", (results) => {
        try {
          execSync("node scripts/generate-qa-report.mjs", { stdio: "inherit" });
        } catch (e) {
          console.warn("[QA-REPORT] Post-run report generation failed:", e.message);
        }
      });

      return config;
    },
  },
});
