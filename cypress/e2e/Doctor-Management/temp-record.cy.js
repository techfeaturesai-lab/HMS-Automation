describe('Record', () => {
  it('my first recording', () => {
    cy.visit('https://devhms.techfeatures.ai/home');
    /* ==== Generated with Cypress Studio ==== */
    cy.get('.menu-btn').click();
    cy.get('#staffNumberInput').clear('H');
    cy.get('#staffNumberInput').type('HMS-1');
    cy.get('#staffPasswordInput').clear('A');
    cy.get('#staffPasswordInput').type('Admin@123');
    cy.get('.password-toggle-btn > .bi').click();
    cy.get('.modern-submit-btn').click();
    cy.get(':nth-child(11) > .sidebar-link > .link-label').click();
    cy.get(':nth-child(10) > .sidebar-link > .link-label').click();
    cy.get(':nth-child(1) > .sub-item').click();
    cy.get('.primary-btn').click();
    cy.get('.dashboard-container').click();
    cy.get(':nth-child(2) > .form-control').clear('Y');
    cy.get(':nth-child(2) > .form-control').type('Yogesh ');
    cy.get(':nth-child(4) > .form-control').clear('P');
    cy.get(':nth-child(4) > .form-control').type('Pandey');
    cy.get(':nth-child(5) > .form-select').select('1: 1');
    cy.get('.date-input').click();
    cy.get('.month-label').click();
    cy.get(':nth-child(2) > .picker-select-btn').click();
    cy.get('.picker-options > :nth-child(3)').click();
    cy.get(':nth-child(2) > .picker-select-btn').click();
    cy.get('.picker-options > :nth-child(4)').click();
    cy.get(':nth-child(2) > .picker-select-btn').click();
    cy.get('.picker-options > :nth-child(5)').click();
    cy.get(':nth-child(1) > .picker-select-btn').click();
    cy.get('.picker-options > :nth-child(4)').click();
    cy.get(':nth-child(1) > .picker-select-btn').click();
    cy.get('.picker-options > :nth-child(6)').click();
    cy.get('[aria-label="Thursday, June 3, 2004"]').click();
    cy.get(':nth-child(7) > .form-select').select('5: 5');
    cy.get(':nth-child(8) > .form-select').select('2: 2');
    cy.get(':nth-child(8) > .form-select').select('4: 1');
    cy.get(':nth-child(9) > .form-select').select('76: 76');
    cy.get(':nth-child(11) > .form-control').clear('8');
    cy.get(':nth-child(11) > .form-control').type('8393878451');
    cy.get(':nth-child(13) > .form-control').clear('y');
    cy.get(':nth-child(13) > .form-control').type('yogeshpandeytech@gmail.com');
    cy.get(':nth-child(16) > .form-select').select('76: 76');
    cy.get(':nth-child(17) > .form-select').select('35: 27');
    cy.get(':nth-child(18) > .form-select').select('30: 121');
    cy.get(':nth-child(19) > .form-control').clear('2');
    cy.get(':nth-child(19) > .form-control').type('263691');
    cy.get(':nth-child(20) > .form-control').clear('K');
    cy.get(':nth-child(20) > .form-control').type('Kathgariya haldwani near laxmi dental');
    cy.get('#sameAsCurrentAddress').scrollIntoView().check({ force: true });
    cy.get(':nth-child(31) > .form-control').scrollIntoView();
    cy.get(':nth-child(31) > .form-control').clear('N');
    cy.get(':nth-child(31) > .form-control').type('Neeraj Pandey');
    cy.get(':nth-child(32) > .form-select').select('2: 8');
    cy.get(':nth-child(33) > .form-control').clear('7');
    cy.get(':nth-child(33) > .form-control').type('7253008767');
    cy.get('.primary-btn').click();
    cy.get('.calendar-trigger > svg').click();
    cy.get('.today-btn').click();
    cy.get(':nth-child(2) > .multiselect-container > .form-select').select('8: 10');
    cy.get(':nth-child(2) > .multiselect-container > .form-select').select('9: 6');
    cy.get(':nth-child(3) > .multiselect-container > .form-select').select('1: 1');
    cy.get('.primary-btn').click();
    cy.get(':nth-child(1) > .form-control').clear('3');
    cy.get(':nth-child(1) > .form-control').type('343432432434');
    cy.get(':nth-child(2) > .form-select').select('4: 1');
    cy.get('.date-input').click();
    cy.get('.month-label').click();
    cy.get(':nth-child(2) > .picker-select-btn').click();
    cy.get('.picker-options > :nth-child(4)').click();
    cy.get('[aria-label="Saturday, November 11, 2073"]').click();
    cy.get(':nth-child(4) > .form-control').clear('M');
    cy.get(':nth-child(4) > .form-control').type('MBBS');
    cy.get(':nth-child(5) > .form-control').click();
    cy.get(':nth-child(6) > .form-select').select('2: 28');
    cy.get('.row > :nth-child(7)').click();
    cy.get(':nth-child(7) > .form-select').select('9: 1');
    cy.get(':nth-child(8) > .form-control').clear('2');
    cy.get(':nth-child(8) > .form-control').type('2');
    cy.get(':nth-child(9) > .form-control').click();
    // Step 3: Upload Profile Photo directly via hidden input[type="file"] (avoids OS file dialog)
    cy.get("body").then(($b) => {
      if ($b.find('input[type="file"]').length > 0) {
        cy.uploadDoctorMockFile('input[type="file"]', {
          fileName: "doctor_avatar.png",
          mimeType: "image/png",
          sizeBytes: 32 * 1024,
        });
      }
    });
    cy.get('.primary-btn').scrollIntoView().click({ force: true });
    cy.get(':nth-child(1) > .form-select').select('1: 15');
    cy.get('.language-dropdown-wrapper > .form-select').click();
    cy.get(':nth-child(4) > .language-option > .form-check-label').click();
    cy.get('#lang-2').check();
    cy.get(':nth-child(2) > .language-option > .form-check-label').click();
    cy.get('#lang-1').check();
    cy.get('.col-xxl-9').click();
    cy.get(':nth-child(3) > .form-select').select('1: 20006');
    cy.get('.primary-btn').click();
    cy.get(':nth-child(1) > .input-group > .form-control').clear('1');
    cy.get(':nth-child(1) > .input-group > .form-control').type('1000');
    cy.get(':nth-child(2) > .input-group > .form-control').clear('5');
    cy.get(':nth-child(2) > .input-group > .form-control').type('500');
    cy.get(':nth-child(3) > .input-group > .form-control').clear('10');
    cy.get(':nth-child(3) > .input-group > .form-control').type('10');
    cy.get(':nth-child(4) > .form-control').clear('7');
    cy.get(':nth-child(4) > .form-control').type('7');
    cy.get('.btn-outline-success').click();
    cy.get('#appointmentYes').check();
    cy.get('.primary-btn').click();
    // Step 6: Upload documents directly onto each hidden input[type="file"] (with { force: true })
    cy.get('input[type="file"]').then(($inputs) => {
      for (let i = 0; i < $inputs.length; i += 1) {
        const accept = ($inputs.eq(i).attr("accept") || "").toLowerCase();
        const isImg = accept.includes("image") && !accept.includes("pdf");
        cy.uploadDoctorMockFile('input[type="file"]', {
          index: i,
          fileName: isImg ? `doc_image_${i}.png` : `doctor_doc_${i}.pdf`,
          mimeType: isImg ? "image/png" : "application/pdf",
          sizeBytes: 64 * 1024,
        });
      }
    });
    cy.get('.mb-3 > .form-select').first().select('1: 20');
    cy.get(':nth-child(1) > .form-select').first().select('8: 19');
    // :nth-child(2) > .form-control is the <input type="file"> for Additional Documents (do not call .clear())
    cy.get('body').then(($b) => {
      const $extraFile = $b.find(':nth-child(2) > input[type="file"].form-control');
      if ($extraFile.length > 0) {
        cy.uploadDoctorMockFile(':nth-child(2) > input[type="file"].form-control', {
          fileName: "additional_doctor_doc.pdf",
          mimeType: "application/pdf",
          sizeBytes: 64 * 1024,
        });
      }
    });
    cy.get('.p-2 > .primary-btn').scrollIntoView().click({ force: true });
    // Advance from Step 6 Documents to Step 7 Review
    cy.get('.primary-btn')
      .filter((_, el) => !Cypress.$(el).is('.p-2 > .primary-btn') && Cypress.$(el).is(':visible'))
      .last()
      .scrollIntoView()
      .click({ force: true });

    // Step 7 Review: Scroll to top, verify entered values top-to-bottom, then scroll to bottom & submit
    cy.get('.dashboard-container').scrollTo('top', { ensureScrollable: false });
    cy.scrollTo('top', { ensureScrollable: false });
    cy.get('.card').first().should('be.visible');

    [
      'Yogesh',
      'Pandey',
      '8393878451',
      'yogeshpandeytech@gmail.com',
      '263691',
      'Kathgariya haldwani near laxmi dental',
      'Neeraj Pandey',
      '7253008767',
      '343432432434',
      'MBBS',
      '1000',
      '500',
    ].forEach((enteredVal) => {
      cy.contains('.card', enteredVal)
        .scrollIntoView()
        .should('be.visible');
    });

    // Scroll to bottom to verify confirmation checkbox and submit
    cy.get('.dashboard-container').scrollTo('bottom', { ensureScrollable: false });
    cy.scrollTo('bottom', { ensureScrollable: false });
    cy.get('.form-check-label').scrollIntoView().should('be.visible');
    cy.get('#reviewConfirmCheck').scrollIntoView().check({ force: true });
    cy.get('.primary-btn').filter(':visible').last().scrollIntoView().click({ force: true });
    cy.get('.hms-toast > span').should('be.visible');
    /* ==== End Cypress Studio ==== */
  });
});