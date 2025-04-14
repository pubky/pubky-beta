import { backupDownloadFilePath } from '../support/auth';
import { slowCypressDown } from 'cypress-slow-down';
import { searchAndFollowProfile } from '../support/contacts';
import { HasBackedUp } from '../support/types/enums';

describe('contacts', () => {
  before(() => {
    slowCypressDown();

    cy.deleteDownloadsFolder();
  });

  it('follow, be followed, and make a friend', () => {
    cy.on('uncaught:exception', (_err, _runnable) => {
      // returning false here prevents Cypress from failing the test on uncaught exception
      return false;
    });

    //
    // create two accounts
    //

    // Create account 1
    cy.onboardAsNewUser('#1 Friend', "Man's best friend");

    // Backup
    cy.backupRecoveryFile();
    cy.renameFile(backupDownloadFilePath(), backupDownloadFilePath('pubky1'));

    // Copy and store pubky for account 1
    cy.get('#header-profile-pic').click();
    cy.get('#profile-copy-pubkey-btn').click();
    cy.saveCopiedPubkyToAlias('pubky1');
    // log pubky for account 1
    cy.get('@pubky1').then((ss) => {
      cy.log(`pubky1: ${ss}`);
    });

    // Sign out of account 1
    cy.signOut(HasBackedUp.Yes);

    // Create account 2
    cy.onboardAsNewUser('#2 Friend', "Man's second best friend");

    // Backup
    cy.backupRecoveryFile();
    cy.renameFile(backupDownloadFilePath(), backupDownloadFilePath('pubky2'));

    // Copy and store pubky for account 2
    cy.get('#header-profile-pic').click();
    cy.get('#profile-copy-pubkey-btn').click();
    cy.saveCopiedPubkyToAlias('pubky2');
    // log pubky for account 2
    cy.get('@pubky2').then((ss) => {
      cy.log(`pubky2: ${ss}`);
    });

    //
    // search for profile and follow
    //

    // follow account 1
    cy.get('@pubky1').then((pubky) => {
      searchAndFollowProfile(`${pubky}`, '#1 Friend');
    });

    //
    // check other profile shows me as new follower
    //

    // Check account 1 profile for updated followers
    // TODO: remove reload page to get updated counter https://github.com/pubky/pubky-app/issues/395
    cy.waitReload(1000);

    // check followers tab and click it
    cy.get('#profile-tab-followers').within(($tab) => {
      cy.get('#counter').should('have.text', '1');
      cy.get('#label').should('have.text', 'Followers');
      cy.wrap($tab).click();
    });

    // check number of listed followers is 1
    cy.get('#profile-list-root')
      .children('.w-full')
      .should('have.length', 1)
      .first()
      .within(() => {
        // check that account 2 is listed as a follower
        cy.get('#list-profile-name').should('have.text', '#2 Friend');
        // check 0 tags
        cy.get('#list-tags-counter').should('have.text', 0);
        // check 0 posts
        cy.get('#list-posts-counter').should('have.text', 0);
        // check follower is 'me'
        cy.get('#list-me-label').should('be.visible');
      });

    // check number of listed following is 0
    cy.get('#profile-tab-following').find('#counter').should('have.text', 0);
    cy.get('#profile-tab-following').click();
    // check message is displayed indicating no following
    cy.get('#profile-tab-content').should('contain.text', 'No following yet');

    // check number of listed friends is 0
    cy.get('#profile-tab-friends').find('#counter').should('have.text', 0);
    cy.get('#profile-tab-friends').click();
    // check message is displayed indicating no friends
    cy.get('#profile-tab-content').should('contain.text', 'No friends yet');

    ///
    /// check own profile shows new following
    ///

    // Check accounts 2 profile (own) for updated following
    cy.get('#header-profile-pic').click();
    // tab shows number of following is 1
    cy.get('#profile-tab-following').find('#counter').should('have.text', 1);

    // check number of listed following is 1
    cy.get('#profile-tab-following').should('contain.text', 'Following');
    cy.get('#profile-tab-following').click();
    cy.get('#profile-list-root')
      .children('.w-full')
      .should('have.length', 1)
      .first()
      .within(() => {
        // check that account 1 is listed as a following
        // name is truncated in UI https://github.com/pubky/pubky-app/issues/452
        cy.get('#list-profile-name').should('contain.text', '#1 Frien');
        // check 0 tags
        cy.get('#list-tags-counter').should('have.text', 0);
        // check 0 posts
        cy.get('#list-posts-counter').should('have.text', 0);
        // check option to unfollow account 1
        cy.get('#list-unfollow-button').should('be.visible');
      });

    // check number of listed followers is 0
    cy.get('#profile-tab-followers').find('#counter').should('have.text', 0);
    cy.get('#profile-tab-followers').click();
    // check message is displayed indicating no followers
    cy.get('#profile-tab-content').should('contain.text', 'Looking for followers?');

    // check number of listed friends is 0
    cy.get('#profile-tab-friends').find('#counter').should('have.text', 0);
    cy.get('#profile-tab-friends').click();
    // check message is displayed indicating no friends
    cy.get('#profile-tab-content').should('contain.text', 'No friends yet');

    // Sign out
    cy.signOut(HasBackedUp.Yes);

    //
    // follow back and make a friend
    //

    // Sign in account 1
    cy.signIn(backupDownloadFilePath('pubky1'));
    cy.get('#header-profile-pic').click();

    // Check account 1 (own) profile for follower
    cy.get('#profile-tab-followers').find('#counter').should('have.text', 1);
    cy.get('#profile-tab-followers').click();
    cy.get('#profile-list-root')
      .children('.w-full')
      .should('have.length', 1)
      .first()
      .within(() => {
        // check that account 2 is listed as a follower
        // name is truncated in UI https://github.com/pubky/pubky-app/issues/452
        cy.get('#list-profile-name').should('contain.text', '#2 Friend');
        // check 0 tags
        cy.get('#list-tags-counter').should('have.text', 0);
        // check 0 posts
        cy.get('#list-posts-counter').should('have.text', 0);
        // check follower is 'me'
        cy.get('#list-follow-button').should('be.visible');
        // click follow button to make account 2 a friend
        cy.get('#list-follow-button').click();
      });

    // workaround: reload page to get updated counter https://github.com/pubky/pubky-app/issues/395
    cy.waitReload(1000);

    // tab shows number of following is 1
    cy.get('#profile-tab-following').find('#counter').should('have.text', 1);
    // tab shows number of friends is 1
    cy.get('#profile-tab-friends').find('#counter').should('have.text', 1);

    // check number of listed friends is 1
    cy.get('#profile-tab-friends').should('contain.text', 'Friends');
    cy.get('#profile-tab-friends').click();
    cy.get('#profile-list-root')
      .children('.w-full')
      .should('have.length', 1)
      .first()
      .within(() => {
        // check that account 2 is listed as a friend
        // name is truncated in UI https://github.com/pubky/pubky-app/issues/452
        cy.get('#list-profile-name').should('contain.text', '#2 Frien');
        // check 0 tags
        cy.get('#list-tags-counter').should('have.text', 0);
        // check 0 posts
        cy.get('#list-posts-counter').should('have.text', 0);
        // check option to unfollow account 1
        cy.get('#list-unfollow-button').should('be.visible');
      });
  });
});
