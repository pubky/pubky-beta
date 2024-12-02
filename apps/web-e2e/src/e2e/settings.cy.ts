import { backupDownloadFilePath } from '../support/auth';
import { latestPostInFeedContentEq, createQuickPost, checkPostIsNotAtTopOfFeed } from '../support/posts';
import { slowCypressDown } from 'cypress-slow-down';
import 'cypress-slow-down/commands'
import path = require('path');
import { defaultMs } from '../support/slow-down';

describe('settings', () => {
  before(() => {
    slowCypressDown();
  });

  beforeEach(() => {
    // TODO: remove workaround for pkarr rate limiting
    cy.wait(3_000);

    cy.deleteDownloadsFolder();
  });

  it('Account settings function correctly', () => {
    // create a new user
    cy.onboardAsNewUser('Mr Account Settings', 'I like to test account settings');
    cy.get('#header-settings-btn').click();

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

    // navigate to account settings page and click button to download your data
    cy.get('#header-settings-btn').click();
    cy.get('#download-data-btn').should('be.visible').should('contain.text', 'Download').click();

    // asserting that button reads "Downloading..." is unreliable due to timing
    // so just check that it's back to "Download"
    cy.get('#download-data-btn').should('contain.text', 'Download')

    // verify backup file
    const downloadsFolder = Cypress.config('downloadsFolder');
    const expectedSuffix = '_pubky.app.zip';
    cy.waitForFileExistsWithSuffix(downloadsFolder, expectedSuffix);

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

    // TODO: remove workaround for indefinite loading issue on sign in button
    cy.wait(2000).reload();

    cy.location('pathname').should('eq', '/onboarding/register');
    cy.get('#message-alert').should('be.visible').should('contain', 'your profile is empty');
  });

  it.skip('Notifications settings is displayed correctly', () => {

  });

  // TODO: add Notifications tests in a separate file

  it.skip('Privacy and Safety settings is displayed correctly', () => {

  });

  // TODO: add Privacy and Safety tests in a separate file

  // TODO: skipped due to https://github.com/pubky/pubky-app/issues/693
  it.skip('Muted users settings displays muted users and hides posts in feed', () => {
    // create user 1
    cy.onboardAsNewUser('Mr Muted', 'I like to be muted');

    // post something
    const postContent = `I can be muted! ${Date.now()}`;
    createQuickPost(postContent);

    // Copy and store pubky for account 1
    cy.get('#header-profile-pic').click();
    cy.get('#profile-copy-pubkey-btn').click();
    cy.saveCopiedPubkyToAlias('pubky1');
    // log pubky for account 2
    cy.get('@pubky1').then((ss) => { cy.log(`pubky1: ${ss}`); });

    // sign out
    cy.signOut(false);

    // create user 2
    cy.onboardAsNewUser('Mr Mute', 'I like to mute people');

    // view user 1's post
    latestPostInFeedContentEq(postContent);

    // confirm that no users are muted yet in settings page
    cy.get('#header-settings-btn').click();
    cy.get('#settings-menu-item-muted_users').click();
    cy.get('#muted-users-root').within(() => {
      cy.get('h2:contains("No muted users yet")').should('be.visible');
    });

    // mute user 1
    cy.get('@pubky1').then((text) => {
      // type pubky for account 1 into search bar and press enter
      cy.get('#header-search-input').type(`${text}{enter}`);
    });
    cy.get('#profile-menu-btn').click();
    cy.get('#profile-menu-item-mute').click();

    // check user 1's post is no longer seen in feed
    cy.get('#header-home-btn').click();
    checkPostIsNotAtTopOfFeed(postContent);

    // confirm user 1 is now muted in settings page and unmute them
    cy.get('#header-settings-btn').click();
    cy.location('search').should('eq', '?section=account');
    cy.get('#settings-menu-item-muted_users').should('be.visible').click();
    cy.get('#muted-users-root').within(() => {
      cy.get('div:contains("Mr Muted")').should('be.visible');
      cy.get('#unmute-btn').click();
      cy.get('#mute-btn').should('be.visible');
    });

    // check user 1's post is seen in feed again
    cy.get('#header-home-btn').click();
    latestPostInFeedContentEq(postContent);

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
