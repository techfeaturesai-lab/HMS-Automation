import { BasePage } from "./BasePage";

/**
 * Page Object for Leave Management modules:
 * - My Leave (/leave/my-leave)
 * - All Leave Requests / Staff Leave Management (/leave/leave-management)
 * - Team Calendar (/leave/team-calendar)
 */
export class LeavePage extends BasePage {
  elements = {
    // Navigation & Screen Headers
    myLeaveHeading: () => cy.contains(/My Leave/i),
    leaveManagementHeading: () => cy.contains(/Leave Management/i),
    teamCalendarHeading: () => cy.contains(/Team Calendar/i),

    // My Leave Controls
    addLeaveBtn: () => cy.contains("button, a", /Add Leave/i),
    applyLeaveModal: () => cy.get(".leave-modal-dialog, .modal-dialog, form"),
    leaveTypeSelect: () => cy.get("#leaveTypeId"),
    dayTypeSelect: () => cy.get("#dayType"),
    dateInput: () => cy.get("input[placeholder*='date']"),
    calendarTrigger: () => cy.get(".calendar-trigger"),
    calendarPopover: () => cy.get(".calendar-popover"),
    calendarDateCells: () => cy.get(".calendar-popover .date-cell:not([disabled]):not(.date-cell-empty)"),
    reasonInput: () => cy.get("#reason"),
    emojiErrorMsg: () => cy.contains(/Emojis and special symbols are not allowed/i),
    submitRequestBtn: () => cy.contains("button", /Submit Request/i),
    cancelBtn: () => cy.contains("button", /Cancel/i),
    closeModalBtn: () => cy.get("button.btn-modal-close, button.close"),

    // Balance Cards
    casualLeaveCard: () => cy.contains(/Casual Leave/i),
    sickLeaveCard: () => cy.contains(/Sick Leave/i),
    emergencyLeaveCard: () => cy.contains(/Emergency Leave/i),
    unpaidLeaveCard: () => cy.contains(/Unpaid Leave/i),

    // Tables & Rows
    leaveTable: () => cy.get("table"),
    tableRows: () => cy.get("tbody tr"),

    // Filters on All Leave Requests / Staff Leave Management
    searchByNameInput: () => cy.get("input[placeholder*='Search by name']"),
    statusFilterDropdown: () => cy.contains("div, button, select, span", /All Status/i),
    statusFilterSelect: () => cy.get("select").filter((_, el) => Cypress.$(el).text().includes("Status")),
    yearFilterDropdown: () => cy.contains("div, button, select, span", /All Years/i),
  };

  /**
   * Navigate to My Leave screen
   */
  visitMyLeave() {
    cy.visit("/leave/my-leave");
    this.waitForLoader();
    return this;
  }

  /**
   * Navigate to All Leave Requests / Leave Management screen
   */
  visitLeaveManagement() {
    cy.visit("/leave/leave-management");
    this.waitForLoader();
    return this;
  }

  /**
   * Navigate to Team Calendar screen
   */
  visitTeamCalendar() {
    cy.visit("/leave/team-calendar");
    this.waitForLoader();
    return this;
  }

  /**
   * Open the Apply Leave Modal from My Leave
   */
  openAddLeaveModal() {
    this.elements.addLeaveBtn().should("be.visible").click();
    this.elements.applyLeaveModal().should("be.visible");
    return this;
  }

  /**
   * Select a future date from the calendar popover
   */
  selectFutureDate(dayIndex = 2) {
    this.elements.calendarTrigger().first().click();
    this.elements.calendarPopover().should("be.visible");
    this.elements.calendarDateCells().eq(dayIndex).click();
    return this;
  }
}

export const leavePage = new LeavePage();
