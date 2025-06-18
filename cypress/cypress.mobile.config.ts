import { defineConfig } from 'cypress';
import { defaultMs } from './support/slow-down';
import { setupCypressTasks } from './support/cypress-tasks';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:4200',
    specPattern: 'mobile/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'support/e2e.ts',
    videosFolder: 'videos/mobile',
    screenshotsFolder: 'screenshots/mobile',
    downloadsFolder: 'download/mobile',
    fixturesFolder: 'fixtures',
    defaultCommandTimeout: process.env['CI'] ? 60_000 : 15_000,
    video: true,
    viewportWidth: 393, // iPhone 15 Pro width
    viewportHeight: 852, // iPhone 15 Pro height
    env: {
      commandDelay: defaultMs,
      ci: process.env['CI'],
      isMobile: true
    },

    setupNodeEvents(on, _config) {
      on('before:browser:launch', (browser, launchOptions) => {
        if (browser.family === 'firefox') {
          launchOptions.preferences['network.proxy.testing_localhost_is_secure_when_hijacked'] = true;
          launchOptions.preferences['dom.events.testing.asyncClipboard'] = true;
          launchOptions.preferences['dom.events.asyncClipboard.readText'] = true;
        }
        if (browser.family === 'chromium' && browser.name !== 'electron') {
          launchOptions.args.push('--enable-experimental-web-platform-features');
          launchOptions.args.push('--clipboard-read-write');
          launchOptions.args.push('--clipboard-sanitized-write');
        }
        return launchOptions;
      });

      setupCypressTasks(on);
    },
    experimentalModifyObstructiveThirdPartyCode: true,
    chromeWebSecurity: false,
    pageLoadTimeout: 60000
  }
}); 