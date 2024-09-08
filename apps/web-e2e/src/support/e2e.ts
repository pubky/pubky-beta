// ***********************************************************
// This example support/e2e.ts is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.ts using ES2015 syntax:
import './commands';
// import { slowCypressDown } from 'cypress-slow-down';

// slow down execution more in CI to avoid flaky tests
// console.log(`CI: ${process.env.CI}`);
// process.env.CI ? slowCypressDown(1000) : slowCypressDown(75);

// uses Chrome DevTools Protocol to allow clipboard permissions
// resolves 'NotAllowedError: Document is not focused.' in CI
if (Cypress.browser.family === 'chromium') {
  Cypress.automation('remote:debugger:protocol', {
    command: 'Browser.grantPermissions',
    params: {
      permissions: ['clipboardReadWrite', 'clipboardSanitizedWrite'],
      origin: window.location.origin,
    },
  });
};
