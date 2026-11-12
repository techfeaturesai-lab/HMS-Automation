describe("HMS Front Office - Home & Navigation", () => {
  beforeEach(() => {
    cy.visit("");
    // Wait for the initial Angular loader backdrop to finish
    cy.get(".loader-backdrop", { timeout: 15000 }).should("not.exist");
  });

  it("loads the Front Office homepage with valid title and branding", () => {
    cy.title().should("include", "HMS - Hospital Management System");
    cy.get(".nav-brand label").should("contain.text", "Hospital Management System");
  });

  it("displays all desktop navigation links", () => {
    const expectedLinks = ["Home", "About", "Services", "Contact"];
    cy.get(".nav-links-desktop a").each(($el, index) => {
      cy.wrap($el).should("contain.text", expectedLinks[index]);
    });
  });

  it("displays key action buttons in header and hero section", () => {
    // Header actions
    cy.get(".header-btn-book").should("be.visible").and("contain.text", "Book Appointment");
    cy.get(".header-btn-booking").should("be.visible").and("contain.text", "My Booking");
    cy.get(".header-staff-btn").should("be.visible").and("contain.text", "Staff Login");

    // Hero Call-to-actions
    cy.get(".hero-cta-btn").should("be.visible").and("contain.text", "Book Appointment");
    cy.get(".hero-cta-secondary").should("be.visible").and("contain.text", "Ask AI Assistant");
  });

  it("displays medical services cards on the page", () => {
    const services = [
      "Cardiology",
      "Neurology",
      "Orthopedics",
      "Pediatrics",
      "Dental Care",
      "Laboratory",
    ];

    cy.get("#services").scrollIntoView();
    cy.get("#services .services-main-title").should("contain.text", "Our Medical Services");

    services.forEach((serviceName) => {
      cy.get("#services").contains(".service-card-title", serviceName).should("be.visible");
    });
  });

  it("renders floating emergency and AI chatbot buttons", () => {
    cy.get(".emergency-btn").should("be.visible").and("contain.text", "Emergency Contact");
    cy.get(".whatsapp-cta-btn").should("be.visible").and("contain.text", "Continue with WhatsApp");
    cy.get(".chatbot-btn").should("be.visible");
  });

  it("displays correct hospital contact info in the footer", () => {
    cy.get("#contact").scrollIntoView();
    cy.get("#contact").contains("contact@hms.com").should("be.visible");
    cy.get("#contact").contains("+91 9999008888").should("be.visible");
  });
});

