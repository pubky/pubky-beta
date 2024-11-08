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
    signOut(hasBackup: boolean): void;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface Chainable<Subject> {
    signIn(backupFilepath: string, passcode?: string): void;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface Chainable<Subject> {
    onboardAsNewUser(profileName: string, profileBio?: string, skipOnboardingSlides?: boolean, pubkyAlias?: string): void;
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

  interface Chainable<Subject> {
    innerTextShouldEq(text: string): Chainable<Subject>;
  }

  interface Chainable<Subject> {
    innerTextShouldContain(text: string): Chainable<Subject>;
  }

  interface Chainable<Subject> {
    innerTextShouldNotContain(text: string): Chainable<Subject>;
  }

  interface Chainable<Subject> {
    innerTextShouldNotEq(text: string): Chainable<Subject>;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface Chainable<Subject> {
    saveCopiedPubkyToAlias(alias: string): void;
  }
}

Cypress.Commands.add('onboardAsNewUser', (profileName: string, profileBio: string = '', skipOnboardingSlides: boolean = true, pubkyAlias?: string) => {
  cy.visit('/');

  cy.location('pathname').should('eq', '/onboarding');

  cy.get('#onboarding-create-account-btn').click();
  cy.location('pathname').should('eq', '/onboarding/intro');

  if (skipOnboardingSlides) {
    // TODO: remove wait workaround for pkarr rate limiting once using testnet
    cy.wait(3000);

    // click 'Skip Intro' button
    cy.get('#onboarding-skip-intro-btn').click();

  } else {
    // click 'Continue' button 6 times to skip onboarding slides
    for (let i = 0; i < 6; i++) {
      cy.get('#onboarding-continue-btn').click();
      if (i === 5) {
        cy.location('pathname').should('eq', '/onboarding/sign-in');
      } else {
        cy.location('pathname').should('eq', '/onboarding/intro');
      }
    };
  };

  cy.get('#onboarding-sign-up-link').click();
  cy.location('pathname').should('eq', '/onboarding/sign-up');

  cy.get('#onboarding-name-input').type(profileName);
  profileBio ? cy.get('#onboarding-bio-input').type(profileBio) : null;

  cy.get('#onboarding-submit-button').click();

  cy.location('pathname').should('eq', '/onboarding/pubky');

  // store pubky as an alias for future use
  // will only work if called from before or beforeEach
  if (pubkyAlias) {
    cy.get('#onboarding-copy-pubky-btn').click();
    cy.saveCopiedPubkyToAlias(pubkyAlias);
  };

  cy.get('#onboarding-confirm-link').click();

  cy.location('pathname').should('eq', '/onboarding/confirm');

  cy.get('#onboarding-start-exploring-btn').click();
  cy.location('pathname').should('eq', '/home');
});

Cypress.Commands.add('signOut', (hasBackedUp: boolean) => {
  cy.get('#header-profile-pic').click();
  cy.location('pathname').should('eq', '/profile');

  cy.get('#profile-sign-out-btn').click();

  // sign out model only shows if user has not backed up recovery file
  if (!hasBackedUp) cy.get('#logout-modal-sign-out-btn').click();

  cy.location('pathname').should('eq', '/logout');

  cy.get('#logout-link').click();
  cy.location('pathname').should('eq', '/sign-in');
});

Cypress.Commands.add('signIn', (backupFilepath: string, passcode = '123456') => {
  // TODO: remove clear local cache to avoid pkarr resolution issue
  cy.clearCookies();
  cy.clearLocalStorage();

  cy.location('pathname').then((currentPath) => {
    if (currentPath !== '/sign-in') {
      cy.visit('/sign-in');
    };
  });
  cy.location('pathname').should('eq', '/sign-in');

  // TODO: remove wait workaround for pkarr rate limiting once using testnet
  cy.wait(3000);

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

Cypress.Commands.add('deleteFile', (filePath: string) => {
  cy.task('deleteFile', filePath).then(() => {
    cy.log(`${filePath} has been deleted`);
  });
});

Cypress.Commands.add('renameFile', (fromPath: string, toPath: string) => {
  cy.task('renameFile', { fromPath, toPath }).then(() => {
    cy.log(`File has been renamed from ${fromPath} to ${toPath}`);
  });
});

// Useful when 'should.be' doesn't work due to additional space inserted before final word.
Cypress.Commands.add('innerTextShouldEq', { prevSubject: 'element' }, (subject, text) => {
  cy.wrap(subject).should(($elem) => {
    expect($elem.get(0).innerText).to.eq(text);
  });
});

// Useful when 'should.contain' doesn't work due to additional space inserted before final word.
Cypress.Commands.add('innerTextShouldContain', { prevSubject: 'element' }, (subject, text) => {
  cy.wrap(subject).should(($elem) => {
    expect($elem.get(0).innerText).to.contain(text);
  });
});

// Useful when 'should.not.contain' doesn't work due to additional space inserted before final word.
Cypress.Commands.add('innerTextShouldNotContain', { prevSubject: 'element' }, (subject, text) => {
  cy.wrap(subject).should(($elem) => {
    expect($elem.get(0).innerText).to.not.contain(text);
  });
});

// Useful when 'should.not.be' doesn't work due to additional space inserted before final word.
Cypress.Commands.add('innerTextShouldNotEq', { prevSubject: 'element' }, (subject, text) => {
  cy.wrap(subject).should(($elem) => {
    expect($elem.get(0).innerText).to.not.eq(text);
  });
});

// Stores the clipboard contents to an alias for later use
// see https://docs.cypress.io/guides/core-concepts/variables-and-aliases#Sharing-Context
// note: aliases work in the context of as test and only the first test after before
Cypress.Commands.add('saveCopiedPubkyToAlias', (alias: string) => {
  cy.window().then((win) => {
    // ensure focus is on the window before attempting to read clipboard
    win.focus();
    // requires browser to be in focus
    return win.navigator.clipboard.readText().then((text) => {
      // assert that pubky was copied to clipboard in correct format
      expect(text).to.match(/^pk:/);
      return text;
    });
    // previous 'then' is callback of a promise which doesn't guarantee synchronous execution
    // so an additional 'then' is needed to guarantee the alias is stored before the next test step
  }).then((text) => {
    // store pubky as alias
    cy.wrap(text).as(alias);
  });
});

// To prevent Cypress from failing the test when running pubky-app with dev build:
// `Uncaught SyntaxError: Invalid or unexpected token` on Chrome, and
// `Uncaught SyntaxError: "" literal not terminated before end of script` on firefox.
//eslint-disable-next-line @typescript-eslint/no-unused-vars
Cypress.on('uncaught:exception', (_err, _runnable) => {
  return false
})