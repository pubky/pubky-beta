/// <reference types="cypress" />

// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace Cypress {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface Chainable<Subject> {
    allowClipboardForChrome(): void;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface Chainable<Subject> {
    signOut(hasBackup: boolean): void;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface Chainable<Subject> {
    signIn(backupFilename : string, passcode? : string): void;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface Chainable<Subject> {
    onboardAsNewUser(profileName: string, profileBio?: string): void;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface Chainable<Subject> {
    backupRecoveryFile(passcode?: string): void;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface Chainable<Subject> {
    deleteDownloadsFolder(): void;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface Chainable<Subject> {
    deleteFile(filePath: string): void;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface Chainable<Subject> {
    renameFile(fromPath: string, toPath: string): void;
  }
}

// uses Chrome DevTools Protocol to allow clipboard permissions
// resolves 'NotAllowedError: Document is not focused.' in CI
Cypress.Commands.add('allowClipboardForChrome', () => {
  if (Cypress.browser.family === 'chromium') {
    Cypress.automation('remote:debugger:protocol', {
      command: 'Browser.grantPermissions',
      params: {
        permissions: ['clipboardReadWrite', 'clipboardSanitizedWrite'],
        origin: window.location.origin,
      },
    });
  };
});


Cypress.Commands.add('onboardAsNewUser', (profileName : string, profileBio : string = '') => {
  cy.visit('/onboarding');

  cy.get('#onboarding-get-started-link').click();
  cy.location('pathname').should('eq', '/onboarding/intro');

  cy.get('#onboarding-sign-in-btn').click();
  cy.location('pathname').should('eq', '/onboarding/sign-in');

  cy.get('#onboarding-sign-up-link').click();
  cy.location('pathname').should('eq', '/onboarding/sign-up');

  cy.get('#onboarding-name-input').type(profileName);
  profileBio ? cy.get('#onboarding-bio-input').type(profileBio) : null;

  cy.get('#onboarding-submit-button').click();

  cy.location('pathname').should('eq', '/onboarding/pubky');

  cy.get('#onboarding-confirm-link').click();

  cy.location('pathname').should('eq', '/onboarding/confirm');

  cy.get('#onboarding-start-exploring-btn').click();
  cy.location('pathname').should('eq', '/home');
});

Cypress.Commands.add('signOut', (hasBackedUp : boolean) => {
  cy.get('#header-profile-pic').click();
  cy.location('pathname').should('eq', '/profile');

  cy.get('#profile-sign-out-btn').click();

  // sign out model only shows if user has not backed up recovery file
  if (!hasBackedUp) cy.get('#logout-modal-sign-out-btn').click();

  cy.location('pathname').should('eq', '/logout');

  cy.get('#logout-link').click();
  cy.location('pathname').should('eq', '/sign-in');
});

Cypress.Commands.add('signIn', (backupFilepath : string, passcode = '123456') => {
  cy.location('pathname').should('eq', '/sign-in');

    cy.get('#fileInput').selectFile(
      backupFilepath,
      { force: true } // force to bypass visibility check of hidden input field
    );
    cy.get('#onboarding-password-input').type(passcode);
    cy.get('#onboarding-sign-in-button').click();

    cy.location('pathname').should('eq', '/home');
});

Cypress.Commands.add('backupRecoveryFile', (passcode = '123456') => {
      // backup recovery file
      cy.get('#remind-backup-now-btn').click();
      cy.get('#backup-recovery-file-btn').click();
      cy.get('#backup-recovery-file-password-input').type(passcode);
      cy.get('#backup-download-recovery-file-btn').click();
});

Cypress.Commands.add('deleteDownloadsFolder', () => {
  const downloadsFolder = Cypress.config('downloadsFolder');
  cy.task('deleteFolder', downloadsFolder);
});

Cypress.Commands.add('deleteFile', (filePath : string) => {
  cy.task('deleteFile', filePath).then(() => {
    cy.log(`${filePath} has been deleted`);
  });
});

Cypress.Commands.add('renameFile', (fromPath : string, toPath : string) => {
  cy.task('renameFile', { fromPath, toPath }).then(() => {
    cy.log(`File has been renamed from ${fromPath} to ${toPath}`);
  });
});

//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
