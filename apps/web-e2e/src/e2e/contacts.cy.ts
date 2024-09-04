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

    // Search for account 1
    cy.get('@pubky1').then((text) => {
      // type pubky for account 1 into search bar and press enter
      cy.get('#header-search-input').type(`${text}{enter}`);
    });
    // check that account 1 profile page is displayed
    cy.get('#profile-username-header').should('have.text', '#1 Friend');

    // Check follow button is displayed for account 1
    cy.get('#profile-follow-btn').should('be.visible').and('have.text', 'Follow');
    // Follow account 1
    cy.get('#profile-follow-btn').click();
    // Check follow button is now unfollow
    cy.get('#profile-follow-btn').should('not.exist');
    cy.get('#profile-unfollow-btn').should('be.visible').and('have.text', 'Unfollow');

    // Check account 1 profile for followers

    // workaround: reload page to get updated counter
    cy.reload();
    // tag shows number of followers is 1
    cy.get('#profile-tab-followers').find('#counter').should('have.text', 1);
    cy.get('#profile-tab-followers').click();

    // check number of listed followers is 1
    cy.get('#profile-list-root').children().should('have.length', 1)
    cy.get('#profile-list-root').children().first().within(() => {
      // check that account 2 is listed as a follower
      cy.get('#list-profile-name').should('contain.text', '#2 Frien'); // name is truncated in UI https://github.com/pubky/pubky-app/issues/452
      // check 0 tags
      cy.get('#list-tags-counter').should('have.text', 0);
      // check 0 posts
      cy.get('#list-posts-counter').should('have.text', 0);
      // check follower is 'me'
      cy.get('#list-me-button').should('be.visible');
    });

    // Check accounts 2 profile (own) for following

    // Sign out

    // Sign in account 1
    // Check account 1 (own) profile for follower
    // Follow account 2
    // Check account 2 profile for following, follower and friend
    // Check account 1 (own) profile for following and friend
    // Sign out

    // Sign in account 2 (optional)...
    // Check account 2 (own) profile for following, follower and friend
  });
});
