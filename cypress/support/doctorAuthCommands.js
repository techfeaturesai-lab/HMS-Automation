// ***************************************************************************
// Separate Authentication Functions for Doctor Management Suite
// Kept completely independent from commands.js (cy.login) so other developers'
// Front-Office login scripts remain untouched and conflict-free.
// Credentials & selectors are sourced from cypress/fixtures/doctorManagementConfig.json
// and cypress/support/doctorSelectors.js.
// ***************************************************************************

import { doctorSelectors } from "./doctorSelectors";

/**
 * Shared internal login executor for staff/admin/doctor modal login.
 * Observed UI flow: visit /home -> .header-staff-btn / .menu-btn -> #staffNumberInput ->
 * #staffPasswordInput -> .modern-submit-btn.
 * @param {object} account - Account details (staffNumber, email, password, dashboardUrlPart)
 * @param {object} cfg - Full resolved config object from doctorManagementConfig.json
 */
function executePortalLogin(account) {
  const loginIdentifier = account.staffNumber || account.email;

  cy.visit("/home");
  cy.get(".loader-backdrop", { timeout: 20000 }).should("not.exist");

  // Wait for EITHER the Staff Login button OR the logged-in profile/sidebar to appear
  cy.get(".header-staff-btn, button:contains('Staff Login'), .profile-name, .sidebar, aside", { timeout: 45000 }).then(($el) => {
    if ($el.is(".profile-name, .sidebar, aside") || $el.find(".profile-name, .sidebar, aside").length > 0) {
      cy.log("User is already authenticated");
      return;
    }

    // Otherwise click the login trigger
    cy.wrap($el).first().click({ force: true });

    cy.get("#staffNumberInput", { timeout: 20000 }).should("be.visible").clear().type(loginIdentifier);
    cy.get("#staffPasswordInput", { timeout: 20000 }).should("be.visible").clear().type(account.password, { log: false });

    cy.get("button.modern-submit-btn, button[type='submit']", { timeout: 20000 }).click();
    cy.get(".loader-backdrop", { timeout: 25000 }).should("not.exist");

    // Allow Angular router to finish navigation to dashboard
    cy.url({ timeout: 20000 }).should("match", /dashboard|admin|doctor|frontoffice/i);
  });
}

/**
 * Dedicated Hospital Administrator Login function for Doctor Management scripts.
 */
Cypress.Commands.add("adminLoginDetail", (overrides = {}) => {
  const adminAccount = {
    staffNumber: "HMS-1",
    email: "admin@hms.com",
    password: "Admin@123",
    dashboardUrlPart: "/admin/admindashboard",
    ...overrides,
  };

  executePortalLogin(adminAccount);
  return cy.wrap(adminAccount, { log: false });
});

/**
 * Dedicated Doctor Login function (separate from cy.login).
 */
Cypress.Commands.add("doctorLoginDetail", (overrides = {}) => {
  const doctorAccount = {
    staffNumber: "HMS-2",
    email: "doctor@hms.com",
    password: "Admin@123",
    dashboardUrlPart: "",
    ...overrides,
  };

  executePortalLogin(doctorAccount);
  return cy.wrap(doctorAccount, { log: false });
});

/**
 * Generic role login helper for RBAC and multi-role E2E scenarios
 * (supports: 'admin', 'doctor', 'receptionist', 'nurse').
 */
Cypress.Commands.add("roleLoginDetail", (roleKey, overrides = {}) => {
  return cy.getDoctorMgmtConfig().then((cfg) => {
    const baseRole = cfg.credentials[roleKey];
    if (!baseRole) {
      throw new Error(`Unknown roleKey "${roleKey}" in doctorManagementConfig.json`);
    }
    const account = { ...baseRole, ...overrides };
    executePortalLogin(account, cfg);
    return cy.wrap(account, { log: false });
  });
});

/**
 * Logs out of the current HMS portal session cleanly using .more-icon -> .logout-link.
 */
Cypress.Commands.add("logoutDoctorSuite", () => {
  return cy.getDoctorMgmtConfig().then((cfg) => {
    const { selectors, timeouts } = cfg;
    cy.get("body").then(($body) => {
      if ($body.find(selectors.logoutBtn).filter(":visible").length === 0) {
        const $trigger = $body.find(selectors.logoutTrigger).filter(":visible");
        if ($trigger.length > 0) {
          cy.wrap($trigger.first()).click({ force: true });
        }
      }
      if (Cypress.$(selectors.logoutBtn).filter(":visible").length > 0) {
        cy.get(selectors.logoutBtn, { timeout: timeouts.default })
          .filter(":visible")
          .first()
          .click({ force: true });
      } else {
        cy.contains("button, a, li, span", /logout|sign out/i, { timeout: timeouts.default })
          .filter(":visible")
          .first()
          .click({ force: true });
      }
    });
    cy.get(selectors.loader, { timeout: timeouts.loader }).should("not.exist");
  });
});
