import { backupDownloadFilePath } from '../support/auth';
import { slowCypressDown } from 'cypress-slow-down';
// registers the cy.slowDown and cy.slowDownEnd commands
import 'cypress-slow-down/commands';
import {
  latestPostInFeedContentEq,
  deletePost,
  createQuickPost,
  checkPostIsNotAtTopOfFeed,
  repostPost,
  fastTagPostInFeed,
  replyToPost,
  waitForFeedToLoad,
  selectEmojis,
  createQuickPostWithTags,
  fastTagWhilstCreatingPost,
  addImage,
  waitForBookmarksToLoad,
  checkLatestPostIsIndexed
} from '../support/posts';
import { defaultMs, fastMs } from '../support/slow-down';
import { CheckIndexed, HasBackedUp, SkipOnboardingSlides } from '../support/types/enums';

const username = 'Poster';

describe('posts', () => {
  before(() => {
    slowCypressDown();
    cy.deleteDownloadsFolder();

    // create profile to post from
    cy.onboardAsNewUser(username, 'Big on posting.');
    cy.backupRecoveryFile();
    cy.renameFile(backupDownloadFilePath(), backupDownloadFilePath(username));
  });

  beforeEach(() => {
    // in case it gets changed by a test and not reset
    cy.slowDown(defaultMs);

    // sign in if not already
    cy.location('pathname').then((currentPath) => {
      if (currentPath !== '/home') {
        cy.signIn(backupDownloadFilePath(username));
        waitForFeedToLoad();
      }
    });
  });

  it('can post from quick post box', () => {
    const postContent = `I can post using the quick post box! ${Date.now()}`;
    createQuickPost(postContent);

    // verify the post is displayed correctly in feed
    latestPostInFeedContentEq(postContent);

    // wait for post to be indexed before reloading page
    checkLatestPostIsIndexed();

    // reload and check post is still displayed correctly
    cy.reload();
    waitForFeedToLoad();
    latestPostInFeedContentEq(postContent);
  });

  it('can post from new post', () => {
    const postContent = `I can make a new post! ${Date.now()}`;
    // click button to display new post modal
    cy.get('#new-post-btn').click();
    cy.get('h1').contains('New Post').should('be.visible');

    // input post content and submit
    cy.get('#new-post-create-content')
      .should('be.visible')
      .within(() => {
        cy.get('textarea').should('have.value', '');
        cy.get('textarea').type(postContent);
        cy.get('#post-btn').click();
      });
    cy.get('#modal-root').should('not.exist');

    // verify the post is displayed correctly in feed
    latestPostInFeedContentEq(postContent);

    // wait for post to be indexed before reloading page
    checkLatestPostIsIndexed();

    // reload and check post is still displayed correctly
    cy.reload();
    waitForFeedToLoad();
    latestPostInFeedContentEq(postContent);
  });

  it('can post with maximum character limit (1000)', () => {
    const postContent =
      'I can make a really looooooooooooooooooooooooooooooo' +
      'oooooooooooooooooooooooooooooooooooooooooooooooooooo' +
      'oooooooooooooooooooooooooooooooooooooooooooooooooooo' +
      'oooooooooooooooooooooooooooooooooooooooooooooooooooo' +
      'oooooooooooooooooooooooooooooooooooooooooooooooooooo' +
      'oooooooooooooooooooooooooooooooooooooooooooooooooooo' +
      'oooooooooooooooooooooooooooooooooooooooooooooooooooo' +
      'oooooooooooooooooooooooooooooooooooooooooooooooooooo' +
      'oooooooooooooooooooooooooooooooooooooooooooooooooooo' +
      'oooooooooooooooooooooooooooooooooooooooooooooooooooo' +
      'oooooooooooooooooooooooooooooooooooooooooooooooooooo' +
      'oooooooooooooooooooooooooooooooooooooooooooooooooooo' +
      'oooooooooooooooooooooooooooooooooooooooooooooooooooo' +
      'oooooooooooooooooooooooooooooooooooooooooooooooooooo' +
      'oooooooooooooooooooooooooooooooooooooooooooooooooooo' +
      'oooooooooooooooooooooooooooooooooooooooooooooooooooo' +
      'oooooooooooooooooooooooooooooooooooooooooooooooooooo' +
      'oooooooooooooooooooooooooooooooooooooooooooooooooooo' +
      `ooooooooooooooooooooooooooooooooooooooooooog post! ${Date.now()}`;

    const expectedPostContent =
      'I can make a really looooooooooooooooooooooooooooooo' +
      'oooooooooooooooooooooooooooooooooooooooooooooooooooo' +
      'oooooooooooooooooooooooooooooooooooooooooooooooooooo' +
      'oooooooooooooooooooooooooooooooooooooooooooooooooooo' +
      'oooooooooooooooooooooooooooooooooooooooooooooooooooo' +
      'oooooooooooooooooooooooooooooooooooooooooooooooooooo' +
      'oooooooooooooooooooooooooooooooooooooooooooooooooooo' +
      'oooooooooooooooooooooooooooooooooooooooooooooooooooo' +
      'oooooooooooooooooooooooooooooooooooooooooooooooooooo' +
      'oooooooooooooooooooooooooooooooo...Show more';

    createQuickPost(postContent);

    // verify the post is displayed correctly in feed
    latestPostInFeedContentEq(expectedPostContent);

    // TODO: click 'Show more' and assert full content is displayed
  });

  it('can post with emojis', () => {
    const suffix = Date.now();
    const postContent = `🥋🗾⛩️ I can post with emojis! ${suffix}`;
    const postContentWithoutEmoji = ` I can post with emojis! ${suffix}`;
    cy.get('#quick-post-create-content').within(() => {
      cy.get('textarea').should('have.value', '');
      // click on textarea to expand to view buttons
      cy.get('textarea').click();

      // add 3 emojis using emoji picker
      selectEmojis(['Activity', '🥋', 'Travel & Places', '🗾', '⛩️']);

      // type the rest of the post
      cy.get('textarea').type(postContentWithoutEmoji);
      // check displayed content length
      cy.get('#content-length').innerTextShouldEq(`${postContent.length} / 1000`);
      // submit
      cy.get('#post-btn').click();
      // wait for textarea to be cleared to ensure post is submitted
      cy.get('textarea').should('have.value', '');
    });

    // verify the post is displayed correctly in feed
    latestPostInFeedContentEq(postContent);
  });

  it('can post with image upload', () => {
    const postContent = `I can post with an image! ${Date.now()}`;
    cy.get('#quick-post-create-content').within(() => {
      cy.get('textarea').should('have.value', '');
      // click on textarea to expand to view buttons
      cy.get('textarea').click();

      // upload image
      addImage();

      // type the rest of the post and submit
      cy.get('textarea').type(postContent);
      cy.get('#post-btn').click();
    });

    // wait for post to be indexed then verify the post has expected content and 1 image
    cy.findFirstPostInFeed(CheckIndexed.Yes).within(() => {
      cy.get('#post-content-text').innerTextShouldEq(postContent);
      cy.get('#post-content-text').find('img').should('have.length', 1);
    });
  });

  [CheckIndexed.Yes, CheckIndexed.No].forEach((waitForIndexed) => {
    it(`can post with embedded link (waitForIndexed: ${waitForIndexed})`, () => {
      const link = 'https://www.youtube.com/watch?v=989-7xsRLR4';
      const embedLink = 'https://www.youtube.com/embed/989-7xsRLR4';
      const postContent = `I can post with an embedded link! ${link} ${Date.now()}`;
      cy.get('#quick-post-create-content').within(() => {
        cy.get('textarea').should('have.value', '');
        // type the post
        cy.get('textarea').type(postContent);
        // check that the embedded link preview is shown
        cy.get('iframe').should('be.visible');
        cy.get('iframe').should('have.attr', 'src', embedLink);
        // submit
        cy.get('#post-btn').click();
      });

      // verify the post text and embedded link is displayed correctly in feed
      cy.findFirstPostInFeed(waitForIndexed).within(() => {
        cy.get('#post-content-text').innerTextShouldEq(postContent);
        cy.get('iframe').should('be.visible');
        cy.get('iframe').should('have.attr', 'src', embedLink);
      });
    });
  });

  it('can post with profile reference', () => {
    // create profile to refer to in a post
    cy.signOut(HasBackedUp.Yes);
    const uniquePrefix = Cypress._.uniqueId(Date.now().toString().slice(-2));
    const otherUsername = 'Jeremy The Poser';
    const fullUsername = uniquePrefix + '_' + otherUsername;
    const pubkyAlias = 'jPubky';
    cy.onboardAsNewUser(fullUsername, 'My account will be referenced in a post.', SkipOnboardingSlides.Yes, pubkyAlias);
    cy.signOut(HasBackedUp.No);
    // sign back in as poster
    cy.signIn(backupDownloadFilePath(username));

    const postContent = `I can post with a profile reference! ${Date.now()}`;
    cy.get('#quick-post-create-content').within(() => {
      cy.get('textarea').should('have.value', '');
      // type the post and submit
      cy.get('textarea').type(postContent + ` @${uniquePrefix}`);
      // check that profile searched is performed
      cy.get('#searched-users-card')
        .should('be.visible')
        .should('have.descendants', '*')
        .children()
        .within(() => {
          // Wait for the search results to stabilise
          cy.contains(uniquePrefix).should('be.visible').click();
        });
      // verify that the profile reference is added to the post
      cy.get(`@${pubkyAlias}`).then((pubky) => {
        cy.get('textarea').should('have.value', postContent + ` ${pubky}`);
      });
      cy.get('#post-btn').click();
    });

    // verify the post is displayed correctly in feed
    latestPostInFeedContentEq(postContent + ` @${fullUsername}`);
  });

  it('can delete a post', () => {
    const postContent = `I can delete this post! ${Date.now()}`;
    createQuickPost(postContent);

    // verify the post is displayed correctly in feed
    latestPostInFeedContentEq(postContent);

    // delete the post
    deletePost({});

    // verify post is deleted
    checkPostIsNotAtTopOfFeed({ postContent, refreshIfPostExists: false });

    // reload and check post is still deleted
    cy.reload();
    waitForFeedToLoad();
    checkPostIsNotAtTopOfFeed({ postContent, refreshIfPostExists: true });
  });

  // todo: consider combining with 'can delete a post' test
  it("cannot delete other profile's post", () => {
    // create profile to create a post to try and delete
    cy.signOut(HasBackedUp.Yes);
    cy.onboardAsNewUser('Del Boy', 'Try delete my post.');
    const postContent = `Noone else can delete this post! ${Date.now()}`;
    createQuickPost(postContent);
    cy.signOut(HasBackedUp.No);
    // sign back in as poster
    cy.signIn(backupDownloadFilePath(username));

    // try to delete the post made by the other account
    cy.findFirstPostInFeed(CheckIndexed.No).within(() => {
      // open post menu and check delete is not available
      cy.get('#menu-btn').should('be.visible').click();
      cy.get('#post-tooltip-menu')
        .should('be.visible')
        .within(() => {
          cy.get('#delete-post').should('not.exist');
        });
    });
  });

  // TODO: reenable intermittently failing test, see https://github.com/pubky/pubky-app/issues/1397
  [CheckIndexed.Yes, CheckIndexed.No].forEach((waitForIndexed) => {
    it.skip(`can tag whilst creating post (waitForIndexed: ${waitForIndexed})`, () => {
      const postContent = `I can post with tags! ${Date.now()}`;
      const tag1 = 'alpacas';
      const tag2 = 'llamas';
      const tag3 = 'vicuñas';

      createQuickPostWithTags(postContent, [tag1, tag2, tag3]);

      // function to verify tags are displayed in the post
      const verifyPost = () => {
        // verify the post text and tags are displayed correctly in feed
        cy.findFirstPostInFeed(waitForIndexed).within(() => {
          // check text
          cy.get('#post-content-text').innerTextShouldEq(postContent);

          // check tags (ordered reverse alphanumeric)
          cy.get('#tags').find('#tag-0').contains(tag3);
          cy.get('#tags').find('#tag-1').contains(tag2);
          cy.get('#tags').find('#tag-2').contains(tag1);
        });
      };

      // check tags are displayed in the post
      verifyPost();

      // refresh page before checking tags are still displayed
      waitForFeedToLoad();

      // check tags are still displayed in the post
      verifyPost();
    });
  });

  enum ExpectedTags {
    AllThree,
    WithMiddleRemoved
  }

  enum ExpectedOrder {
    Alphanumeric,
    ReverseAlphanumeric
  }

  [CheckIndexed.Yes, CheckIndexed.No].forEach((waitForIndexed) => {
    it(`can tag and remove tags from existing post on feed page (waitForIndexed: ${waitForIndexed})`, () => {
      const postContent = `I can add and remove tags from my existing post on the feed page! ${Date.now()}`;
      const tag1 = 'bananas';
      const tag2 = 'pjammas';
      const tag3 = 'rastas';

      const clickMiddleTag = () => {
        cy.get('#tags').within(() => {
          cy.get(`#tag-1`).click();
        });
      };

      const checkTagsAreDisplayed = (expectedTags: ExpectedTags, expectedOrder: ExpectedOrder) => {
        // length is 4 because of the '+' button
        cy.get('#tags')
          .children()
          .its('length')
          .should('eq', expectedTags === ExpectedTags.WithMiddleRemoved ? 3 : 4);
        cy.get('#tags').within(($tags) => {
          cy.get('#tag-0').innerTextShouldContain(expectedOrder === ExpectedOrder.ReverseAlphanumeric ? tag3 : tag1);
          expectedTags === ExpectedTags.WithMiddleRemoved
            ? cy.wrap($tags).innerTextShouldNotContain(tag2)
            : cy.get('#tag-1').innerTextShouldContain(tag2);
          cy.get(expectedTags === ExpectedTags.WithMiddleRemoved ? '#tag-1' : '#tag-2').innerTextShouldContain(
            expectedOrder === ExpectedOrder.ReverseAlphanumeric ? tag1 : tag3
          );
        });
      };

      const checkTagCounters = (expectedTags: ExpectedTags, expectedOrder: ExpectedOrder) => {
        cy.get('#tags').within(() => {
          // ordered reverse alphanumeric
          cy.get('#tag-0')
            .should('exist')
            .contains(expectedOrder === ExpectedOrder.ReverseAlphanumeric ? tag3 : tag1);
          cy.get('#tag-0-count').should('exist').contains('1');
          cy.get('#tag-1').should('exist').contains(tag2);
          cy.get('#tag-1-count')
            .should('exist')
            .contains(expectedTags === ExpectedTags.WithMiddleRemoved ? '0' : '1');
          cy.get('#tag-2')
            .should('exist')
            .contains(expectedOrder === ExpectedOrder.ReverseAlphanumeric ? tag1 : tag3);
          cy.get('#tag-2-count').should('exist').contains('1');
        });
      };

      createQuickPost(postContent);

      // add tags to the post
      fastTagPostInFeed([tag1, tag2, tag3], postContent);

      cy.findFirstPostInFeed(waitForIndexed).within(() => {
        // check tags are displayed within the latest post in the feed
        checkTagsAreDisplayed(ExpectedTags.AllThree, ExpectedOrder.ReverseAlphanumeric);

        // verify tag can be removed and added back
        clickMiddleTag();
        checkTagCounters(ExpectedTags.WithMiddleRemoved, ExpectedOrder.ReverseAlphanumeric);
        clickMiddleTag();
        checkTagCounters(ExpectedTags.AllThree, ExpectedOrder.ReverseAlphanumeric);
      });

      // refresh page before checking tags are still displayed
      cy.reload();
      waitForFeedToLoad();

      cy.findFirstPostInFeed(waitForIndexed).within(() => {
        // check tags are still displayed
        checkTagsAreDisplayed(ExpectedTags.AllThree, ExpectedOrder.ReverseAlphanumeric);

        // remove a tag from the post
        clickMiddleTag();
        checkTagCounters(ExpectedTags.WithMiddleRemoved, ExpectedOrder.ReverseAlphanumeric);
      });

      // refresh page before checking tag is still removed
      cy.reload();
      waitForFeedToLoad();

      // check tag is still removed
      cy.findFirstPostInFeed(waitForIndexed).within(() => {
        checkTagsAreDisplayed(ExpectedTags.WithMiddleRemoved, ExpectedOrder.ReverseAlphanumeric);
      });
    });
  });

  it(`can tag and remove tags from existing post on post page`, () => {
    const postContent = `I can add and remove tags from my existing post on the post page! ${Date.now()}`;
    const tag1 = 'açorda';
    const tag2 = 'cassava';
    const tag3 = 'feijoada';

    const checkTagsAreDisplayed = (expectedTags: ExpectedTags, expectedOrder: ExpectedOrder) => {
      cy.get('#post-view-modal').within(() => {
        cy.get('#post-container').within(($post) => {
          cy.get('#tag-0')
            .should('be.visible')
            .contains(expectedOrder === ExpectedOrder.ReverseAlphanumeric ? tag3 : tag1);
          expectedTags === ExpectedTags.WithMiddleRemoved
            ? cy.wrap($post).innerTextShouldNotContain(tag2)
            : cy.get('#tag-1').should('be.visible').contains(tag2);
          cy.get(expectedTags === ExpectedTags.WithMiddleRemoved ? '#tag-1' : '#tag-2')
            .should('be.visible')
            .contains(expectedOrder === ExpectedOrder.ReverseAlphanumeric ? tag1 : tag3);
        });
      });
    };

    const checkTagCounters = (expectedTags: ExpectedTags, expectedOrder: ExpectedOrder) => {
      cy.get('#post-view-modal').within(() => {
        cy.get('#post-container').within(() => {
          cy.get('#tag-0')
            .should('exist')
            .contains(expectedOrder === ExpectedOrder.ReverseAlphanumeric ? tag3 : tag1);
          cy.get('#tag-0-count').should('exist').contains('1');
          cy.get('#tag-1').should('exist').contains(tag2);
          cy.get('#tag-1-count')
            .should('exist')
            .contains(expectedTags === ExpectedTags.WithMiddleRemoved ? '0' : '1');
          cy.get('#tag-2')
            .should('exist')
            .contains(expectedOrder === ExpectedOrder.ReverseAlphanumeric ? tag1 : tag3);
          cy.get('#tag-2-count').should('exist').contains('1');
        });
      });
    };

    const clickMiddleTag = () => {
      cy.get('#post-view-modal').within(() => {
        cy.get('#tag-1').click();
      });
      cy.wait(100);
    };

    // add one tag now and the rest later
    createQuickPostWithTags(postContent, [tag1]);

    // navigate to post page
    cy.findFirstPostInFeed().within(() => {
      cy.get('#post-content-text').click();
    });

    // location should be /post/:id
    cy.location('pathname').should('contain', '/post/');

    // add two more tags to the post
    cy.get('#post-view-modal').within(() => {
      cy.get('#post-container').within(() => {
        cy.get('#add-tag-input').type(tag2);
        cy.get('#add-tag-btn  ').click();
        cy.get('#add-tag-input').type(tag3);
        cy.get('#add-tag-btn').click();
      });
    });

    // check tags are displayed for post
    checkTagsAreDisplayed(ExpectedTags.AllThree, ExpectedOrder.ReverseAlphanumeric);
    checkTagCounters(ExpectedTags.AllThree, ExpectedOrder.ReverseAlphanumeric);

    // remove a tag from the post
    clickMiddleTag();
    checkTagsAreDisplayed(ExpectedTags.AllThree, ExpectedOrder.ReverseAlphanumeric);
    checkTagCounters(ExpectedTags.WithMiddleRemoved, ExpectedOrder.ReverseAlphanumeric);

    // add the tag back
    clickMiddleTag();
    checkTagsAreDisplayed(ExpectedTags.AllThree, ExpectedOrder.ReverseAlphanumeric);
    checkTagCounters(ExpectedTags.AllThree, ExpectedOrder.ReverseAlphanumeric);

    // refresh page before checking tags are still displayed
    cy.reload();

    // check tags are still displayed
    checkTagsAreDisplayed(ExpectedTags.AllThree, ExpectedOrder.ReverseAlphanumeric);
    checkTagCounters(ExpectedTags.AllThree, ExpectedOrder.ReverseAlphanumeric);

    // remove the tag from the post
    clickMiddleTag();

    // refresh page before checking the tag is removed
    cy.reload();

    // check the tag is removed
    checkTagsAreDisplayed(ExpectedTags.WithMiddleRemoved, ExpectedOrder.ReverseAlphanumeric);
  });

  it('can bookmark multiple posts then remove bookmarks', () => {
    const postContent1 = `This post will be bookmarked! ${Date.now()}`;
    const postContent2 = `This post will also be bookmarked! ${Date.now()}`;

    // create a post to bookmark
    createQuickPost(postContent1);

    // bookmark the post
    cy.slowDown(fastMs);
    cy.findFirstPostInFeed().within(() => {
      cy.get('#bookmark-btn').click();
    });
    // check bookmark toast is shown (before it disappears)
    cy.get('#toast').should('be.visible').find('h2').contains('bookmark');
    cy.slowDown(defaultMs);

    // navigate to bookmarks page
    cy.get('#header-bookmarks-btn').click();
    cy.location('pathname').should('eq', '/bookmarks');

    cy.countPostsInBookmarks(1)
      .findPostInBookmarks(0)
      .within(() => {
        // verify the post has been bookmarked
        cy.get('#post-content-text').innerTextShouldEq(postContent1);
      });

    // navigate back to feed page
    cy.get('#header-logo').click();
    cy.location('pathname').should('eq', '/home');

    // create a second post to bookmark
    createQuickPost(postContent2);

    // bookmark the second post
    cy.findFirstPostInFeed().within(() => {
      cy.get('#bookmark-btn').click();
    });

    // navigate to bookmarks page
    cy.get('#header-bookmarks-btn').click();
    cy.location('pathname').should('eq', '/bookmarks');

    waitForBookmarksToLoad();

    // verify both posts are now bookmarked (note the most recently bookmarked is at the top)
    cy.countPostsInBookmarks(2)
      .findPostInBookmarks(0)
      .within(() => {
        cy.get('#post-content-text').innerTextShouldEq(postContent2);
      });
    cy.findPostInBookmarks(1, 2).within(() => {
      cy.get('#post-content-text').innerTextShouldEq(postContent1);
    });

    // remove bookmark from both posts
    cy.countPostsInBookmarks(2)
      .findPostInBookmarks(0)
      .within(() => {
        cy.get('#bookmark-btn').click();
      });
    cy.countPostsInBookmarks(2)
      .findPostInBookmarks(1)
      .within(() => {
        cy.get('#bookmark-btn').click();
      });

    // check both posts are still listed
    cy.countPostsInBookmarks(2);

    // navigate to feed page and back to bookmarks page
    cy.get('#header-logo').click();
    cy.location('pathname').should('eq', '/home');
    cy.get('#header-bookmarks-btn').click();
    cy.location('pathname').should('eq', '/bookmarks');

    //verify the post is no longer bookmarked
    cy.get('#bookmarked-posts').should('contain.text', 'Save posts for later');
  });

  [CheckIndexed.Yes, CheckIndexed.No].forEach((waitForIndexed) => {
    it(`can repost with content then delete the repost (waitForIndexed: ${waitForIndexed})`, () => {
      // create a post to repost
      const postContent = `This post will be reposted with content! ${Date.now()}`;
      const repostContent = 'Reposted with content!';
      createQuickPost(postContent);

      // repost with content
      cy.slowDown(fastMs);
      repostPost({ repostContent, postContent, waitForIndexed });

      // check repost message is shown (before the alert disappears)
      cy.get('#message-alert').should('be.visible').and('contain.text', 'Repost');
      cy.slowDown(defaultMs);

      // verify the repost with content is displayed correctly in feed
      cy.findFirstPostInFeed(waitForIndexed).within(() => {
        // check that both the repost text and original post text are displayed
        const expectedContent = [repostContent, postContent];
        cy.get('#post-content-text').each((elem, index) => {
          cy.wrap(elem).innerTextShouldEq(expectedContent[index]);
        });
      });

      // delete the repost
      deletePost({});

      // verify the repost is deleted
      cy.findFirstPostInFeed(waitForIndexed).within(() => {
        // check that first post is the original post
        cy.get('#post-content-text').innerTextShouldEq(postContent);
      });
    });
  });

  // todo: consider creating user to create the post to repost
  it('can repost without content then delete the repost', () => {
    // TODO: remove debug logging for repost sometimes not showing 'Poster reposted'
    // Set up network intercept to log response for GET /stream/posts
    cy.intercept('GET', '**/stream/posts**', (req) => {
      req.reply((res) => {
        cy.task('logToFile', {
          testName: 'can repost without content then delete the repost',
          message: `GET /stream/posts response:\n${JSON.stringify(res.body, null, 2)}`
        });
      });
    }).as('getStreamPosts');

    // create a post to repost
    const postContent = `This post will be reposted without content! ${Date.now()}`;
    createQuickPost(postContent);

    // repost without content
    repostPost({ postContent });

    // TODO: remove workaround for repost sometimes not showing 'Poster reposted'
    cy.waitReload(Cypress.env('ci') ? 1000 : 100);
    waitForFeedToLoad();
    cy.scrollTo('top');

    // verify the repost without content is displayed correctly in feed
    cy.findFirstPostInFeed().within(($post) => {
      // check that only original post text is displayed and not additional content text
      cy.get('#post-content-text').its('length').should('eq', 1);
      cy.wrap($post).innerTextShouldContain(username + ' reposted');

      // undo the repost
      cy.wrap($post).contains('Undo repost').click();
    });

    // verify the repost is deleted
    cy.findFirstPostInFeed().within(($post) => {
      cy.wrap($post).innerTextShouldNotContain('Undo repost');
      cy.wrap($post).get('#post-content-text').innerTextShouldEq(postContent);
    });
  });

  it('can see repost of a deleted post', () => {
    // create a post to repost
    const postContent = `This post will be reposted without content! ${Date.now()}`;
    const repostContent = `Reposted with this content! ${Date.now()}`;
    createQuickPost(postContent);

    // repost
    repostPost({ repostContent, postContent });

    // delete the original post (index 1 as the repost is at index 0)
    deletePost({ postIdx: 1 });

    // verify the repost is displayed in feed with deleted post content
    cy.findFirstPostInFeed().within(($post) => {
      cy.wrap($post).innerTextShouldContain(postContent);
      cy.get('#post-content-text').innerTextShouldEq(repostContent);
    });

    cy.reload();
    waitForFeedToLoad();

    // verify the repost is displayed in feed without deleted post content
    cy.findFirstPostInFeed().within(($post) => {
      cy.wrap($post).innerTextShouldContain('This post has been deleted');
      cy.get('#post-content-text').innerTextShouldEq(repostContent);
    });
  });

  [CheckIndexed.Yes, CheckIndexed.No].forEach((waitForIndexed) => {
    it(`cannot see reply of a deleted post in feed (waitForIndexed: ${waitForIndexed})`, () => {
      // create a post to reply to
      const postContent = `This post will be replied to! ${Date.now()}`;
      const replyContent = `This is my reply! ${Date.now()}`;
      createQuickPost(postContent);

      // reply to the post
      replyToPost({ replyContent, filterText: postContent, postContent, waitForIndexed });

      // TODO: remove manual refresh, see https://github.com/pubky/pubky-app/issues/#887
      cy.waitReload();
      waitForFeedToLoad();

      // check reply is displayed in feed
      cy.findFirstPostInFeed(waitForIndexed).within(($post) => {
        cy.wrap($post).find('#replies-container').innerTextShouldContain(replyContent);
      });

      // delete the original post
      deletePost({});

      // verify the reply and original post are no longer displayed in feed
      cy.get('#timeline').within(($timeline) => {
        cy.wrap($timeline).innerTextShouldNotContain(replyContent);
        cy.wrap($timeline).innerTextShouldNotContain(postContent);
      });
    });
  });

  const createArticle = (articleTitle: string, articleContent: string, imageFilename?: string, tags?: string[]) => {
    cy.get('#article-modal')
      .should('be.visible')
      .within(() => {
        cy.get('h1').contains('New Article');
        cy.get('#article-title-input').type(articleTitle);
        if (imageFilename) addImage();
        cy.get('#article-content-input').find('.ql-editor').click().invoke('text', articleContent);
        // todo: check counter
        // need to click away from input to enable publish button (either by adding tags or clicking footer)
        tags ? fastTagWhilstCreatingPost(tags) : cy.get('#footer-actions').click();
        cy.get('#post-btn').should('be.enabled').click();
      });
  };

  enum ImageExpected {
    Yes = 1,
    No = 0
  }

  const checkArticleInFeed = (
    articleTitle: string,
    articleContent: string,
    expectImage: ImageExpected,
    tags?: string[]
  ) => {
    cy.findFirstPostInFeed().within(($post) => {
      cy.wrap($post).innerTextShouldContain(articleTitle);
      if (expectImage) cy.wrap($post).find('img').should('be.visible');
      cy.wrap($post).innerTextShouldContain(articleContent);
      if (tags) tags.forEach((tag) => cy.wrap($post).innerTextShouldContain(tag));
    });
  };

  it('can create an article from quick post box', () => {
    const articleTitle = `A nice article! ${Date.now()}`;
    const articleContent = `Let me convince you that this is indeed a nice article! ${Date.now()}`;
    const tag1 = 'artitag1';
    const tag2 = 'artitag2';

    cy.get('#quick-post-create-content')
      .should('be.visible')
      .within(() => {
        cy.get('textarea').click();
        cy.get('#article-btn').click();
      });

    createArticle(articleTitle, articleContent, 'mustache-you.png', [tag1, tag2]);

    // TODO: remove reload workaround, see https://github.com/pubky/pubky-app/issues/1397
    cy.findFirstPostInFeed(CheckIndexed.Yes);
    cy.waitReload(200);
    waitForFeedToLoad();

    checkArticleInFeed(articleTitle, articleContent, ImageExpected.Yes, [tag1, tag2]);
  });

  it('can create an article from new post', () => {
    const articleTitle = `Another nice article! ${Date.now()}`;
    const articleContent = `Let me convince you that this is indeed another nice article! ${Date.now()}`;

    cy.get('#new-post-btn').click();

    // input post content and submit
    cy.get('#modal-root')
      .should('be.visible')
      .within(() => {
        cy.get('h1').contains('New Post').should('be.visible');
        cy.get('#new-post-create-content')
          .should('be.visible')
          .within(() => {
            cy.get('#article-btn').click();
          });
      });

    createArticle(articleTitle, articleContent);

    // TODO: remove reload workaround, see https://github.com/pubky/pubky-app/issues/1397
    cy.findFirstPostInFeed(CheckIndexed.Yes);
    cy.waitReload(200);
    waitForFeedToLoad();

    checkArticleInFeed(articleTitle, articleContent, ImageExpected.No);
  });

  it('signout when 401 response from homeserver when creating new post', () => {
    // Set up network intercept to return 401 for post creation
    cy.intercept('PUT', '**/pub/pubky.app/posts/**', {
      statusCode: 401,
      body: { error: 'Unauthorized' }
    }).as('createPostWithError');

    // Create a post
    const postContent = `This post will be created! ${Date.now()}`;
    createQuickPost(postContent);

    // Wait for the intercepted request
    cy.wait('@createPostWithError');

    // Check that session expired modal is displayed
    cy.get('#modal-root').should('be.visible');
    cy.get('h1').contains('Session expired').should('be.visible');

    // Check that user gets redirected to sign-in page
    cy.location('pathname').should('eq', '/sign-in');
  });

  it('signout when 401 response from homeserver when creating new article', () => {
    // Set up network intercept to return 401 for article creation (uses same endpoint as posts)
    cy.intercept('PUT', '**/pub/pubky.app/posts/**', {
      statusCode: 401,
      body: { error: 'Unauthorized' }
    }).as('createArticleWithError');

    const articleTitle = `Test article! ${Date.now()}`;
    const articleContent = `This article will fail to create due to 401! ${Date.now()}`;

    cy.get('#quick-post-create-content')
      .should('be.visible')
      .within(() => {
        cy.get('textarea').click();
        cy.get('#article-btn').click();
      });

    createArticle(articleTitle, articleContent);

    // Wait for the intercepted request
    cy.wait('@createArticleWithError');

    // Check that session expired modal is displayed (with specific header to avoid finding the article modal)
    cy.contains('#modal-root', 'Session expired').find('h1').contains('Session expired').should('be.visible');

    // Check that user gets redirected to sign-in page
    cy.location('pathname').should('eq', '/sign-in');
  });

  it('signout when 401 response from homeserver when tagging a post', () => {
    // First create a post to tag
    const postContent = `This post will be tagged! ${Date.now()}`;
    createQuickPost(postContent);

    // Set up network intercept to return 401 for tagging
    cy.intercept('PUT', '**/pub/pubky.app/tags/**', {
      statusCode: 401,
      body: { error: 'Unauthorized' }
    }).as('createTagWithError');

    // Tag the post
    fastTagPostInFeed(['testtag'], postContent);

    // Wait for the intercepted request
    cy.wait('@createTagWithError');

    // Check that session expired modal is displayed
    cy.get('#modal-root').should('be.visible');
    cy.get('h1').contains('Session expired').should('be.visible');

    // Check that user gets redirected to sign-in page
    cy.location('pathname').should('eq', '/sign-in');
  });

  // todo: check that reply still shown in own profile page
  // todo: test 'Show n new posts' button
});
