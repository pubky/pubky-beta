/// <reference types="cypress" />

import { passInviteCode } from "./common";

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
    waitForFileExistsWithSuffix(folder: string, suffix: string): void;
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
    innerTextContains(text: string): Chainable<Subject>;
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface Chainable<Subject> {
    saveCopiedTextToAlias(alias: string): void;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface Chainable<Subject> {
    waitReload(time?: number): void;
  }
  interface Chainable<Subject> {
    waitReloadWhileElementDoesNotExist(selector: string, attempts?: number): void;
  }
  interface Chainable<Subject> {
    findFirstPostInFeed(filterText?: string): Chainable<Subject>;
  }
  interface Chainable<Subject> {
    findPostInFeed(postIdx?: number, filterText?: string): Chainable<Subject>;
  }
}

Cypress.Commands.add('onboardAsNewUser', (profileName: string, profileBio: string = '', skipOnboardingSlides: boolean = true, pubkyAlias?: string) => {
  cy.visit('/');

  cy.location('pathname').should('eq', '/onboarding');

  cy.get('#onboarding-create-account-btn').click();
  cy.location('pathname').should('eq', '/onboarding/intro');

  if (skipOnboardingSlides) {
    // click 'Skip Intro' button
    cy.get('#onboarding-skip-intro-btn').click();
  } else {
    // click 'Continue' button 6 times to skip onboarding slides
    for (let i = 0; i < 6; i++) {
      cy.get('#onboarding-continue-btn').click();
      if (i < 5) cy.location('pathname').should('eq', '/onboarding/intro');
    };
  };

  passInviteCode();

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
  cy.location('pathname').then((currentPath) => {
    if (currentPath !== '/profile') {
      cy.get('#header-profile-pic').click();
    };
  });

  cy.location('pathname').should('eq', '/profile');

  cy.get('#profile-sign-out-btn').click();

  // sign out model only shows if user has not backed up recovery file
  if (!hasBackedUp) cy.get('#logout-modal-sign-out-btn').click();

  cy.location('pathname').should('eq', '/logout');

  cy.get('#logout-link').click();
  cy.location('pathname').should('eq', '/sign-in');
});

Cypress.Commands.add('signIn', (backupFilepath: string, passcode = '123456') => {
  cy.location('pathname').then((currentPath) => {
    if (currentPath !== '/sign-in') {
      cy.visit('/sign-in');
      passInviteCode();
    };
  });

  cy.location('pathname').then((currentPath) => {
    if (currentPath === '/onboarding/sign-in') {
      cy.visit('/sign-in');
    };
  });

  cy.location('pathname').should('eq', '/sign-in');

  cy.get('#fileInput').selectFile(
    backupFilepath,
    { force: true } // force to bypass visibility check of hidden input field
  );
  cy.get('#sign-in-password-input').type(passcode);
  cy.get('#sign-in-recovery-file-btn').click();

  cy.location('pathname').should('eq', '/home');
});

Cypress.Commands.add('backupRecoveryFile', (passcode = '123456') => {
  // backup recovery file
  cy.get('#remind-backup-now-btn').click();
  cy.get('#backup-recovery-file-btn').click();
  cy.get('#backup-recovery-file-password-input').type(passcode);
  cy.get('#backup-download-recovery-file-btn').click();
  cy.get('#backup-successful-ok-btn').click();
});

Cypress.Commands.add('deleteDownloadsFolder', () => {
  const downloadsFolder = Cypress.config('downloadsFolder');
  cy.task('deleteFolder', downloadsFolder);
});

