import { defineConfig } from 'cypress'

export default defineConfig({
  fixturesFolder: 'src/main/test/cypress/fixtures',
  video: false,
  e2e: {
    setupNodeEvents(on, config) {
      return require('./src/main/test/cypress/plugins/index.js')(on, config)
    },
    baseUrl: 'http://localhost:8080',
    supportFile: 'src/main/test/cypress/support/index.js',
    specPattern: 'src/main/test/cypress/integration/**/*.cy.{js,jsx,ts,tsx}',
  },
})
