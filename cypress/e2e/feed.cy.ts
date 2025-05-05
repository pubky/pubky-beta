import { backupDownloadFilePath } from '../support/auth';
import { slowCypressDown } from 'cypress-slow-down';
// registers the cy.slowDown and cy.slowDownEnd commands
import 'cypress-slow-down/commands';
import {
  cannotFindPostInFeed,
  checkPostIsAtIndexInFeed,
  countPostsInFeed,
  createQuickPost,
  fastTagPostInFeed,
  repostPost,
  waitForFeedToLoad
} from '../support/posts';
import { searchAndFollowProfile } from '../support/contacts';
import { HasBackedUp, SkipOnboardingSlides } from '../support/types/enums';

// Profile 1 follows Profile 2 and is friends with Profile 2. Profile 1 also follows Profile 3 and Profile 4.
const profile1 = {
  username: 'Profile #1',
  bio: 'Follows Profile #2',
  pubkyAlias: 'pubky_1',
  postText1: `Profile 1's post ${Date.now()}`,
  postText2: `Profile 1's post to be reposted ${Date.now()}`
};
// Profile 2 follows Profile 1 and is friends with Profile 1.
const profile2 = {
  username: 'Profile #2',
  bio: 'Follows Profile #1',
  pubkyAlias: 'pubky_2',
  postText: `Profile 2's post ${Date.now()}`,
  repostText: "Repost of Profile 1's post"
};
// Profile 3 follows profile 2 but is not followed back
const profile3 = {
  username: 'Profile #3',
  bio: 'Follows Profile #2',
  pubkyAlias: 'pubky_3',
  postText: `Profile 3's post ${Date.now()}`
};
// Profile 4 follows noone and is followed by no-one
const profile4 = {
  username: 'Profile #4',
  bio: 'Follows no-one',
  pubkyAlias: 'pubky_4',
  postText: `Profile 4's post ${Date.now()}`
};

