import moment = require('moment');
import path = require('path');
import { slowCypressDown } from 'cypress-slow-down'

describe('onboarding', () => {
  beforeEach(() => {
    cy.viewport(1920, 1080);
    slowCypressDown(200);
    // workaround the issue of page content not always loading on first visit
    cy.visit('/onboarding');
  });

  it('should onboard a new user, go to home and logout', () => {
    onboardAsNewUser('Satoshi Nakamoto', 'I am cypherpunk');
    signOut(false);
  });

  it('should login, save recovery file and use it to log back in', () => {
    const username = 'satoshin';
    onboardAsNewUser(username)

    // backup recovery file
    cy.get('#remind-backup-now-btn').click();
    cy.get('#backup-recovery-file-btn').click();
    cy.get('#backup-recovery-file-password-input').type('123456');
    cy.get('#backup-download-recovery-file-btn').click();

    // verify backup file
    const downloadsFolder = Cypress.config('downloadsFolder');
    const expectedFileName = `pubky_recovery_${moment().format('YYYY-MM-DD')}.pkarr`;
    const expectedFilePath = path.join(downloadsFolder, expectedFileName);
    cy.readFile(expectedFilePath).should('exist');

    signOut(true);

    cy.location('pathname').should('eq', '/sign-in');

    cy.get('#fileInput').selectFile(expectedFilePath,
      { force: true } // force to bypass visibility check of hidden input field
    );
    cy.get('#onboarding-password-input').type('123456');
    cy.get('#onboarding-sign-in-button').click();

    cy.location('pathname').should('eq', '/home');

    cy.get('#header-profile-pic').click();
    cy.location('pathname').should('eq', '/profile');
    cy.get('#profile-username-header').invoke('text').should('eq', username);
  });
});

// todo: move to shared helpers file
const onboardAsNewUser = (profileName, profileBio = '') => {
  cy.visit('/onboarding');

  cy.get('#onboarding-get-started-link').click();
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
};

const signOut = (hasBackedUp) => {
    cy.get('#header-profile-pic').click();
    cy.location('pathname').should('eq', '/profile');

    cy.get('#profile-sign-out-btn').click();

    // sign out model only shows if user has not backed up recovery file
    if (!hasBackedUp) cy.get('#logout-modal-sign-out-btn').click();

    cy.location('pathname').should('eq', '/logout');

    cy.get('#logout-link').click();
    cy.location('pathname').should('eq', '/sign-in');
};
