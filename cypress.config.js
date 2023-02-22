const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    baseUrl: 'http://localhost:3000/',
    specPattern: 'cypress/e2e/TestCases/*.cy.{js,ts}',
    viewportHeight: 1024,
    viewportWidth: 1560,
    requestTimeout: 8000
  },
});
