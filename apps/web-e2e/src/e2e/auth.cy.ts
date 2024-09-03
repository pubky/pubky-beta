import path = require('path');
import { backupFilename } from '../support/auth';
import { slowCypressDown } from 'cypress-slow-down';

describe('onboarding', () => {
  before(() => {
    slowCypressDown(200);
    cy.deleteDownloadsFolder();
  });

  it('should onboard a new user, go to home and logout', () => {
    cy.onboardAsNewUser('Satoshi Nakamoto', 'I am cypherpunk');
    cy.signOut(false);
  });

  it('should login, save recovery file and use it to log back in', () => {
    const username = 'satoshin';
    cy.onboardAsNewUser(username);
    cy.backupRecoveryFile('666942');

    // verify backup file
    const downloadsFolder = Cypress.config('downloadsFolder');
    const expectedFilePath = path.join(downloadsFolder, backupFilename());
    cy.readFile(expectedFilePath).should('exist');

    cy.signOut(true);

    cy.location('pathname').should('eq', '/sign-in');

    cy.get('#fileInput').selectFile(
      expectedFilePath,
      { force: true } // force to bypass visibility check of hidden input field
    );
    cy.get('#onboarding-password-input').type('666942');
    cy.get('#onboarding-sign-in-button').click();

    cy.location('pathname').should('eq', '/home');

    cy.get('#header-profile-pic').click();
    cy.location('pathname').should('eq', '/profile');
    cy.get('#profile-username-header').invoke('text').should('eq', username);
  });
  
  // todo
  it.skip('should allow anonymously view-only mode without creating a key', () => {});

});