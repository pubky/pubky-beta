import { backupDownloadFilePath } from '../support/auth';
import { slowCypressDown } from 'cypress-slow-down'
// registers the cy.slowDown and cy.slowDownEnd commands
import 'cypress-slow-down/commands'
import { createQuickPost, repostPost } from '../support/posts';
import { searchAndFollowProfile } from '../support/contacts';
//import { selectEmoji, latestPostInFeedContentEq, deletePost, createQuickPost } from '../support/posts';
//import { defaultMs, fastMs } from '../support/slow-down';

// Profile 1 and 2 follow eachother and are friends
const profile1 = {username: "Profile #1", bio: "Follows Profile #2", pubkyAlias: "pubky_1", postText1: `Profile 1's post ${Date.now()}`, postText2: `Profile 1's post to be reposted ${Date.now()}`};
const profile2 = {username: "Profile #2", bio: "Follows Profile #1", pubkyAlias: "pubky_2", postText: `Profile 2's post ${Date.now()}`, repostText: "Repost of Profile 1's post"};
// Profile 3 follows profile 2 but is not followed back
const profile3 = {username: "Profile #3", bio: "Follows Profile #2", pubkyAlias: "pubky_3", postText: `Profile 3's post ${Date.now()}`};
// Profile 4 follows noone and is followed by no-one
const profile4 = {username: "Profile #4", bio: "Follows no-one", pubkyAlias: "pubky_4", postText: `Profile 4's post ${Date.now()}`};

describe('feed and filters', () => {
  before(() => {
    slowCypressDown();
    cy.deleteDownloadsFolder();

    // * create profile 1 of 4 and post
    cy.onboardAsNewUser(profile1.username, profile1.bio, profile1.pubkyAlias);
    cy.backupRecoveryFile();
    cy.renameFile(backupDownloadFilePath(), backupDownloadFilePath(profile1.username + '.pkarr'));
    createQuickPost(profile1.postText1);
    createQuickPost(profile1.postText2);
    cy.signOut(true);

    // * create profile 2 of 4, post and repost profile 1's post
    cy.onboardAsNewUser(profile2.username, profile2.bio, profile2.pubkyAlias);
    cy.backupRecoveryFile();
    cy.renameFile(backupDownloadFilePath(), backupDownloadFilePath(profile2.username + '.pkarr'));
    createQuickPost(profile2.postText);
    // find Profile 1's latest post and repost it
    repostPost({repostContent: profile2.repostText, filterText: profile1.postText2});
    // follow Profile 1
    cy.get(`@${profile1.pubkyAlias}`).then((pubky) => {
      searchAndFollowProfile(`${pubky}`, profile1.username);
    });
    cy.signOut(true);

    // sign back in as profile 1 and follow profile 2
    cy.signIn(backupDownloadFilePath(profile1.username + '.pkarr'));
    // follow Profile 2
    cy.get(`@${profile2.pubkyAlias}`).then((pubky) => {
      searchAndFollowProfile(`${pubky}`, profile2.username);
    });
    cy.signOut(true);

    // * create profile 3 of 4, post and repost profile 2's post
    cy.onboardAsNewUser(profile3.username, profile3.bio, profile3.pubkyAlias);
    cy.backupRecoveryFile();
    cy.renameFile(backupDownloadFilePath(), backupDownloadFilePath(profile3.username + '.pkarr'));
    createQuickPost(profile3.postText);
    // follow profile 2
    cy.get(`@${profile2.pubkyAlias}`).then((pubky) => {
      searchAndFollowProfile(`${pubky}`, profile2.username);
    });
    cy.signOut(true);

    // * create profile 4 of 4 and post
    cy.onboardAsNewUser(profile4.username, profile4.bio, profile4.pubkyAlias);
    cy.backupRecoveryFile();
    cy.renameFile(backupDownloadFilePath(), backupDownloadFilePath(profile4.username + '.pkarr'));
    createQuickPost(profile4.postText);
    cy.signOut(true);
  });

it('can filter to view all posts', () => {
  // * sign in as profile 2 and view Reach All posts, all can be seen
  cy.signIn(backupDownloadFilePath(`${profile2.username}.pkarr`));
  // Reach All is the default view so no need to click

  // check all posts are visible
  cy.findPostInFeed(profile1.postText1).should('be.visible');
  cy.findPostInFeed(profile1.postText2).should('be.visible');
  cy.findPostInFeed(profile2.postText).should('be.visible');
  cy.findPostInFeed(profile2.repostText).should('be.visible');
  cy.findPostInFeed(profile3.postText).should('be.visible');
  cy.findPostInFeed(profile4.postText).should('be.visible');

  cy.signOut(true);

  // sign in as profile 4 and view Reach All posts, all can be seen
  cy.signIn(backupDownloadFilePath(`${profile4.username}.pkarr`));
  // Reach All is the default view so no need to click

  // check all posts are visible
  cy.findPostInFeed(profile1.postText1).should('be.visible');
  cy.findPostInFeed(profile1.postText2).should('be.visible');
  cy.findPostInFeed(profile2.postText).should('be.visible');
  cy.findPostInFeed(profile2.repostText).should('be.visible');
  cy.findPostInFeed(profile3.postText).should('be.visible');
  cy.findPostInFeed(profile4.postText).should('be.visible');
});

it('can filter to view only posts and reposts of following', () => {
  // * sign in as profile 2 and view Reach Following, profile 1's posts can be seen
  cy.signIn(backupDownloadFilePath(`${profile2.username}.pkarr`));
  cy.get('#reach-following-btn').click();

  // check only profile 1's posts are visible
  cy.findPostInFeed(profile1.postText1).should('be.visible');
  cy.findPostInFeed(profile1.postText2).should('be.visible');
  cy.cannotFindPostInFeed(profile2.postText);
  // CONTINUE HERE


  // * sign in as profile 3 and view Reach Following, only profile 2's post can be seen

  // * sign in as profile 4 and view Reach Following, no posts can be seen
});
it('can filter view only posts and reposts of friends')
it('can sort by ')
});