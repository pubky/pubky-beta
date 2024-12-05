import path = require('path');
import { backupFilename } from '../support/auth';
import { slowCypressDown } from 'cypress-slow-down';

describe('onboarding', () => {
  before(() => {
    slowCypressDown();
  });

  beforeEach(() => {
    cy.deleteDownloadsFolder();
    // TODO: remove workaround for pkarr rate limiting
    cy.wait(Cypress.env('ci') ? 10_000 : 5_000);
  });

  it('can onboard as a new user, viewing onboarding slides, go to home and logout', () => {
    // onboard as new user without skipping onboarding slides
    cy.onboardAsNewUser('Satoshi Nakamoto', 'I am cypherpunk', false);
    cy.signOut(false);
  });

  it('should login, skipping onboarding slides, save recovery file and use it to log back in', () => {
    const username = 'satoshin';
    cy.onboardAsNewUser(username);
    cy.backupRecoveryFile('666942');

    // verify backup file
    const downloadsFolder = Cypress.config('downloadsFolder');
    const expectedFilePath = path.join(downloadsFolder, backupFilename());
    cy.readFile(expectedFilePath).should('exist');

    cy.signOut(true);
    cy.signIn(expectedFilePath, '666942');

    cy.get('#header-profile-pic').click();
    cy.location('pathname').should('eq', '/profile');
    cy.get('#profile-username-header').invoke('text').should('eq', username);
  });
  
  // todo
  it.skip('should allow anonymously view-only mode without creating a key', () => {});

});