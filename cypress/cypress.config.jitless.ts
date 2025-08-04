import { defineConfig } from 'cypress';

import { defaultMs } from './support/slow-down';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:4200',
    specPattern: 'jitless/jitless.cy.{js,jsx,ts,tsx}',
    supportFile: 'support/e2e.ts',
    videosFolder: 'videos',
    screenshotsFolder: 'screenshots',
    downloadsFolder: 'download',
    fixturesFolder: 'fixtures',
    defaultCommandTimeout: process.env['CI'] ? 60_000 : 15_000,
    video: true,
    viewportWidth: 1920,
    viewportHeight: 1080,
    env: {
      // slow down execution more in CI to avoid flaky tests
      commandDelay: defaultMs,
      ci: process.env['CI']
    },

    // Plugins

    setupNodeEvents(on, _config) {
      on('before:browser:launch', (browser, launchOptions) => {
        if (browser.family === 'firefox') {
          // Firefox to treat localhost as secure context (needed for win.navigator.clipboard)
          launchOptions.preferences['network.proxy.testing_localhost_is_secure_when_hijacked'] = true;
          // Enables clipboard access
          launchOptions.preferences['dom.events.testing.asyncClipboard'] = true;
          // Enables readText from clipboard
          launchOptions.preferences['dom.events.asyncClipboard.readText'] = true;

          // Disable JIT and WASM for testing
          launchOptions.preferences['javascript.options.baselinejit'] = false;
          launchOptions.preferences['javascript.options.ion'] = false;
          launchOptions.preferences['javascript.options.wasm'] = false;
        }
        // Enable clipboard for Chrome
        if (browser.family === 'chromium' && browser.name !== 'electron') {
          launchOptions.args.push('--enable-experimental-web-platform-features');
          launchOptions.args.push('--clipboard-read-write'); // Enable clipboard read/write
          launchOptions.args.push('--clipboard-sanitized-write'); // Enable sanitized write permissions

          // Disable JIT and WASM for testing
          launchOptions.args.push('--js-flags=--jitless,--no-expose-wasm');
        }
        return launchOptions;
      });
    },
    experimentalModifyObstructiveThirdPartyCode: true,
    chromeWebSecurity: false,
    pageLoadTimeout: 60000
  }
});
