import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "https://devhms.techfeatures.ai/",
    specPattern: "cypress/e2e/**/*.cy.{js,jsx,ts,tsx}",
    viewportWidth: 1366,
    viewportHeight: 768,
    chromeWebSecurity: false,
    defaultCommandTimeout: 10000,
  },
});
