// ***************************************************************************
// Centralized Configuration Loader for Doctor Management Automation Suite
// Edit cypress/fixtures/doctorManagementConfig.json (or pass Cypress.env)
// to update emails, staff numbers, passwords, URLs, or test data in one place.
// ***************************************************************************

let cachedConfig = null;

/**
 * Deep-merges Cypress.env overrides onto the loaded fixture config.
 */
function mergeOverrides(baseConfig) {
  const envCreds = Cypress.env("credentials") || {};
  const envUrls = Cypress.env("urls") || {};
  const envTestData = Cypress.env("testData") || {};

  return {
    ...baseConfig,
    urls: { ...baseConfig.urls, ...envUrls },
    credentials: {
      ...baseConfig.credentials,
      admin: { ...baseConfig.credentials.admin, ...(envCreds.admin || {}) },
      doctor: { ...baseConfig.credentials.doctor, ...(envCreds.doctor || {}) },
      receptionist: {
        ...baseConfig.credentials.receptionist,
        ...(envCreds.receptionist || {}),
      },
      nurse: { ...baseConfig.credentials.nurse, ...(envCreds.nurse || {}) },
      patient: { ...baseConfig.credentials.patient, ...(envCreds.patient || {}) },
    },
    testData: { ...baseConfig.testData, ...envTestData },
  };
}

/**
 * Cypress command to load cypress/fixtures/doctorManagementConfig.json
 * and return the merged configuration object.
 */
Cypress.Commands.add("getDoctorMgmtConfig", () => {
  if (cachedConfig) {
    return cy.wrap(mergeOverrides(cachedConfig), { log: false });
  }
  return cy.fixture("doctorManagementConfig.json").then((cfg) => {
    cachedConfig = cfg;
    return mergeOverrides(cfg);
  });
});

/**
 * Helper to clear cached config if needed between specs.
 */
export function resetDoctorMgmtConfigCache() {
  cachedConfig = null;
}

