// Scenario ID: HMS-DOC-002
// Scenario Name: Doctor Address Same as Current Address Toggle - Populates on Check and Clears on Uncheck

import { doctorSelectors } from "../../support/doctorSelectors";

describe("HMS-DOC-002: Doctor Address Same as Current Address Toggle", () => {
  it("populates permanent address on check and clears on uncheck", () => {
    cy.startScenarioChecklist(
      "HMS-DOC-002",
      "Doctor Address Same as Current Address Toggle - Populates on Check and Clears on Uncheck"
    );

    cy.getDoctorMgmtConfig().then((cfg) => {
      cy.adminLoginDetail();
      cy.openDoctorManagementList();
      cy.recordCheck("Staff Admin login and navigate to Add Doctor Address section");

      cy.openAddDoctorWizard();

      const cCountry = doctorSelectors.wizard.step1.country;
      const cState = doctorSelectors.wizard.step1.state;
      const cCity = doctorSelectors.wizard.step1.city;
      const cPostal = doctorSelectors.wizard.step1.postalCode;
      const cAddress = doctorSelectors.wizard.step1.addressLine1;

      const pCountry = doctorSelectors.wizard.step1.permCountry;
      const pState = doctorSelectors.wizard.step1.permState;
      const pCity = doctorSelectors.wizard.step1.permCity;
      const pPostal = doctorSelectors.wizard.step1.permPostalCode;
      const pAddress = doctorSelectors.wizard.step1.permAddress;

      // Select Country in Current Address
      cy.get(cCountry)
        .scrollIntoView()
        .should("be.visible")
        .find("option:not([disabled]):not([value*='null'])", { timeout: 10000 })
        .should("have.length.greaterThan", 0);

      cy.get(cCountry).then(($country) => {
        const indOption = $country.find("option").filter((_, opt) => /india/i.test(opt.text || "") || opt.value === "76: 76");
        const val = indOption.length > 0 ? indOption.first().val() : $country.find("option:not([disabled]):not([value*='null'])").first().val();
        cy.get(cCountry).select(val);
      });

      // Select State in Current Address
      cy.get(cState)
        .scrollIntoView()
        .should("be.visible")
        .find("option:not([disabled]):not([value*='null'])", { timeout: 10000 })
        .should("have.length.greaterThan", 0);

      cy.get(cState).then(($state) => {
        const stateOpt = $state.find("option").filter((_, opt) => /uttarakhand|karnataka|delhi|maharashtra/i.test(opt.text || "") || opt.value.includes("27"));
        const val = stateOpt.length > 0 ? stateOpt.first().val() : $state.find("option:not([disabled]):not([value*='null'])").first().val();
        cy.get(cState).select(val);
      });

      // Select City in Current Address
      cy.get(cCity)
        .scrollIntoView()
        .should("be.visible")
        .find("option:not([disabled]):not([value*='null'])", { timeout: 10000 })
        .should("have.length.greaterThan", 0);

      cy.get(cCity).then(($city) => {
        const cityOpt = $city.find("option").filter((_, opt) => /haldwani|bengaluru|bangalore/i.test(opt.text || "") || opt.value.includes("121"));
        const val = cityOpt.length > 0 ? cityOpt.first().val() : $city.find("option:not([disabled]):not([value*='null'])").first().val();
        cy.get(cCity).select(val);
      });

      cy.get(cPostal).scrollIntoView().clear({ force: true }).type("263656", { force: true });
      cy.get(cAddress).scrollIntoView().clear({ force: true }).type("Kathgariya haldwani", { force: true });
      cy.recordCheck("Populate Current Address (Country, State, City, PIN Code, Address Line)");

      // Check sameAsCurrentAddress
      cy.get("#sameAsCurrentAddress").scrollIntoView().check({ force: true });

      // Verify Permanent Address fields match Current Address
      [
        [cCountry, pCountry],
        [cState, pState],
        [cCity, pCity],
      ].forEach(([currSel, permSel]) => {
        cy.get(currSel).then(($curr) => {
          const currText = ($curr.find("option:selected").text() || "").trim();
          cy.get(permSel)
            .scrollIntoView()
            .should("be.visible")
            .then(($perm) => {
              const permText = ($perm.find("option:selected").text() || "").trim();
              if (currText && permText) {
                expect(permText).to.eq(currText);
              }
            });
        });
      });
      cy.get(pPostal).scrollIntoView().should("have.value", "263656");
      cy.get(pAddress).scrollIntoView().should("have.value", "Kathgariya haldwani");
      cy.recordCheck("Checkbox Checked: Permanent Address successfully synchronized with Current Address");

      // Uncheck sameAsCurrentAddress
      cy.get("#sameAsCurrentAddress").scrollIntoView().uncheck({ force: true }).should("not.be.checked");
      cy.get(pPostal).scrollIntoView().should("have.value", "");
      cy.get(pAddress).scrollIntoView().should("have.value", "");
      cy.recordCheck("Checkbox Unchecked: Permanent Address fields cleared successfully");

      // Verify Current Address remains intact
      cy.get(cPostal).should("have.value", "263656");
      cy.get(cAddress).should("have.value", "Kathgariya haldwani");
      cy.recordCheck("Current Address values remain intact after uncheck");

      cy.completeScenarioChecklist(
        "HMS-DOC-002",
        "Doctor Address Same as Current Address Toggle - Populates on Check and Clears on Uncheck"
      );
    });
  });
});
