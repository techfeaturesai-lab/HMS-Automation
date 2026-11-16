describe("Dump sidebar", () => {
  it("dumps all sidebar menu items", () => {
    cy.visit("");
    cy.get(".header-staff-btn, button:contains('Staff Login')", { timeout: 30000 }).click({ force: true });
    cy.get("#staffNumberInput").clear().type("HMS-1");
    cy.get("#staffPasswordInput").clear().type("Admin@123", { log: false });
    cy.get("button.modern-submit-btn, button[type='submit']").click();
    cy.url({ timeout: 20000 }).should("include", "/admin");
    cy.get(".nav-list, aside, .sidebar").then(($s) => {
      const items = [];
      $s.find("a, li, .sidebar-link").each((_, el) => {
        items.push({
          tag: el.tagName,
          text: (el.innerText || "").trim().replace(/\n+/g, " | "),
          href: el.getAttribute("href") || el.querySelector("a")?.getAttribute("href") || ""
        });
      });
      cy.task("log", "Sidebar items: " + JSON.stringify(items, null, 2));
    });
  });
});
