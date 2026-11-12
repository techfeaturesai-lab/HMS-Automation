describe("HMS Receptionist Front Office Dashboard", () => {
  it("dumps sidebar profile html", () => {
    cy.login("HMS-4", "Admin@123");
    cy.get("body").then(($body) => {
      const sidebar = $body.find('aside, .sidebar, [class*="sidebar"]');
      cy.writeFile("cypress/fixtures/sidebar_dump.html", sidebar.html() || "not found");
    });
  });
});

