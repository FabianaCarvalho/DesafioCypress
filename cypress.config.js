const { defineConfig } = require('cypress');

module.exports = defineConfig({
  env: {
    api_url: 'https://serverest.dev',
    admin_email: 'admin@qa.com',
    admin_password: 'senha123'
  },

  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
