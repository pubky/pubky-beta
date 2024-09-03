import { backupDownloadFilePath } from '../support/auth';
import { saveCopiedPubkyToAlias } from '../support/profile';
import { slowCypressDown } from 'cypress-slow-down';

describe('contacts', () => {
  before(() => {
    slowCypressDown(200);
    cy.deleteDownloadsFolder();
    cy.allowClipboardForChrome();
  });

  it('can follow, be followed and make a friend', () => {
    // Create account 1
    cy.onboardAsNewUser('#1 Friend', "Man's best friend");

    // Backup
    cy.backupRecoveryFile();
    cy.renameFile(backupDownloadFilePath(), backupDownloadFilePath('pubky1.pkarr'));

    // Copy and store pubky for account 1
    cy.get('#header-profile-pic').click();
    cy.get('#profile-copy-pubkey-btn').click();
    saveCopiedPubkyToAlias('pubky1');
    cy.get('@pubky1').then((ss) => { cy.log(`pubky1: ${ss}`); });

    // Sign out of account 1
    cy.signOut(true);

    // Create account 2
    cy.onboardAsNewUser('#2 Friend', "Man's second best friend");

    // Backup
    cy.backupRecoveryFile();
    cy.renameFile(backupDownloadFilePath(), backupDownloadFilePath('pubky2.pkarr'));

    // Copy and store pubky for account 2
    cy.get('#header-profile-pic').click();
    cy.get('#profile-copy-pubkey-btn').click();
    saveCopiedPubkyToAlias('pubky2');
    cy.get('@pubky2').then((ss) => { cy.log(`pubky2: ${ss}`); });

    // Add account 1 as friend
    cy.get('@pubky1').then((text) => {
      // type pubky for account 1 into search bar and press enter
      cy.get('#header-search-input').type(`${text}{enter}`);
    });
    // check that account 1 profile page is displayed
    cy.get('#profile-username-header').should('have.text', '#1 Friend');

    // Check profile for following
    // Sign out

    // Sign in account 1
    // Check profile for follower
    // Follow account 2
    // Check profile for following and follower
    // Sign out

    // Sign in account 2
    // Check profile for following, follower and friend
  });
});
