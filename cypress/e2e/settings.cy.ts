import { latestPostInFeedContentEq, createQuickPost, checkPostIsNotAtTopOfFeed } from '../support/posts';
import { slowCypressDown } from 'cypress-slow-down';
import 'cypress-slow-down/commands';
import { HasBackedUp } from '../support/types/enums';
import { backupDownloadFilePath } from '../support/auth';

describe('settings', () => {
  before(() => {
    slowCypressDown();
  });

  beforeEach(() => {
    cy.deleteDownloadsFolder();
  });

  it('Account settings function correctly', () => {
    // create a new user
    cy.onboardAsNewUser('Mr Account Settings', 'I like to test account settings');
    cy.get('#header-settings-btn').click();

    // check back up account button shows modal (and store recovery phrase for later)
    cy.get('#backup-account-btn').click();
    cy.get('#modal-root')
      .should('be.visible')
      .within(() => {
        cy.get('#backup-recovery-file-btn').should('be.visible');
        cy.get('#backup-recovery-phrase-btn').should('be.visible').click();
        cy.get('#backup-reveal-confirm-recovery-phrase-btn').should('be.visible').click();
        cy.get('#backup-copy-recovery-phrase').should('be.visible').click();
        cy.saveCopiedTextToAlias('recoveryPhrase');
        // log recovery phase
        cy.get('@recoveryPhrase').then((ss) => {
          cy.log(`recoveryPhrase: ${ss}`);
        });
        cy.get('#backup-close-btn').click();
      });

    // check sign out button
    cy.get('#settings-sign-out-btn').click();
    cy.location('pathname').should('eq', '/logout');

    // sign in with recovery phrase saved earlier
    cy.get('#sign-back-in-btn').should('be.visible').click();
    cy.get('@recoveryPhrase').then((rp) => {
      const words = `${rp}`.split(' ');
      words.forEach((word, idx) => {
        cy.get(`#recovery-phrase-input-${idx}`).type(`${word}`);
      });
    });
    cy.get('#sign-in-recovery-phrase-btn').click();
    cy.location('pathname').should('eq', '/home');
    cy.get('#header-settings-btn').click();

    // check edit profile button shows edit page
    cy.get('#edit-profile-btn').click();
    cy.get('#edit-profile-name-input').should('be.visible');

    // check download your data downloads file

    // navigate to account settings page and click button to download your data
    cy.get('#header-settings-btn').click();
    cy.get('#download-data-btn').should('be.visible').should('contain.text', 'Download').click();

    // asserting that button reads "Downloading..." is unreliable due to timing
    // so just check that it's back to "Download"
    cy.get('#download-data-btn').should('contain.text', 'Download');

    // verify backup file
    const downloadsFolder = Cypress.config('downloadsFolder');
    const expectedSuffix = '_pubky.app.zip';
    cy.waitForFileExistsWithSuffix(downloadsFolder, expectedSuffix);

    // TODO: check import your data

    // check delete account button shows modal and deletes account
    cy.get('#delete-account-btn').click();
    cy.get('#modal-root')
      .should('be.visible')
      .within(() => {
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

  it.skip('Privacy and Safety settings is displayed correctly', () => {});

  // TODO: add Privacy and Safety tests in a separate file

  it('Muted users settings displays muted users and hides posts in feed', () => {
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
    cy.get('@pubky1').then((ss) => {
      cy.log(`pubky1: ${ss}`);
    });

    // sign out
    cy.signOut(HasBackedUp.No);

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
    checkPostIsNotAtTopOfFeed({ postContent });

    // confirm user 1 is now muted in settings page and unmute them
    cy.get('#header-settings-btn').click();
    cy.location('pathname').should('eq', '/settings/account');
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

  it('can save changed to notification settings', () => {
    // create a new user and backup
    cy.onboardAsNewUser('Mr Notifications', 'I like to test notification settings');
    cy.backupRecoveryFile();
    cy.renameFile(backupDownloadFilePath(), backupDownloadFilePath('MrNotifications'));

    // function to navigate to notification settings page
    const navigateToNotificationsPage = () => {
      cy.get('#header-settings-btn').click();
      cy.location('pathname').should('eq', '/settings/account');
      cy.get('#settings-menu-item-notifications').click();
      cy.location('pathname').should('eq', '/settings/notifications');
    };

    // navigate to notification settings page
    navigateToNotificationsPage();

    // disable some notifications
    cy.get('#notification-switch-follow').click();
    cy.get('#notification-switch-lost_friend').click();
    cy.get('#notification-switch-tag_profile').click();
    cy.get('#notification-switch-reply').click();
    cy.get('#notification-switch-post_deleted').click();

    // sign out, sign back in, and navigate to notification settings page
    cy.signOut(HasBackedUp.Yes);
    cy.signIn(backupDownloadFilePath('MrNotifications'));
    navigateToNotificationsPage();

    // function to check notification is enabled
    const checkNotificationIsEnabled = ($toggle: JQuery<HTMLElement>) => {
      cy.wrap($toggle).should('have.class', 'border-white');
    };

    // function to check notification is disabled
    const checkNotificationIsDisabled = ($toggle: JQuery<HTMLElement>) => {
      cy.wrap($toggle).should('not.have.class', 'border-white');
    };

    // check notifications remain enabled
    cy.get('#notification-switch-new_friend').then(checkNotificationIsEnabled);
    cy.get('#notification-switch-tag_post').then(checkNotificationIsEnabled);
    cy.get('#notification-switch-mention').then(checkNotificationIsEnabled);
    cy.get('#notification-switch-repost').then(checkNotificationIsEnabled);
    cy.get('#notification-switch-post_edited').then(checkNotificationIsEnabled);

    // check some notifications remain disabled
    cy.get('#notification-switch-follow').then(checkNotificationIsDisabled);
    cy.get('#notification-switch-lost_friend').then(checkNotificationIsDisabled);
    cy.get('#notification-switch-tag_profile').then(checkNotificationIsDisabled);
    cy.get('#notification-switch-reply').then(checkNotificationIsDisabled);
    cy.get('#notification-switch-post_deleted').then(checkNotificationIsDisabled);

    // disable remaining enabled notifications
    cy.get('#notification-switch-new_friend').click();
    cy.get('#notification-switch-tag_post').click();
    cy.get('#notification-switch-mention').click();
    cy.get('#notification-switch-repost').click();
    cy.get('#notification-switch-post_edited').click();

    // sign out, sign back in, and navigate to notification settings page
    cy.signOut(HasBackedUp.Yes);
    cy.signIn(backupDownloadFilePath('MrNotifications'));
    navigateToNotificationsPage();

    // check all notifications are disabled
    cy.get('#notification-switch-new_friend').then(checkNotificationIsDisabled);
    cy.get('#notification-switch-follow').then(checkNotificationIsDisabled);
    cy.get('#notification-switch-tag_post').then(checkNotificationIsDisabled);
    cy.get('#notification-switch-lost_friend').then(checkNotificationIsDisabled);
    cy.get('#notification-switch-mention').then(checkNotificationIsDisabled);
    cy.get('#notification-switch-tag_profile').then(checkNotificationIsDisabled);
    cy.get('#notification-switch-repost').then(checkNotificationIsDisabled);
    cy.get('#notification-switch-reply').then(checkNotificationIsDisabled);
    cy.get('#notification-switch-post_edited').then(checkNotificationIsDisabled);
    cy.get('#notification-switch-post_deleted').then(checkNotificationIsDisabled);

    // enable some notifications
    cy.get('#notification-switch-follow').click();
    cy.get('#notification-switch-tag_profile').click();
    cy.get('#notification-switch-post_deleted').click();

    // sign out, sign back in, and navigate to notification settings page
    cy.signOut(HasBackedUp.Yes);
    cy.signIn(backupDownloadFilePath('MrNotifications'));
    navigateToNotificationsPage();

    // check some notifications remain enabled
    cy.get('#notification-switch-follow').then(checkNotificationIsEnabled);
    cy.get('#notification-switch-tag_profile').then(checkNotificationIsEnabled);
    cy.get('#notification-switch-post_deleted').then(checkNotificationIsEnabled);

    // check some notifications remain disabled
    cy.get('#notification-switch-new_friend').then(checkNotificationIsDisabled);
    cy.get('#notification-switch-tag_post').then(checkNotificationIsDisabled);
    cy.get('#notification-switch-lost_friend').then(checkNotificationIsDisabled);
    cy.get('#notification-switch-mention').then(checkNotificationIsDisabled);
    cy.get('#notification-switch-repost').then(checkNotificationIsDisabled);
    cy.get('#notification-switch-reply').then(checkNotificationIsDisabled);
    cy.get('#notification-switch-post_edited').then(checkNotificationIsDisabled);
  });

  it.skip('Language settings:new language can be selected', () => {});

  it.skip('Help: FAQ is displayed correctly', () => {});

  it.skip('Help: User Guide can be navigated to', () => {});

  it.skip('Help: Support link can be used', () => {});
});
