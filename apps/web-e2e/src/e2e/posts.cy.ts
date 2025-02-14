import { backupDownloadFilePath } from '../support/auth';
import { slowCypressDown } from 'cypress-slow-down'
// registers the cy.slowDown and cy.slowDownEnd commands
import 'cypress-slow-down/commands'
import { latestPostInFeedContentEq,
        deletePost,
        createQuickPost,
        checkPostIsNotAtTopOfFeed,
        repostPost,
        fastTagPostInFeed,
        replyToPost,
        waitForFeedToLoad,
        selectEmojis,
        createQuickPostWithTags,
        fastTagWhilstCreatingPost} from '../support/posts';
import { defaultMs, fastMs } from '../support/slow-down';

const username = 'Poster';

describe('posts', () => {
  before(() => {
    slowCypressDown();
    cy.mockInviteCodeApi();
    cy.deleteDownloadsFolder();

    // create profile to post from
    cy.onboardAsNewUser(username, "Big on posting.");
    cy.backupRecoveryFile();
    cy.renameFile(backupDownloadFilePath(), backupDownloadFilePath(username + '.pkarr'));
  });

  beforeEach(() => {
    // in case it gets changed by a test and not reset
    cy.slowDown(defaultMs);
    cy.mockInviteCodeApi();

    // sign in if not already
    cy.location('pathname').then((currentPath) => {
      if (currentPath !== '/home') {
        cy.signIn(backupDownloadFilePath(username + '.pkarr'));
      };
    });
  });

  it('can post from quick post box', () => {
    const postContent = `I can post using the quick post box! ${Date.now()}`;
    createQuickPost(postContent);

    // verify the post is displayed correctly in feed
    latestPostInFeedContentEq(postContent);

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
    cy.get('#new-post-create-content').should('be.visible').within(() => {
      cy.get('textarea').should('have.value', '');
      cy.get('textarea').type(postContent);
      cy.get('#post-btn').click();
    });
    cy.get('#modal-root').should('not.exist');

    // verify the post is displayed correctly in feed
    latestPostInFeedContentEq(postContent);

    // reload and check post is still displayed correctly
    cy.reload();
    waitForFeedToLoad();
    latestPostInFeedContentEq(postContent);
  });

  it('can post with maximum character limit (1000)', () => {
    const postContent =
      "I can make a really looooooooooooooooooooooooooooooo" +
      "oooooooooooooooooooooooooooooooooooooooooooooooooooo" +
      "oooooooooooooooooooooooooooooooooooooooooooooooooooo" +
      "oooooooooooooooooooooooooooooooooooooooooooooooooooo" +
      "oooooooooooooooooooooooooooooooooooooooooooooooooooo" +
      "oooooooooooooooooooooooooooooooooooooooooooooooooooo" +
      "oooooooooooooooooooooooooooooooooooooooooooooooooooo" +
      "oooooooooooooooooooooooooooooooooooooooooooooooooooo" +
      "oooooooooooooooooooooooooooooooooooooooooooooooooooo" +
      "oooooooooooooooooooooooooooooooooooooooooooooooooooo" +
      "oooooooooooooooooooooooooooooooooooooooooooooooooooo" +
      "oooooooooooooooooooooooooooooooooooooooooooooooooooo" +
      "oooooooooooooooooooooooooooooooooooooooooooooooooooo" +
      "oooooooooooooooooooooooooooooooooooooooooooooooooooo" +
      "oooooooooooooooooooooooooooooooooooooooooooooooooooo" +
      "oooooooooooooooooooooooooooooooooooooooooooooooooooo" +
      "oooooooooooooooooooooooooooooooooooooooooooooooooooo" +
      "oooooooooooooooooooooooooooooooooooooooooooooooooooo" +
      `ooooooooooooooooooooooooooooooooooooooooooog post! ${Date.now()}`;

    createQuickPost(postContent);

    // verify the post is displayed correctly in feed
    latestPostInFeedContentEq(postContent);
  });

  it('can post with emojis', () => {
    const suffix = Date.now();
    const postContent = `🇦🇺😎🦎 I can post with emojis! ${suffix}`;
    const postContentWithoutEmoji = ` I can post with emojis! ${suffix}`;
    cy.get('#quick-post-create-content').within(() => {
      cy.get('textarea').should('have.value', '');
      // click on textarea to expand to view buttons
      cy.get('textarea').click();

      // add 3 emojis using emoji picker
      selectEmojis(['australia flag', 'smiling face with sunglasses', 'lizard']);

      // type the rest of the post
      cy.get('textarea').type(postContentWithoutEmoji);
      // check displayed content length
      cy.get('#content-length').innerTextShouldEq(`${postContent.length} / 1000`)
      // submit
      cy.get('#post-btn').click();
      // wait for textarea to be cleared to ensure post is submitted
      cy.get('textarea').should('have.value', '');
    });

    // verify the post is displayed correctly in feed
    latestPostInFeedContentEq(postContent);
  });

  // test skipped because viewing uploaded image in post doesn't work for this local deployment
  it.skip('can post with image upload', () => {
    const postContent = `I can post with an image! ${Date.now()}`;
    cy.get('#quick-post-create-content').within(() => {
      cy.get('textarea').should('have.value', '');
      // click on textarea to expand to view buttons
      cy.get('textarea').click();

      // upload image
      cy.get('#media-upload-btn').within(() => {
        const imagePath = Cypress.config('fixturesFolder') + '/mustache-you.png';
        cy.get('#fileInput').selectFile(
          imagePath,
          { force: true } // force to bypass visibility check of hidden input field
        );
      });

      // type the rest of the post and submit
      cy.get('textarea').type(postContent);
      cy.get('#post-btn').click();
    });

    // todo: verify the image is displayed in the post (fails to display uploaded image here)

    // verify the post is displayed correctly in feed
    latestPostInFeedContentEq(postContent);
  });

  // TODO: run with false once posts don't rerender once indexed, see: https://github.com/pubky/pubky-app/issues/992
  //[true, false].forEach((waitForIndexed) => {
  [true].forEach((waitForIndexed) => {
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
    cy.signOut(true);
    const uniquePrefix = Cypress._.uniqueId(Date.now().toString().slice(-3));
    const otherUsername = 'Jeremy The Poser';
    const fullUsername = uniquePrefix + '_' + otherUsername;
    const pubkyAlias = 'jPubky';
    cy.onboardAsNewUser(fullUsername, "My account will be referenced in a post.", true, pubkyAlias);
    cy.signOut(false);
    // sign back in as poster
    cy.signIn(backupDownloadFilePath(username + '.pkarr'));

    const postContent = `I can post with a profile reference! ${Date.now()}`;
    cy.get('#quick-post-create-content').within(() => {
      cy.get('textarea').should('have.value', '');
      // type the post and submit
      // todo: change to upper case J once bug fixed: https://github.com/pubky/pubky-app/issues/457
      cy.get('textarea').type(postContent + ` @${uniquePrefix}`);
      // check that profile searched is performed
      cy.get('#searched-users-card')
        .should('be.visible')
        .children()
        .should('have.length.greaterThan', 0)
        .first()
        .contains(uniquePrefix)
        .click();
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
    deletePost();

    // verify post is deleted
    checkPostIsNotAtTopOfFeed(postContent);

    // reload and check post is still deleted
    cy.reload();
    waitForFeedToLoad();
    checkPostIsNotAtTopOfFeed(postContent);
  });

  // todo: consider combining with 'can delete a post' test
  it("cannot delete other profile's post", ()    => {
    // create profile to create a post to try and delete
    cy.signOut(true);
    cy.onboardAsNewUser('Del Boy', "Try delete my post.");
    const postContent = `Noone else can delete this post! ${Date.now()}`;
    createQuickPost(postContent);
    cy.signOut(false);
    // sign back in as poster
    cy.signIn(backupDownloadFilePath(username + '.pkarr'));

    // try to delete the post made by the other account
    cy.findFirstPostInFeed(false).within(() => {
      // open post menu and check delete is not available
      cy.get('#menu-btn').should('be.visible').click();
      cy.get('#post-tooltip-menu').should('be.visible').within(() => {
        cy.get('#delete-post').should('not.exist');
      });
    });
  });

  [true, false].forEach((waitForIndexed) => {
    it(`can tag whilst creating post (waitForIndexed: ${waitForIndexed})`, () => {
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
      cy.reload();
      waitForFeedToLoad();

      // check tags are still displayed in the post
      verifyPost
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

  [true, false].forEach((waitForIndexed) => {
    it(`can tag and remove tags from existing post on feed page (waitForIndexed: ${waitForIndexed})`, () => {
      const postContent = `I can add and remove tags from my existing post! ${Date.now()}`;
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
        cy.get('#tags').children().its('length').should('eq', expectedTags === ExpectedTags.WithMiddleRemoved ? 3 : 4);
        cy.get('#tags').within(($tags) => {
          cy.get('#tag-0').innerTextShouldContain(expectedOrder === ExpectedOrder.ReverseAlphanumeric ? tag3 : tag1)
          expectedTags === ExpectedTags.WithMiddleRemoved
            ? cy.wrap($tags).innerTextShouldNotContain(tag2)
            : cy.get('#tag-1').innerTextShouldContain(tag2);
          cy.get(expectedTags === ExpectedTags.WithMiddleRemoved ? '#tag-1' : '#tag-2')
            .innerTextShouldContain(expectedOrder === ExpectedOrder.ReverseAlphanumeric ? tag1 : tag3);
        })
      };

      const checkTagCounters = (expectedTags: ExpectedTags, expectedOrder: ExpectedOrder) => {
        cy.get('#tags').within(() => {
          // ordered reverse alphanumeric
          cy.get('#tag-0').should('exist').contains(expectedOrder === ExpectedOrder.ReverseAlphanumeric ? tag3 : tag1)
          cy.get('#tag-0-count').should('exist').contains('1');
          cy.get('#tag-1').should('exist').contains(tag2)
          cy.get('#tag-1-count').should('exist').contains(expectedTags === ExpectedTags.WithMiddleRemoved ? '0' : '1');
          cy.get('#tag-2').should('exist').contains(expectedOrder === ExpectedOrder.ReverseAlphanumeric ? tag1 : tag3)
          cy.get('#tag-2-count').should('exist').contains('1');
        });
      };

      createQuickPost(postContent);

      // add tags to the post
      fastTagPostInFeed([tag1, tag2, tag3], postContent);

      cy.findFirstPostInFeed(waitForIndexed).within(() => {
        // check tags are displayed within the latest post in the feed
        checkTagsAreDisplayed(ExpectedTags.AllThree, ExpectedOrder.Alphanumeric);

        // verify tag can be removed and added back
        clickMiddleTag();
        checkTagCounters(ExpectedTags.WithMiddleRemoved, ExpectedOrder.Alphanumeric);
        clickMiddleTag();
        checkTagCounters(ExpectedTags.AllThree, ExpectedOrder.Alphanumeric);
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

  // TODO: enable when bug fixed, see https://github.com/pubky/pubky-app/issues/1044
  it.skip(`can tag and remove tags from existing post on post page`, () => {
    const postContent = `I can add and remove tags from my existing post! ${Date.now()}`;
    const tag1 = 'açorda';
    const tag2 = 'cassava';
    const tag3 = 'feijoada';

    const checkTagsAreDisplayed = (expectedTags: ExpectedTags, expectedOrder: ExpectedOrder) => {
      cy.get('#post-container').within(($post) => {
        cy.get('#tag-0').should('be.visible').contains(expectedOrder === ExpectedOrder.ReverseAlphanumeric ? tag3 : tag1)
        expectedTags === ExpectedTags.WithMiddleRemoved
          ? cy.wrap($post).innerTextShouldNotContain(tag2)
          : cy.get('#tag-1').should('be.visible').contains(tag2);
          cy.get(expectedTags === ExpectedTags.WithMiddleRemoved ? '#tag-1' : '#tag-2')
          .should('be.visible').contains(expectedOrder === ExpectedOrder.ReverseAlphanumeric ? tag1 : tag3);
        });
      };

    const checkTagCounters = (expectedTags: ExpectedTags, expectedOrder: ExpectedOrder) => {
      cy.get('#post-container').within(() => {
        cy.get('#tag-0').should('exist').contains(expectedOrder === ExpectedOrder.ReverseAlphanumeric ? tag3 : tag1)
        cy.get('#tag-0-count').should('exist').contains('1');
        cy.get('#tag-1').should('exist').contains(tag2)
        cy.get('#tag-1-count').should('exist').contains(expectedTags === ExpectedTags.WithMiddleRemoved ? '0' : '1');
        cy.get('#tag-2').should('exist').contains(expectedOrder === ExpectedOrder.ReverseAlphanumeric ? tag1 : tag3)
        cy.get('#tag-2-count').should('exist').contains('1');
      });
    };

    const clickMiddleTag = () => {
      cy.get('#tag-1').click();
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
    cy.get('#post-container').within(() => {
      cy.get('#show-add-tag-input-btn').click();
      cy.get('#add-tag-input').type(tag2);
      cy.get('#add-tag-btn  ').click();
      cy.get('#show-add-tag-input-btn').click();
      cy.get('#add-tag-input').type(tag3);
      cy.get('#add-tag-btn').click();
    });

    // check tags are displayed for post
    checkTagsAreDisplayed(ExpectedTags.AllThree, ExpectedOrder.Alphanumeric);
    checkTagCounters(ExpectedTags.AllThree, ExpectedOrder.Alphanumeric);

    // remove a tag from the post
    clickMiddleTag();
    checkTagsAreDisplayed(ExpectedTags.AllThree, ExpectedOrder.Alphanumeric);
    checkTagCounters(ExpectedTags.WithMiddleRemoved, ExpectedOrder.Alphanumeric);

    // add the tag back
    clickMiddleTag();
    checkTagsAreDisplayed(ExpectedTags.AllThree, ExpectedOrder.Alphanumeric);
    checkTagCounters(ExpectedTags.AllThree, ExpectedOrder.Alphanumeric);

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
    checkTagCounters(ExpectedTags.WithMiddleRemoved, ExpectedOrder.ReverseAlphanumeric);
  });

  // todo: consider creating user to create the post to bookmark
  it('can bookmark post then remove bookmark', () => {
    const postContent = `This post will be bookmarked! ${Date.now()}`;

    // create a post to bookmark
    createQuickPost(postContent);

    // bookmark the post
    cy.slowDown(fastMs);
    cy.findFirstPostInFeed().within(() => {
      cy.get('#bookmark-btn').click();
    });
    // check bookmark toast is shown (before it disappears)
    cy.get('#toast').should('be.visible').find('h2').contains('bookmark')
    cy.slowDown(defaultMs);

    // navigate to bookmarks page
    cy.get('#header-bookmarks-btn').click();
    cy.location('pathname').should('eq', '/bookmarks');

    // if posts-feed area contains "No bookmarks yet", reload the page
    // cy.get('#posts-feed').innerTextContains('No bookmarks yet').then((noBookmarksYet) => {
    //   if (noBookmarksYet) cy.reload();
    // });

    cy.get('#posts-feed').children().eq(0).should('have.length', 1).children().eq(0).within(() => {
      // verify the post has been bookmarked
      cy.get('#post-content-text').innerTextShouldEq(postContent);

      // remove the bookmark
      cy.get('#bookmark-btn').click();
    });

    // refresh to update the bookmarks page
    cy.waitReload();

    //verify the post is no longer bookmarked
    cy.get('#posts-feed').should('contain.text', 'Save posts for later')
  });

  [true, false].forEach((waitForIndexed) => {
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
      deletePost();

      // verify the repost is deleted
      cy.findFirstPostInFeed(waitForIndexed).within(() => {
        // check that first post is the original post
        cy.get('#post-content-text').innerTextShouldEq(postContent);
      });
    });
  });

  // todo: consider creating user to create the post to repost
  it('can repost without content then delete the repost', () => {
    // create a post to repost
    const postContent = `This post will be reposted without content! ${Date.now()}`;
    createQuickPost(postContent);

    // TODO: remove manual refresh, see https://github.com/pubky/pubky-app/issues/546
    cy.waitReload();

    // repost without content
    repostPost({ postContent });

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
    deletePost(1);

    // verify the repost is displayed in feed with deleted post content
    cy.findFirstPostInFeed().within(($post) => {
      cy.wrap($post).innerTextShouldContain(postContent)
      cy.get('#post-content-text').innerTextShouldEq(repostContent);
    });

    cy.reload();
    waitForFeedToLoad();

    // verify the repost is displayed in feed without deleted post content
    cy.findFirstPostInFeed().within(($post) => {
      cy.wrap($post).innerTextShouldContain("This post has been deleted")
      cy.get('#post-content-text').innerTextShouldEq(repostContent);
    });
  });

  [true, false].forEach((waitForIndexed) => {
    it(`cannot see reply of a deleted post in feed (waitForIndexed: ${waitForIndexed})`, () => {
      // create a post to reply to
      const postContent = `This post will be replied to! ${Date.now()}`;
      const replyContent = `This is my reply! ${Date.now()}`;
      createQuickPost(postContent);

      // reply to the post
      replyToPost({ replyContent, postContent, waitForIndexed });

      // TODO: remove manual refresh, see https://github.com/pubky/pubky-app/issues/#887
      cy.waitReload();
      waitForFeedToLoad();

      // check reply is displayed in feed
      cy.findFirstPostInFeed(waitForIndexed).within(($post) => {
        cy.wrap($post).find('#replies-container').innerTextShouldContain(replyContent);
      });

      // delete the original post
      deletePost();

      // verify the reply and original post are no longer displayed in feed
      cy.get('#timeline').within(($timeline) => {
        cy.wrap($timeline).innerTextShouldNotContain(replyContent);
        cy.wrap($timeline).innerTextShouldNotContain(postContent);
      });

    });
  });

  const createArticle = (articleTitle: string, articleContent: string, tags?: string[]) => {
    cy.get('#article-modal').should('be.visible').within(() => {
      cy.get('h1').contains('New Article');
      cy.get('#article-title-input').type(articleTitle);
      cy.get('#article-content-input').click().invoke('text', articleContent);
      // todo: check counter
      // need to click away from input to enable publish button (either by adding tags or clicking footer)
      tags ? fastTagWhilstCreatingPost(tags) : cy.get('#footer-actions').click();
      cy.get('#post-btn').should('be.enabled').click();
    });
  };

  const checkArticleInFeed = (articleTitle: string, articleContent: string, tags?: string[]) => {
    cy.findFirstPostInFeed().within(($post) => {
      cy.wrap($post).innerTextShouldContain(articleTitle);
      cy.wrap($post).innerTextShouldContain(articleContent);
      if (tags) tags.forEach(tag => cy.wrap($post).innerTextShouldContain(tag));
    });
  };

  it('can create an article from quick post box', () => {
    const articleTitle = `A nice article! ${Date.now()}`;
    const articleContent = `Let me convince you that this is indeed a nice article! ${Date.now()}`;
    const tag1 = 'artitag1';
    const tag2 = 'artitag2';

    cy.get('#quick-post-create-content').should('be.visible').within(() => {
      cy.get('textarea').click();
      cy.get('#article-btn').click();
    });

    createArticle(articleTitle, articleContent, [tag1, tag2]);
    checkArticleInFeed(articleTitle, articleContent, [tag1, tag2]);
  });

  it('can create an article from new post', () => {
    const articleTitle = `Another nice article! ${Date.now()}`;
    const articleContent = `Let me convince you that this is indeed another nice article! ${Date.now()}`;

    cy.get('#new-post-btn').click();

    // input post content and submit
    cy.get('#modal-root').should('be.visible').within(() => {
      cy.get('h1').contains('New Post').should('be.visible');
      cy.get('#new-post-create-content').should('be.visible').within(() => {
        cy.get('#article-btn').click();
      });
    });

    createArticle(articleTitle, articleContent);
    checkArticleInFeed(articleTitle, articleContent);
  });

  // todo: check that reply still shown in own profile page
  // todo: test 'Show n new posts' button
});