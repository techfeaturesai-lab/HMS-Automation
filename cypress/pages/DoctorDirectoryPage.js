import { BasePage } from "./BasePage";

/**
 * Page Object for the Doctor Directory ("Find Doctors by Department") page (/home/doctor-list).
 */
export class DoctorDirectoryPage extends BasePage {
  elements = {
    pageHeading: () => cy.contains("Find Doctors by Department"),
    searchInput: () => cy.get("input[placeholder*='Search Doctors']"),
    doctorCards: () => cy.get(".card"),
    deptPillsContainer: () => cy.get(".dept-pills"),
    deptPills: () => cy.get(".dept-pills .pill"),
    clearAllBtn: () => cy.get(".dept-pills-header").contains("Clear All"),
    emptyStateMessage: () => cy.contains(/No doctors found/i),
  };

  /**
   * Navigate directly to the Doctor Directory page.
   */
  visitDirectory() {
    this.visit("home/doctor-list");
    this.waitForLoader();
    cy.contains("Dr.", { timeout: 15000 }).should("be.visible");
    return this;
  }

  /**
   * Verify that the Doctor Directory page has loaded successfully.
   */
  verifyPageLoaded() {
    this.waitForLoader();
    cy.url({ timeout: 15000 }).should("include", "/home/doctor-list");
    this.elements.pageHeading().should("be.visible");
    return this;
  }

  /**
   * Verify that doctors list is populated and not showing empty/broken state.
   */
  verifyDoctorsListingNotEmpty(minCount = 1) {
    this.elements.doctorCards().should("have.length.at.least", minCount);
    cy.get("body").should("not.contain.text", "404");
    return this;
  }

  /**
   * Verify uniform alignment and presence of action buttons across doctor cards.
   */
  verifyUniformCardAlignment() {
    this.elements.doctorCards().should("have.length.at.least", 2);
    // Verify each card contains Call and Book Appointment buttons
    this.elements.doctorCards().each(($card) => {
      cy.wrap($card).find(".button-row .cancel-btn").should("exist").and("contain.text", "Call");
      cy.wrap($card).find(".button-row .primary-btn").should("exist").and("contain.text", "Book Appointment");
    });
    return this;
  }

  /**
   * Verify "Next Available" slot label on doctor cards.
   */
  verifyNextAvailableSlot(doctorName = null) {
    if (doctorName) {
      this.getDoctorCard(doctorName).within(() => {
        cy.contains("Next Available").should("be.visible");
        cy.get(".text-available, strong").should("be.visible").and("not.be.empty");
      });
    } else {
      this.elements.doctorCards().first().within(() => {
        cy.contains("Next Available").should("be.visible");
        cy.get(".text-available, strong").should("be.visible").and("not.be.empty");
      });
    }
    return this;
  }

  /**
   * Find a specific doctor's card by doctor name.
   */
  getDoctorCard(doctorName) {
    return this.elements.doctorCards().contains("h3", doctorName).closest(".card");
  }

  /**
   * Search for a doctor by typing a query and submitting.
   */
  searchDoctor(query, delay = 60) {
    this.elements.searchInput().should("be.visible").clear().type(`${query}{enter}`, { delay });
    return this;
  }

  /**
   * Clear doctor search.
   */
  clearSearch() {
    this.elements.searchInput().clear().type("{enter}");
    return this;
  }

  /**
   * Select a department from the filter pills.
   */
  selectDepartment(deptName) {
    this.elements.deptPills().contains(deptName).click();
    return this;
  }

  /**
   * Click "Clear All" in the department filter section.
   */
  clickClearAll() {
    this.elements.clearAllBtn().click();
    return this;
  }

  /**
   * Verify that only doctors belonging to the selected department are shown.
   */
  verifyDepartmentFiltered(deptName) {
    this.elements.doctorCards().should("have.length.at.least", 1);
    this.elements.doctorCards().each(($card) => {
      cy.wrap($card).find(".specialty").should("contain.text", deptName);
    });
    return this;
  }

  /**
   * Verify friendly empty state when no matching doctors are found.
   */
  verifyEmptyState() {
    this.elements.doctorCards().should("have.length", 0);
    this.elements.emptyStateMessage().should("be.visible");
    return this;
  }
}

export const doctorDirectoryPage = new DoctorDirectoryPage();
