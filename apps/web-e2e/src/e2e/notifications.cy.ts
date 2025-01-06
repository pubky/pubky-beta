import { backupDownloadFilePath } from '../support/auth';
import { createQuickPost } from '../support/posts';
import { slowCypressDown } from 'cypress-slow-down';
import 'cypress-slow-down/commands'
import { searchAndFollowProfile, searchForProfile } from '../support/contacts';
import { clickFollowButton } from '../support/profile';
import { addTags } from '../support/common';
import { checkLatestNotification } from '../support/profile';

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
    // TODO: store pubkys as environment variables in before to avoid need to create from aliases here
    // Re-create the aliases in beforeEach
    cy.log('Re-creating aliases in beforeEach');
    cy.wrap(Cypress.env(profile1.pubkyAlias)).as(profile1.pubkyAlias);
    cy.wrap(Cypress.env(profile2.pubkyAlias)).as(profile2.pubkyAlias);

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

    // * profile 2 checks notification for new follower
    cy.signOut(true);
    // TODO: remove workaround reload for notification counter and tab content not showing correctly, see https://github.com/pubky/pubky-app/issues/810
    cy.waitReload(3000)
    cy.signIn(backupDownloadFilePath(profile2.username + '.pkarr'));
    // wait and reload if notification counter doesn't show
    cy.waitReloadWhileElementDoesNotExist('#header-notification-counter');
    // check notification counter on profile picture is 1
    cy.get('#header-notification-counter').should('have.text', '1');
    // navigate to profile 2 profile page
    cy.get('#header-profile-pic').click();
    // check latest notification on profile page and navigate to profile 1 profile page
    checkLatestNotification([profile1.username, "followed you"], profile1.username);

    // * profile 2 follows profile 1
    clickFollowButton();

    // * profile 1 checks notification for new follower and friend
    cy.signOut(true);
    // TODO: remove workaround reload for notification counter and tab content not showing correctly, see https://github.com/pubky/pubky-app/issues/810
    cy.waitReload(3000)
    cy.signIn(backupDownloadFilePath(profile1.username + '.pkarr'));
    // wait and reload if notification counter doesn't show
    cy.waitReloadWhileElementDoesNotExist('#header-notification-counter');
    // check notification counter on profile picture is 1
    cy.get('#header-notification-counter').should('have.text', '1');
    // navigate to profile 1 profile page
    cy.get('#header-profile-pic').click();
    // check latest notification on profile page
    checkLatestNotification([profile2.username, "is your friend now"]);

    // TODO: add checks for unfollowing
    // * profile 1 unfollows profile 2
    // * profile 2 checks notification for lost friend
    // * profile 2 unfollows profile 1
    // * profile 1 checks absence of notifications

    // TODO: add checks for disabled notifications
    // * profile 1 disables follow notifications
    // * profile 2 disables friend notifications
    // * profile 2 follows profile 1
    // * profile 1 checks absence of notifications
    // * profile 1 follows profile 2
    // * profile 2 checks for follow notification? and absence of friend notification
  });

  it('can be notified for tagged post and profile', () => {
    // * profile 1 creates a post
    createQuickPost(`I will be notified when this post is tagged! ${Date.now()}`);
    //clickShowNewPostsBtn(); dnt need

    // * profile 1 tags profile 2's profile
    cy.get(`@${profile2.pubkyAlias}`).then((pubky) => {
      searchForProfile(`${pubky}`, profile2.username);
    });

    // add one tag to profile
    cy.get('#profile-tag-btn').click();
    const profileTag = 'nice';
    addTags([profileTag], profile2.username);

    // * profile 2 checks for notification for tagged profile
    cy.signOut(true);
    // TODO: remove workaround reload for notification counter and tab content not showing correctly, see https://github.com/pubky/pubky-app/issues/810
    cy.waitReload(3000)
    cy.signIn(backupDownloadFilePath(profile2.username + '.pkarr'));
    // wait and reload if notification counter doesn't show
    cy.waitReloadWhileElementDoesNotExist('#header-notification-counter');
    // check notification counter on profile picture is 1
    cy.get('#header-notification-counter').should('have.text', '1');
    // navigate to profile 2 profile page
    cy.get('#header-profile-pic').click();
    // check latest notification on profile page
    checkLatestNotification([profile1.username, "tagged your profile", profileTag]);

    // * profile 2 tags profile 1's post (from their profile page)
    cy.get(`@${profile1.pubkyAlias}`).then((pubky) => {
      searchForProfile(`${pubky}`, profile1.username);
    });
    // click Posts tab to show profile 1's posts
    cy.get('#profile-tab-posts').click();
    // check profile 1 has at least 1 post and click tag button for the first post
    cy.get('#profile-tab-content').find('#post-container').should('have.length.at.least', 1).first().within(() => {
      cy.get('#tag-btn').click();
    });
    // add one tag to the post
    const postTag = 'ilike';
    addTags([postTag]);

    // * profile 1 checks for notification for tagged post
    cy.signOut(true);
    // TODO: remove workaround reload for notification counter and tab content not showing correctly, see https://github.com/pubky/pubky-app/issues/810
    cy.waitReload(3000)
    cy.signIn(backupDownloadFilePath(profile1.username + '.pkarr'));
    // wait and reload if notification counter doesn't show
    cy.waitReloadWhileElementDoesNotExist('#header-notification-counter');
    cy.get('#header-notification-counter').should('have.text', '1');
    cy.get('#header-profile-pic').click();
    checkLatestNotification([profile2.username, "tagged your post", postTag]);

    // TODO: add checks for disabled notifications
    // * profile 1 disables notifications for tagged profile
    // * profile 2 disables notifications for tagged post
    // * profile 2 creates a post
    // * profile 2 tags profile 1's profile
    // * profile 1 checks for absence of notifications
    // * profile 1 tags profile 2's post
    // * profile 2 checks for absence of notifications
  });

  it('can be notified for profile being mentioned in a post', () => {
    // * profile 1 creates a post mentioning profile 2
    cy.get(`@${profile2.pubkyAlias}`).then((pubky) => {
      createQuickPost(`This is a post for @${pubky}! ${Date.now()}`);
    });
    //clickShowNewPostsBtn(); dnt need

    // * profile 2 checks for notification for being mentioned in a post
    cy.signOut(true);
    // TODO: remove workaround reload for notification counter and tab content not showing correctly, see https://github.com/pubky/pubky-app/issues/810
    cy.waitReload(3000)
    cy.signIn(backupDownloadFilePath(profile2.username + '.pkarr'));
    // wait and reload if notification counter doesn't show
    cy.waitReloadWhileElementDoesNotExist('#header-notification-counter');
    // check notification counter on profile picture is 1
    cy.get('#header-notification-counter').should('have.text', '1');
    // navigate to profile 2 profile page
    cy.get('#header-profile-pic').click();
    // check latest notification on profile page
    checkLatestNotification([profile1.username, "mentioned you in a post"]);

    // TODO: add checks for disabled notifications
    // * profile 2 disables notifications for being mentioned in a post
    // * profile 1 creates a post mentioning profile 2
    // * profile 2 checks for absence of notifications
  });

  it('can be notified for your post being replied and reposted');
  it('can be notified for a post being deleted that you replied and reposted');
  it('can be notified for a post being edited that you replied and reposted');
  it('can display counter for multiple new notifications');
});