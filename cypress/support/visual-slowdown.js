// *****************************************************************************
// Visual Tracker & Slow-Motion Execution Helper for Cypress
// *****************************************************************************

const COMMAND_DELAY = Cypress.env("ACTION_DELAY") !== undefined ? Number(Cypress.env("ACTION_DELAY")) : 600;
const TYPE_DELAY = Cypress.env("TYPE_DELAY") !== undefined ? Number(Cypress.env("TYPE_DELAY")) : 70;

/**
 * Injects or retrieves the floating on-screen HUD badge.
 */
function getOrInjectHUD() {
  try {
    const win = Cypress.$(cy.state("window"));
    if (!win || !win.document) return null;
    const doc = win.document;

    let hud = doc.getElementById("cypress-live-hud");
    if (!hud && doc.body) {
      hud = doc.createElement("div");
      hud.id = "cypress-live-hud";
      hud.innerHTML = `
        <div style="
          position: fixed;
          top: 14px;
          right: 20px;
          z-index: 99999999;
          background: rgba(15, 23, 42, 0.94);
          color: #f8fafc;
          padding: 10px 16px;
          border-radius: 10px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.45);
          border: 1.5px solid #38bdf8;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, monospace;
          font-size: 13px;
          max-width: 440px;
          pointer-events: none;
          backdrop-filter: blur(8px);
          transition: all 0.2s ease-in-out;
        ">
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
            <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: #22c55e; box-shadow: 0 0 10px #22c55e;"></span>
            <strong style="color: #38bdf8; font-size: 13px; letter-spacing: 0.5px;">HMS LIVE TRACKER</strong>
          </div>
          <div id="hud-test-title" style="color: #94a3b8; font-size: 11px; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-bottom: 6px;">Ready</div>
          <div id="hud-action-text" style="color: #f8fafc; font-weight: 600; font-size: 12px; line-height: 1.3;">Initializing...</div>
        </div>
      `;
      doc.body.appendChild(hud);
    }
    return hud;
  } catch (e) {
    return null;
  }
}

/**
 * Updates the on-screen HUD text.
 */
function updateHUD(actionText) {
  try {
    getOrInjectHUD();
    const win = Cypress.$(cy.state("window"));
    if (!win || !win.document) return;
    const doc = win.document;

    const titleEl = doc.getElementById("hud-test-title");
    const actionEl = doc.getElementById("hud-action-text");
    if (titleEl && Cypress.currentTest) {
      titleEl.innerText = Cypress.currentTest.titlePath.join(" › ");
    }
    if (actionEl) {
      actionEl.innerText = actionText;
    }
  } catch (e) {}
}

/**
 * Highlights a target DOM element with a bright glowing outline.
 */
function highlightElement($el, label = "") {
  try {
    if (!$el || !$el.length) return;
    $el.css({
      outline: "3px solid #f43f5e",
      outlineOffset: "2px",
      boxShadow: "0 0 16px rgba(244, 63, 94, 0.9)",
      transition: "outline 0.15s ease, box-shadow 0.15s ease",
    });
    if (label) updateHUD(label);
  } catch (e) {}
}

/**
 * Clears highlight from a target DOM element.
 */
function unhighlightElement($el) {
  try {
    if (!$el || !$el.length) return;
    $el.css({
      outline: "",
      outlineOffset: "",
      boxShadow: "",
    });
  } catch (e) {}
}

// Hook test start
beforeEach(() => {
  cy.on("window:load", () => {
    getOrInjectHUD();
    updateHUD("Page Ready");
  });
});

// Overwrite `visit`
Cypress.Commands.overwrite("visit", (originalFn, url, options) => {
  updateHUD(`🌐 Navigating: ${url}`);
  Cypress.log({ name: "TRACKER", message: `🌐 Navigating to ${url}` });
  originalFn(url, options);
  return cy.wait(COMMAND_DELAY);
});

// Overwrite `click`
Cypress.Commands.overwrite("click", (originalFn, subject, ...args) => {
  const tagName = (subject.prop("tagName") || "element").toLowerCase();
  const text = (subject.text() || subject.val() || "").trim().slice(0, 30);
  const desc = `👆 Clicking <${tagName}> "${text}"`;

  highlightElement(subject, desc);
  Cypress.log({ name: "TRACKER", message: desc });

  originalFn(subject, ...args);

  return cy.wait(COMMAND_DELAY).then(() => {
    unhighlightElement(subject);
    return subject;
  });
});

// Overwrite `type`
Cypress.Commands.overwrite("type", (originalFn, subject, text, options = {}) => {
  const desc = `⌨️ Typing "${text}"`;
  highlightElement(subject, desc);
  Cypress.log({ name: "TRACKER", message: desc });

  const customOptions = Object.assign({ delay: TYPE_DELAY }, options);
  originalFn(subject, text, customOptions);

  return cy.wait(COMMAND_DELAY).then(() => {
    unhighlightElement(subject);
    return subject;
  });
});

// Overwrite `clear`
Cypress.Commands.overwrite("clear", (originalFn, subject, options) => {
  const desc = `🧹 Clearing input`;
  highlightElement(subject, desc);
  Cypress.log({ name: "TRACKER", message: desc });

  originalFn(subject, options);

  return cy.wait(COMMAND_DELAY / 2).then(() => {
    unhighlightElement(subject);
    return subject;
  });
});
