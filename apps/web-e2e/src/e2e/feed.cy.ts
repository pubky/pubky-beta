import { backupDownloadFilePath } from '../support/auth';
import { slowCypressDown } from 'cypress-slow-down'
// registers the cy.slowDown and cy.slowDownEnd commands
import 'cypress-slow-down/commands'
import { createQuickPost, repostPost } from '../support/posts';
//import { selectEmoji, latestPostInFeedContentEq, deletePost, createQuickPost } from '../support/posts';
//import { defaultMs, fastMs } from '../support/slow-down';

const username = 'Poster';

describe('feed and filters', () => {
  before(() => {
    slowCypressDown();
    cy.deleteDownloadsFolder();

   // Profile 1 and 2 follow eachother and are friends
   const profile1 = {username: "Profile #1", bio: "Follows Profile #2", pubkyAlias: "pubky_1", postText: `Profile 1's post ${Date.now()}`};
   const profile2 = {username: "Profile #2", bio: "Follows Profile #1", pubkyAlias: "pubky_2", postText: `Profile 2's post ${Date.now()}`};
   // Profile 3 follows profile 2 but is not followed back
   const profile3 = {username: "Profile #3", bio: "Follows Profile #2", pubkyAlias: "pubky_3", postText: `Profile 3's post ${Date.now()}`};
   // Profile 4 follows noone and is followed by no-one
   const profile4 = {username: "Profile #4", bio: "Follows no-one", pubkyAlias: "pubky_4", postText: `Profile 4's post ${Date.now()}`};

    // create profile 1 of 4 and post
    cy.onboardAsNewUser(profile1.username, profile1.bio, profile1.pubkyAlias);
    cy.backupRecoveryFile();
    cy.renameFile(backupDownloadFilePath(), backupDownloadFilePath(username + '.pkarr'));
    createQuickPost(profile1.postText);
    cy.signOut(true);

    // create profile 2 of 4, post and repost profile 1's post
    cy.onboardAsNewUser(profile2.username, profile2.bio, profile2.pubkyAlias);
    cy.backupRecoveryFile();
    cy.renameFile(backupDownloadFilePath(), backupDownloadFilePath(profile2.username + '.pkarr'));
    createQuickPost(profile2.postText);
    // find Profile 1's latest post and repost it
    repostPost({repostContent: "Repost of Profile 1's post", filterText: profile1.postText, postIdx: 0});
    
    cy.pause(); // CONTINUE HERE
  });

  beforeEach(() => {
    // in case it gets changed by a test and not reset
    //cy.slowDown(defaultMs);

    // sign in if not already
    cy.location('pathname').then((currentPath) => {
      if (currentPath !== '/home') {
        cy.signIn(backupDownloadFilePath(username + '.pkarr'));
      };
    });
  });

it('can filter to view all posts')
it('can filter to view only posts and reposts of following')
it('can filter view only posts and reposts of friends')
it('can sort by ')
});