Cypress.Commands.add('waitForFileExistsWithSuffix', (folder: string, suffix: string) => {
  let attempts = 0;
    const maxAttempts = 5;
    const checkFile = () => {
      cy.task('checkFileExistsWithSuffix', { folder, suffix }).then((exists) => {
        if (exists) {
          return;
        }
        attempts++;
        if (attempts >= maxAttempts) {
          throw new Error(`File with suffix ${suffix} not found after ${maxAttempts} attempts`);
        }
        cy.wait(1000);
        checkFile();
      });
    };
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
Cypress.Commands.add('innerTextContains', { prevSubject: 'element' }, (subject, text) => {
  return cy.wrap(subject).then(($elem) => {
    return $elem.get(0).innerText.includes(text);
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
    // also store pubky in Cypress env to be used in beforeEach to re-create aliases because they are cleared at end of each test
    // e.g. cy.wrap(Cypress.env(profile1.pubkyAlias)).as(profile1.pubkyAlias);
    Cypress.env(alias, text);
  });
});

// Stores the clipboard contents to an alias for later use
// see https://docs.cypress.io/guides/core-concepts/variables-and-aliases#Sharing-Context
// note: aliases work in the context of as test and only the first test after before
Cypress.Commands.add('saveCopiedTextToAlias', (alias: string) => {
  cy.window().then((win) => {
    // ensure focus is on the window before attempting to read clipboard
    win.focus();
    // requires browser to be in focus
    return win.navigator.clipboard.readText();
    // previous 'then' is callback of a promise which doesn't guarantee synchronous execution
    // so an additional 'then' is needed to guarantee the alias is stored before the next test step
  }).then((text) => {
    // store pubky as alias
    cy.wrap(text).as(alias);
  });
});

Cypress.Commands.add('waitReload', (time = 2000) => {
  cy.wait(time).reload();
});

// wait for element to appear by default
Cypress.Commands.add('waitReloadWhileElementDoesNotExist', (selector, attempts = 30) => {
  const go = (attempts: number) => {
    if (attempts <= 0) assert(false, `waitReloadWhileElementDoesNotExist: ${selector} not found`);

    cy.get('body').then(($body) => {
      if ($body.find(selector).length === 0) {
        cy.log(`waitReloadWhileElementDoesNotExist: ${selector} not found; waiting and reloading.`);
        cy.wait(1_000);
        cy.reload();
        // wait for page to load before checking again
        // TODO: improve wait by detecting presence of key element on page (e.g. profile picture)
        cy.wait(Cypress.env('ci') ? 3_000 : 1_000);
        go(attempts - 1);
      } else {
        cy.log(`waitReloadWhileElementDoesNotExist: ${selector} found; continuing.`);
        return;
      }
    });
  };
  cy.log(`waitReloadWhileElementDoesNotExist: starting with selector: ${selector} and attempts: ${attempts}.`);
  go(attempts);
});

const findPostInFeed = (postIdx = 0, filterText?) => {
  // A function to check if timeline contains 'No post yet'.
  // If it does then wait 1 second and check again.
  // This is a wait for the timeline to load after the page loads.
  const checkTimelineReady = (t = 5) => {
    if (t === 0) assert(false, `findPostInFeed: Timeline not loaded`);
    cy.get('#posts-feed').find('#timeline').then(($timeline) => {
      // if contains 'No post yet' then wait 1 second and check again
      cy.wrap($timeline).innerTextContains('No posts yet').then((hasNoPosts) => {
        if (hasNoPosts) {
          cy.log('findPostInFeed: Timeline not loaded; waiting 1 second and checking again');
          cy.wait(1000);
          checkTimelineReady(t - 1);
        }
      });
    });
  };

  // check timeline 5 times to be ready for a post to be found
  checkTimelineReady(5);

  // find the post in the timeline
  cy.get('#posts-feed').find('#timeline').children().should('have.length.gte', 1).then($posts => {
    // optionally filter posts by contained text
    return filterText
      // cannot use :contains due to additional space inserted between each word in the post content
      ? $posts.filter((_idx, element) => element.innerText.includes(filterText))
      : $posts
  }).eq(postIdx);
};

Cypress.Commands.add('findFirstPostInFeed', (filterText?) => {
  findPostInFeed(0, filterText);
});

Cypress.Commands.add('findPostInFeed', (postIdx = 0, filterText?) => {
  findPostInFeed(postIdx, filterText);
});

// workaround for intermittent error seen in CI
Cypress.Commands.add('mockInviteCodeApi', () => {
  cy.intercept('POST', '/api/invite-code', {
    statusCode: 200,
    body: { valid: true }, // Mock response body
  }).as('mockInviteCode');
});

// To prevent Cypress from failing the test when running pubky-app with dev build:
// `Uncaught SyntaxError: Invalid or unexpected token` on Chrome, and
// `Uncaught SyntaxError: "" literal not terminated before end of script` on firefox.
//eslint-disable-next-line @typescript-eslint/no-unused-vars
Cypress.on('uncaught:exception', (_err, _runnable) => {
  return false
})

