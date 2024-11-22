import { slowCypressDown } from 'cypress-slow-down';
import path = require('path');

describe('settings', () => {
  before(() => {
    slowCypressDown();
  });

  beforeEach(() => {
    cy.onboardAsNewUser('Mr Settings', 'I like to change settings');
    cy.get('#header-settings-btn').click();
  });

  it('Account settings function correctly', () => {
    // check back up account button shows modal (and store recovery phrase for later)
    cy.get('#backup-account-btn').click();
    cy.get('#modal-root').should('be.visible').within(() => {
      cy.get('#backup-recovery-file-btn').should('be.visible')
      cy.get('#backup-recovery-phrase-btn').should('be.visible').click();
      cy.get('#backup-reveal-confirm-recovery-phrase-btn').should('be.visible').click();
      cy.get('#backup-copy-recovery-phrase').should('be.visible').click();
      cy.saveCopiedTextToAlias('recoveryPhrase');
      // log recovery phase
      cy.get('@recoveryPhrase').then((ss) => { cy.log(`recoveryPhrase: ${ss}`); });
      cy.get('#backup-close-btn').click();
    });

    // check edit profile button shows edit page
    cy.get('#edit-profile-btn').click();
    cy.get('#edit-profile-name-input').should('be.visible');

    // check download your data downloads file

    cy.get('#header-settings-btn').click();
    cy.get('#download-data-btn').click();

    // verify backup file
    const downloadsFolder = Cypress.config('downloadsFolder');
    const expectedSuffix = '_pubky.app.zip';
    cy.task('checkFileExistsWithSuffix', { folder: downloadsFolder, suffix: expectedSuffix }).should('be.true');

    // TODO: check import your data

    // check delete account button shows modal and deletes account
    cy.get('#delete-account-btn').click();
    cy.get('#modal-root').should('be.visible').within(() => {
      cy.get('#delete-account-btn').click();
    });
    cy.location('pathname').should('eq', '/logout');
    // sign back in with recovery phrase saved earlier
    cy.get('#sign-back-in-btn').should('be.visible').click();
    cy.get('@recoveryPhrase').then((rp) => {
      const words = `${rp}`.split(' ');
      words.forEach((word, idx) => {
        cy.get(`#recovery-phrase-input-${idx}`).type(`${word}`);
      });
    });
    cy.get('#sign-in-recovery-phrase-btn').click();
    cy.location('pathname').should('eq', '/onboarding/register');
    cy.get('#message-alert').should('be.visible').should('contain', 'your profile is empty');
  });

  it.skip('Notifications settings is displayed correctly', () => {

  });

  // TODO: add Notifications tests in a separate file

  it.skip('Privacy and Safety settings is displayed correctly', () => {

  });

  // TODO: add Privacy and Safety tests in a separate file

  it.skip('Muted users settings displays muted users', () => {

  });

  it.skip('Language settings:new language can be selected', () => {

  });

  it.skip('Help: FAQ is displayed correctly', () => {

  });

  it.skip('Help: User Guide can be navigated to', () => {

  });

  it.skip('Help: Support link can be used', () => {

  });

});