describe('feed and filters', () => {
  before(() => {
    slowCypressDown();
    cy.deleteDownloadsFolder();

    // * create profile 1 of 4 and post
    cy.onboardAsNewUser(profile1.username, profile1.bio, SkipOnboardingSlides.Yes, profile1.pubkyAlias);
    cy.backupRecoveryFile();
    cy.renameFile(backupDownloadFilePath(), backupDownloadFilePath(profile1.username));
    createQuickPost(profile1.postText1);
    createQuickPost(profile1.postText2);
    cy.signOut(HasBackedUp.Yes);

    // * create profile 2 of 4, post and repost profile 1's post
    cy.onboardAsNewUser(profile2.username, profile2.bio, SkipOnboardingSlides.Yes, profile2.pubkyAlias);
    cy.backupRecoveryFile();
    cy.renameFile(backupDownloadFilePath(), backupDownloadFilePath(profile2.username));
    createQuickPost(profile2.postText);
    // find Profile 1's latest post and repost it
    repostPost({ repostContent: profile2.repostText, filterText: profile1.postText2 });
    // follow Profile 1
    cy.get(`@${profile1.pubkyAlias}`).then((pubky) => {
      searchAndFollowProfile(`${pubky}`, profile1.username);
    });
    cy.signOut(HasBackedUp.Yes);

    // * create profile 3 of 4, post and repost profile 2's post
    cy.onboardAsNewUser(profile3.username, profile3.bio, SkipOnboardingSlides.Yes, profile3.pubkyAlias);
    cy.backupRecoveryFile();
    cy.renameFile(backupDownloadFilePath(), backupDownloadFilePath(profile3.username));
    createQuickPost(profile3.postText);
    // follow profile 2
    cy.get(`@${profile2.pubkyAlias}`).then((pubky) => {
      searchAndFollowProfile(`${pubky}`, profile2.username);
    });
    cy.signOut(HasBackedUp.Yes);

    // * create profile 4 of 4 and post
    cy.onboardAsNewUser(profile4.username, profile4.bio, SkipOnboardingSlides.Yes, profile4.pubkyAlias);
    cy.backupRecoveryFile();
    cy.renameFile(backupDownloadFilePath(), backupDownloadFilePath(profile4.username));
    createQuickPost(profile4.postText);
    // tag profile 3's post 5 times for max popularity
    fastTagPostInFeed(['p3tag1', 'p3tag2', 'p3tag3', 'p3tag4', 'p3tag5'], profile3.postText);
    // tag profile 2's post 4 times to make it the second most popular
    fastTagPostInFeed(['p2tag1', 'p2tag2', 'p2tag3', 'p2tag4'], profile2.postText);
    cy.signOut(HasBackedUp.Yes);

    // * sign back in as profile 1 and follow profile 2, 3 and 4.
    cy.signIn(backupDownloadFilePath(profile1.username));
    [profile2, profile3, profile4].forEach((profile) => {
      cy.get(`@${profile.pubkyAlias}`).then((pubky) => {
        searchAndFollowProfile(`${pubky}`, profile.username);
      });
    });
    cy.signOut(HasBackedUp.Yes);
  });

  it('can filter to view all posts in the recent sorting order (default view)', () => {
    // * sign in as profile 2 and view Reach All posts, all can be seen
    cy.signIn(backupDownloadFilePath(profile2.username));
    // Reach All is the default view so no need to click
    // Recent is the default sort so no need to click

    // check all posts are visible
    cy.findFirstPostInFeedFiltered(profile1.postText1).should('be.visible');
    cy.findFirstPostInFeedFiltered(profile1.postText2).should('be.visible');
    cy.findFirstPostInFeedFiltered(profile2.postText).should('be.visible');
    cy.findFirstPostInFeedFiltered(profile2.repostText).should('be.visible');
    cy.findFirstPostInFeedFiltered(profile3.postText).should('be.visible');
    cy.findFirstPostInFeedFiltered(profile4.postText).should('be.visible');

    // check posts are in the correct order
    checkPostIsAtIndexInFeed(profile4.postText, 0);
    checkPostIsAtIndexInFeed(profile3.postText, 1);
    checkPostIsAtIndexInFeed(profile2.repostText, 2);
    checkPostIsAtIndexInFeed(profile2.postText, 3);
    checkPostIsAtIndexInFeed(profile1.postText2, 4);
    checkPostIsAtIndexInFeed(profile1.postText1, 5);

    cy.signOut(HasBackedUp.Yes);

    // * sign in as profile 4 and view Reach All posts, all can be seen
    cy.signIn(backupDownloadFilePath(profile4.username));
    // Reach All is the default view so no need to click

    // TODO: remove refresh hen bug is fixed, see https://github.com/pubky/pubky-app/issues/924
    cy.reload();
    waitForFeedToLoad();

    // check all posts are visible
    cy.findFirstPostInFeedFiltered(profile1.postText1).should('be.visible');
    cy.findFirstPostInFeedFiltered(profile1.postText2).should('be.visible');
    cy.findFirstPostInFeedFiltered(profile2.postText).should('be.visible');
    cy.findFirstPostInFeedFiltered(profile2.repostText).should('be.visible');
    cy.findFirstPostInFeedFiltered(profile3.postText).should('be.visible');
    cy.findFirstPostInFeedFiltered(profile4.postText).should('be.visible');

    // * check some Hot tags are visible
    cy.get('#right-sidebar')
      .find('#hot-tags')
      .should('be.visible')
      .within(() => {
        cy.get('#hot-tags-content').should('be.visible').innerTextShouldNotContain('No tags yet');
        // TODO: uncomment when hot tags show as expected, see https://github.com/pubky/pubky-app/issues/842
        //.find('a').should('have.length.above', 5);
      });
  });

  it('can filter to view only posts and reposts of following', () => {
    // * sign in as profile 2 and view Reach Following, only profile 1's posts can be seen
    cy.signIn(backupDownloadFilePath(profile2.username));
    // click the following button in the leftmost (first) sidebar item
    cy.get('#left-sidebar').find('#reach-following-btn').click();
    waitForFeedToLoad();

    cy.findFirstPostInFeedFiltered(profile1.postText1).should('be.visible');
    cy.findFirstPostInFeedFiltered(profile1.postText2).should('be.visible');
    // can see own posts
    cy.findFirstPostInFeedFiltered(profile2.postText).should('be.visible');
    cy.findFirstPostInFeedFiltered(profile2.repostText).should('be.visible');
    cannotFindPostInFeed(profile3.postText);
    cannotFindPostInFeed(profile4.postText);

    cy.signOut(HasBackedUp.Yes);

    // * sign in as profile 3 and view Reach Following, only profile 2's post can be seen
    cy.signIn(backupDownloadFilePath(profile3.username));
    cy.get('#left-sidebar').find('#reach-following-btn').click();
    waitForFeedToLoad();

    cy.findFirstPostInFeedFiltered(profile2.postText).should('be.visible');
    cy.findFirstPostInFeedFiltered(profile2.repostText).should('be.visible');
    // 1 occurrence of profile 2 reposting profile 1's post
    countPostsInFeed(profile1.postText2, 1);
    // can see own post
    cy.findFirstPostInFeedFiltered(profile3.postText).should('be.visible');
    cannotFindPostInFeed(profile1.postText1);
    cannotFindPostInFeed(profile4.postText);

    cy.signOut(HasBackedUp.Yes);

    // * sign in as profile 4 and view Reach Following, no posts can be seen
    cy.signIn(backupDownloadFilePath(profile4.username));
    cy.get('#left-sidebar').find('#reach-following-btn').click();

    cannotFindPostInFeed(profile1.postText1);
    cannotFindPostInFeed(profile1.postText2);
    cannotFindPostInFeed(profile2.postText);
    cannotFindPostInFeed(profile2.repostText);
    cannotFindPostInFeed(profile3.postText);
    // cannot see own post when no one else's posts are seen in following filter
    cannotFindPostInFeed(profile4.postText);
    cy.get('#posts-feed').find('#timeline').should('contain.text', 'Welcome to your feed!');
  });

  it('can filter view only posts and reposts of friends', () => {
    // * sign in as profile 1 and view Reach Friends, only profile 2's post can be seen
    cy.signIn(backupDownloadFilePath(profile1.username));
    waitForFeedToLoad();
    cy.get('#left-sidebar').find('#reach-friends-btn').click();
    waitForFeedToLoad();

    cy.findFirstPostInFeedFiltered(profile2.postText).should('be.visible');
    cy.findFirstPostInFeedFiltered(profile2.repostText).should('be.visible');
    cy.findFirstPostInFeedFiltered(profile1.postText1).should('be.visible');
    cy.findFirstPostInFeedFiltered(profile1.postText2).should('be.visible');
    // 2 occurrences of profile 1's post. due to profile 2 reposting it
    countPostsInFeed(profile1.postText2, 2);
    // can see own post
    cy.findFirstPostInFeedFiltered(profile1.postText1).should('be.visible');
    cannotFindPostInFeed(profile3.postText);
    cannotFindPostInFeed(profile4.postText);

    cy.signOut(HasBackedUp.Yes);

    // * sign in as profile 2 and view Reach Friends, only profile 1's posts can be seen
    cy.signIn(backupDownloadFilePath(profile2.username));
    waitForFeedToLoad();
    cy.get('#left-sidebar').find('#reach-friends-btn').click();
    waitForFeedToLoad();
    cy.findFirstPostInFeedFiltered(profile1.postText1).should('be.visible');
    cy.findFirstPostInFeedFiltered(profile1.postText2).should('be.visible');
    // can see own posts
    cy.findFirstPostInFeedFiltered(profile2.postText).should('be.visible');
    cy.findFirstPostInFeedFiltered(profile2.repostText).should('be.visible');
    cannotFindPostInFeed(profile3.postText);
    cannotFindPostInFeed(profile4.postText);

    cy.signOut(HasBackedUp.Yes);

    // * sign in as profile 3 and view Reach Friends, no posts can be seen
    cy.signIn(backupDownloadFilePath(profile3.username));
    waitForFeedToLoad();
    cy.get('#left-sidebar').find('#reach-friends-btn').click();

    cannotFindPostInFeed(profile1.postText1);
    cannotFindPostInFeed(profile1.postText2);
    cannotFindPostInFeed(profile2.postText);
    cannotFindPostInFeed(profile2.repostText);
    // cannot see own post when no one else's posts are seen in following filter
    cannotFindPostInFeed(profile3.postText);
    cannotFindPostInFeed(profile4.postText);
  });

  // TODO: remove workaround in checkPostIsAtIndexInFeed when bug is fixed, see https://github.com/pubky/pubky-app/issues/1393
  it('can sort by popularity', () => {
    // * sign in as profile 1 and sort by Popularity with Reach Following posts
    cy.signIn(backupDownloadFilePath(profile1.username));
    cy.get('#left-sidebar').find('#reach-following-btn').click();
    cy.get('#left-sidebar').find('#sort-popularity-btn').click();
    waitForFeedToLoad();

    // * check the posts are in the correct order
    // profile 3's post is the most popular because it has 5 tags
    checkPostIsAtIndexInFeed(profile3.postText, 0);
    // profile 2's post is the second most popular because it has 4 tags
    checkPostIsAtIndexInFeed(profile2.postText, 1);
    // profile 1's second post would be the third most popular because it has 1 repost but
    // own posts are not seen when filtering by following
    // the remaining posts are of equal popularity so they are sorted by recency
    checkPostIsAtIndexInFeed(profile4.postText, 2);
    checkPostIsAtIndexInFeed(profile2.repostText, 3);
  });

  it('can create and delete a custom feed', () => {
    // function to add a tag when creating a custom feed
    const addTag = (name: string) => {
      // type the tag name
      cy.get('#create-feed-add-tag-input').type(name);
      // check the add tag button is visible and click it
      cy.get('#create-feed-add-tag-btn').should('be.visible').click();
      // check the add tag button is not visible
      cy.get('#create-feed-add-tag-input').then(($body) => {
        assert($body.find('#create-feed-add-tag-btn').length === 0, 'Add tag button should not exist.');
      });
    };

    // profile 2's post's tags
    const tag1 = 'p2tag3';
    const tag2 = 'p2tag4';

    // * sign up as a new user
    cy.onboardAsNewUser('Custom Feed Guy', 'I make custom feeds');

    // * check latest post is profile 4's post
    cy.findPostInFeed().within(($post) => {
      cy.wrap($post).contains(profile4.postText);
    });

    // * confirm only 'All' feed is available
    cy.get('#custom-feeds-tabs').within(($tabs) => {
      // first tab is 'All'
      cy.wrap($tabs).children().eq(0).contains('All').should('be.visible');
      // add tab also exists
      cy.get('#add-custom-feed').should('be.visible');
      // no other tabs exist
      cy.wrap($tabs).children().should('have.length', 2);

      // * add a new custom feed
      cy.get('#add-custom-feed').click();
    });

    cy.get('#modal-root').within(() => {
      cy.get('h1').contains('Create Feed');
      // add a name to the custom feed
      cy.get('#create-feed-name-input').type("Mr Feed's Feed");
      // add two tags to the custom feed (these are not on the most recent post in the 'All' feed)
      addTag(tag1);
      addTag(tag2);
      // check the 2 tags are shown
      cy.get('#create-feed-tags-container')
        .children()
        .should('have.length', 2)
        .and('contain', tag1)
        .and('contain', tag2);
      // save the custom feed
      cy.get('#create-feed-save-btn').click();
    });

    // * select the new feed
    cy.get('#custom-feeds-tabs').within(($tabs) => {
      cy.wrap($tabs).children().eq(1).contains("Mr Feed's").click();
    });

    // * first post in feed is profile 2's post with expected tags
    cy.findFirstPostInFeed().within(($post) => {
      cy.wrap($post).contains(profile2.postText);
      // length is 4 because of the '+' button and 3 is max shown
      cy.wrap($post).find('#tags').children().should('have.length', 4).and('contain', tag1).and('contain', tag2);
    });

    // * select 'All' feed
    cy.get('#custom-feeds-tabs').within(($tabs) => {
      cy.wrap($tabs).children().eq(0).contains('All').click();
    });

    // * confirm latest post is profile 4's post again
    cy.findPostInFeed().within(($post) => {
      cy.wrap($post).contains(profile4.postText);
    });

    // * delete the custom feed
    cy.get('#custom-feeds-tabs').within(($tabs) => {
      cy.wrap($tabs).children().eq(1).contains("Mr Feed's");
      cy.wrap($tabs).children().eq(1).find('#edit-custom-feed').click();
    });

    cy.get('#modal-root').within(() => {
      cy.get('h1').contains('Edit Feed');
      cy.get('#delete-feed-btn').click();
    });

    // * confirm only 'All' feed is available
    cy.get('#custom-feeds-tabs').within(($tabs) => {
      cy.wrap($tabs).children().eq(0).contains('All').should('be.visible');
      cy.get('#add-custom-feed').should('be.visible');
      cy.wrap($tabs).children().should('have.length', 2);
    });
  });

  it('can create a custom feed with filters', () => {});
});
