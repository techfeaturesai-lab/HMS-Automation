# HMS Front Office - Cypress E2E Automation

End-to-End automated testing suite for **Hospital Management System (HMS) Front Office**:
`https://devhms.techfeatures.ai/frontoffice`

---

## 🔑 Login Credentials

The test suite uses staff credentials to access the receptionist front-office dashboard:
- **Staff Number / User ID:** `HMS-4`
- **Password:** `Admin@123`
- **User Profile:** `Aditi Sharma` (Role: `Receptionist`)

---

## 🚀 Running Cypress Tests

### 1. Headless Mode (Command Line)
Runs all test suites in the terminal:

```sh
npm test
```
*(or `npm run test:e2e`)*

### 2. Interactive GUI Mode (Cypress Test Runner)
Opens the Cypress desktop runner to watch tests interact with the browser in real-time:

```sh
npm run test:open
```
*(or `npm run test:e2e:open`)*

---

## 🧪 Test Suites (`cypress/e2e/`)

1. **[`cypress/e2e/login.cy.js`](./cypress/e2e/login.cy.js)**:
   - Staff login with `HMS-4` / `Admin@123`
   - Redirection to `/frontofficedashboard`
   - Verification of receptionist profile (`Aditi Sharma` - `Receptionist`)
   - Sidebar navigation & dashboard metrics verification
   - Error handling validation with invalid password

2. **[`cypress/e2e/dashboard.cy.js`](./cypress/e2e/dashboard.cy.js)**:
   - Uses reusable `cy.login()` command
   - Search bar (`Search Patients/Appointments/Mobile Number...`)
   - Quick action buttons (`Find OPD Slot`, `New IPD Admission`, `Collect Payment`)
   - Stat cards (`OPD TODAY`, `IPD TODAY`, `DISCHARGES`, `PAYMENT DUE`, `REFUNDS`, `BEDS AVAILABLE`)

3. **[`cypress/e2e/home.cy.js`](./cypress/e2e/home.cy.js)**:
   - Landing page branding & logo
   - Navigation links (*Home, About, Services, Contact*)
   - Medical services cards (*Cardiology, Neurology, Orthopedics, Pediatrics, Dental, Lab*)
   - Emergency 24/7 & WhatsApp floating buttons
   - Hospital contact details

4. **[`cypress/e2e/actions.cy.js`](./cypress/e2e/actions.cy.js)**:
   - Book Appointment button flow
   - Staff Login modal trigger and form fields validation

---

## 🛠️ Reusable Custom Commands

In **[`cypress/support/commands.js`](./cypress/support/commands.js)**:
```js
cy.login("HMS-4", "Admin@123");
```
Use this command in any future test to authenticate in a single line.

---

## 📖 Meeting Notes / प्रोजेक्ट विवरण (हिंदी में)

मीटिंग के लिए विस्तृत व्याख्या पढ़ने के लिए [MEETING_EXPLANATION_HI.md](./MEETING_EXPLANATION_HI.md) देखें।
