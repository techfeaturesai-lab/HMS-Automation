# फ्रंट-ऑफिस प्रोजेक्ट एवं Cypress टेस्टिंग संरचना (Meeting Notes)

यह दस्तावेज़ मीटिंग में **HMS Front Office (`https://devhms.techfeatures.ai/frontoffice`)** के ऑटोमेशन सेटअप को समझाने के लिए तैयार किया गया है।

---

## 1. `cypress/` फोल्डर (Cypress Testing Structure)

यह फोल्डर पूरे ऑटोमेशन और एंड-टू-एंड (E2E) टेस्टिंग का मुख्य हिस्सा है:

### • `cypress/e2e/` (Test Specs / टेस्ट केसेस)
* **उपयोग:** यहाँ लाइव एप्लिकेशन के सारे टेस्ट केस लिखे गए हैं।
* **मौजूदा टेस्ट फाइल्स:**
  1. **`cypress/e2e/home.cy.js`:**
     * होमपेज लोडिंग और ब्रांडिंग ("Hospital Management System") चेक करता है।
     * हेडर नेविगेशन लिंक्स (Home, About, Services, Contact) वेरिफाई करता है।
     * मुख्य एक्शन बटन्स (Book Appointment, Ask AI Assistant) चेक करता है।
     * 6 मेडिकल सर्विसेज कार्ड्स (Cardiology, Neurology, Orthopedics, Pediatrics, Dental Care, Laboratory) को टेस्ट करता है।
     * 24/7 इमरजेंसी और WhatsApp फ्लोटिंग विजेट्स चेक करता है।
     * फुटर में संपर्क जानकारी (contact@hms.com, +91 9999008888) चेक करता है।
  2. **`cypress/e2e/actions.cy.js`:**
     * **Book Appointment:** अपॉइंटमेंट बुकिंग एक्शन की जांच करता है।
     * **Staff Login Modal:** 'Staff Login' बटन क्लिक करने पर लॉगिन पॉप-अप का खुलना, Staff Number व Password फील्ड्स का दिखना वेरिफाई करता है।

### • `cypress/support/` (सपोर्ट और कॉन्फ़िगरेशन)
* **`cypress/support/e2e.js`:** यह फ़ाइल हर टेस्ट रन होने से पहले अपने-आप लोड होती है।
* **`cypress/support/commands.js`:** कस्टम रियूजेबल कमांड्स (Custom Commands) बनाने के लिए (जैसे `cy.login()`)।

### • `cypress/fixtures/` (डमी / टेस्ट डेटा)
* **`cypress/fixtures/example.json`:** मॉक डेटा स्टोर करने के लिए।

---

## 2. मुख्य फाइल्स (Root Configuration Files)

* **`cypress.config.js`:**
  * Cypress की मुख्य कॉन्फ़िगरेशन फ़ाइल।
  * `baseUrl: "https://devhms.techfeatures.ai/frontoffice"` सेट किया गया है।
  * व्यू-पोर्ट (1366x768) और टाइमआउट्स कॉन्फ़िगर किए गए हैं।

* **`package.json`:**
  * टेस्ट रन करने वाली कमांड्स:
    * `npm test`: टर्मिनल में हेडलेस मोड में सभी टेस्ट एक साथ चलाता है।
    * `npm run test:open`: इंटरैक्टिव Cypress UI खोलता है जहाँ ब्राउज़र में टेस्ट लाइव चलते हुए दिखता है।

---

## 💡 मीटिंग में बोलने के लिए मुख्य बिंदु (Talking Points)

1. **टारगेट एप्लिकेशन:** *"हमने **HMS Front Office** (`https://devhms.techfeatures.ai/`) के लिए Cypress E2E ऑटोमेशन सूट तैयार किया है।"*
2. **कवरेज:** *"वर्तमान में हमने दो मुख्य टेस्ट सूट्स बनाए हैं—`home.cy.js` (नेविगेशन, सर्विसेज, फुटर, कॉन्टैक्ट्स) और `actions.cy.js` (अपॉइंटमेंट और स्टाफ लॉगिन मोडल)।"*
3. **परिणाम:** *"सभी 8 टेस्ट्स पूरी तरह पास हो रहे हैं (100% Pass Rate)।"*
4. **रन करने का तरीका:** *"डेवलपर्स और QA टीम `npm test` से टर्मिनल पर और `npm run test:open` से विजुअल इंटरफेस में टेस्ट चला सकते हैं।"*
