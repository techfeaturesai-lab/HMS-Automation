import { BasePage } from "./BasePage";
import users from "../fixtures/users.json";

/**
 * Page Object for Staff and Patient Login on the HMS application.
 */
export class LoginPage extends BasePage {
  elements = {
    staffLoginModalBtn: () => cy.get(".header-staff-btn"),
    staffNumberInput: () => cy.get("#staffNumberInput"),
    staffPasswordInput: () => cy.get("#staffPasswordInput"),
    loginSubmitBtn: () => cy.get('button.modern-submit-btn, button[type="submit"]'),
    loginModal: () => cy.get(".staff-modal-container, .modal, [role='dialog'], form"),
    loginSuccessToast: () => cy.contains(/Login successful/i),
  };

  /**
   * Open the Staff Login Modal from the public header.
   */
  openStaffLoginModal() {
    this.elements.staffLoginModalBtn().should("be.visible").click();
    this.elements.staffNumberInput().should("be.visible");
    this.elements.staffPasswordInput().should("be.visible");
    return this;
  }

  /**
   * Perform Staff Login with given credentials.
   * @param {string} staffNumber - Staff identifier (e.g. HMS-01)
   * @param {string} password - Staff password
   */
  loginStaff(staffNumber, password) {
    this.openStaffLoginModal();
    this.elements.staffNumberInput().clear().type(staffNumber);
    this.elements.staffPasswordInput().clear().type(password);
    this.elements.loginSubmitBtn().click();
    this.waitForLoader();
    return this;
  }

  /**
   * Quick helper to log in specifically as the Hospital Administrator.
   */
  loginAsAdmin() {
    return this.loginStaff(users.admin.staffNumber, users.admin.password);
  }
}

export const loginPage = new LoginPage();
