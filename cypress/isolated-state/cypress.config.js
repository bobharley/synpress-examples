const { defineConfig } = require("cypress");
const synpressPlugins = require("@synthetixio/synpress/plugins");

module.exports = defineConfig({
  userAgent: "synpress",
  chromeWebSecurity: true,
  defaultCommandTimeout: 30000,
  pageLoadTimeout: 30000,
  requestTimeout: 30000,
  e2e: {
    testIsolation: false,
    setupNodeEvents(on, config) {
      synpressPlugins(on, config);
    },
    baseUrl: "https://bridge.t1rn.io/",
    supportFile: "cypress/support/e2e.js",
  },
  video: false
});
