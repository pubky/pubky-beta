import { backupDownloadFilePath } from '../support/auth';
import { latestPostInFeedContentEq, createQuickPost, checkPostIsNotAtTopOfFeed } from '../support/posts';
import { slowCypressDown } from 'cypress-slow-down';
import 'cypress-slow-down/commands'
import path = require('path');
import { defaultMs } from '../support/slow-down';
import { searchAndFollowProfile } from '../support/contacts';
import { clickFollowButton } from '../support/profile';

const profile1 = { username: "Notif #1", pubkyAlias: "pubky_1" };
const profile2 = { username: "Notif #2", pubkyAlias: "pubky_2" };

describe('settings', () => {
  before(() => {
    slowCypressDown();
    cy.deleteDownloadsFolder();

    // * create profile 1
    cy.onboardAsNewUser(profile1.username, "", true, profile1.pubkyAlias);
    cy.backupRecoveryFile();
    cy.renameFile(backupDownloadFilePath(), backupDownloadFilePath(profile1.username + '.pkarr'));
    cy.signOut(true);

    // * create profile 2
    cy.onboardAsNewUser(profile2.username, "", true, profile2.pubkyAlias);
    cy.backupRecoveryFile();
    cy.renameFile(backupDownloadFilePath(), backupDownloadFilePath(profile2.username + '.pkarr'));
    cy.signOut(true);
  });

  beforeEach(() => {
    // TODO: remove workaround for pkarr rate limiting
    cy.wait(Cypress.env('ci') ? 10_000 : 5_000);

    // sign in if not already
    cy.location('pathname').then((currentPath) => {
      if (currentPath !== '/home') {
        cy.signIn(backupDownloadFilePath(profile1.username + '.pkarr'));
      };
    });
  });

  it('can be notified for new follower, friend, lost friend', () => {
    // * profile 1 follows profile 2
    cy.get(`@${profile2.pubkyAlias}`).then((pubky) => {
      searchAndFollowProfile(`${pubky}`, profile2.username);
    });
    cy.signOut(true);

    // * profile 2 checks notification for new follower
    cy.signIn(backupDownloadFilePath(profile2.username + '.pkarr'));
    // check notification counter on profile picture is 1
    cy.get('#header-notification-counter').should('have.text', '1');
    // check notification on profile page
    cy.get('#header-profile-pic').click();
    cy.get('#profile-tab-content > div').children().should('have.length', 1).first().within(() => {
      cy.contains(profile1.username)
      cy.contains("followed you");
      // navigate to profile 1 profile page in preparation to follow them
      cy.get('a').contains(profile1.username).click();
    });

    // * profile 2 follows profile 1
    clickFollowButton();
    cy.signOut(true);

    // * profile 1 checks notification for new follower and friend
    cy.signIn(backupDownloadFilePath(profile1.username + '.pkarr'));
    cy.get('#header-notification-counter').should('have.text', '1');
    cy.get('#header-profile-pic').click();
    cy.get('#profile-tab-content > div').children().should('have.length', 1).first().within(() => {
      cy.contains(profile2.username)
      cy.contains("is your friend now");
    });

    // * profile 1 unfollows profile 2
    // * profile 2 checks notification for lost friend
    // * profile 2 unfollows profile 1
    // * profile 1 checks absence of notifications
    // * profile 1 disables follow notifications
    // * profile 2 disables friend notifications
    // * profile 2 follows profile 1
    // * profile 1 checks absence of notifications
    // * profile 1 follows profile 2
    // * profile 2 checks for follow notification? and absence of friend notification
  });

  it('can be notified for tagged post and profile');
  it('can be notified for profile being mentioned in a post');
  it('can be notified for your post being replied and reposted');
  it('can be notified for a post being deleted that you replied and reposted');
  it('can be notified for a post being edited that you replied and reposted');
});
