import { backupDownloadFilePath } from '../support/auth';
import { slowCypressDown } from 'cypress-slow-down'
// registers the cy.slowDown and cy.slowDownEnd commands
import 'cypress-slow-down/commands'
import { selectEmoji,
        latestPostInFeedContentEq,
        deletePost,
        createQuickPost,
        checkPostIsNotAtTopOfFeed,
        clickShowNewPostsBtn,
        repostPost,
        tagPostInFeed} from '../support/posts';
import { defaultMs, fastMs } from '../support/slow-down';

const username = 'Poster';

describe('posts', () => {
  before(() => {
    slowCypressDown();
    cy.deleteDownloadsFolder();

    // create profile to post from
    cy.onboardAsNewUser(username, "Big on posting.");
    cy.backupRecoveryFile();
    cy.renameFile(backupDownloadFilePath(), backupDownloadFilePath(username + '.pkarr'));
  });

  beforeEach(() => {
    // in case it gets changed by a test and not reset
    cy.slowDown(defaultMs);

    // TODO: remove workaround for pkarr rate limiting
    cy.wait(Cypress.env('ci') ? 10_000 : 5_000);

    // sign in if not already
    cy.location('pathname').then((currentPath) => {
      if (currentPath !== '/home') {
        cy.signIn(backupDownloadFilePath(username + '.pkarr'));
      };
    });
  });

  // TODO: remove temp script to add 12 posts, workaround for no 'Show New Posts' button, see https://github.com/pubky/pubky-app/issues/738
  // TODO: comment out if needed once 'Show New Posts' button is showing again
  // it('add 12 posts', () => {
  //   for (let i = 0; i < 12; i++) {
  //     createQuickPost(`Post ${i + 1}`);
  //   }
  // });

  it('can post from quick post box', () => {
    const postContent = `I can post using the quick post box! ${Date.now()}`;
    createQuickPost(postContent);
    clickShowNewPostsBtn();

    // verify the post is displayed correctly in feed
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

    clickShowNewPostsBtn();

    // verify the post is displayed correctly in feed
    latestPostInFeedContentEq(postContent);
  });

  // TODO: make 1000
  it('can post with maximum character limit (300)', () => {
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

    clickShowNewPostsBtn();

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

      // add emojis using emoji picker
      selectEmoji('australia flag');
      selectEmoji('smiling face with sunglasses');
      selectEmoji('lizard');

      // type the rest of the post
      cy.get('textarea').type(postContentWithoutEmoji);
      // check displayed content length
      cy.get('#content-length').innerTextShouldEq(`${postContent.length} / 1000`)
      // submit
      cy.get('#post-btn').click();
      // wait for textarea to be cleared to ensure post is submitted
      cy.get('textarea').should('have.value', '');
    });

    clickShowNewPostsBtn();

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

  it('can post with embedded link', () => {
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

    clickShowNewPostsBtn();

    // verify the post text and embedded link is displayed correctly in feed
    cy.findFirstPostInFeed().within(() => {
      cy.get('#post-content-text').innerTextShouldEq(postContent);
      cy.get('iframe').should('be.visible');
      cy.get('iframe').should('have.attr', 'src', embedLink);
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

    clickShowNewPostsBtn();

    // verify the post is displayed correctly in feed
    latestPostInFeedContentEq(postContent + ` @${fullUsername}`);
  });

  it('can delete a post', () => {
    const postContent = `I can delete this post! ${Date.now()}`;
    createQuickPost(postContent);
    clickShowNewPostsBtn();

    // verify the post is displayed correctly in feed
    latestPostInFeedContentEq(postContent);

    // TODO: remove manual refresh, see https://github.com/pubky/pubky-app/issues/523
    cy.waitReload();

    // delete the post
    deletePost();

    // TODO: remove manual refresh, see https://github.com/pubky/pubky-app/issues/493
    cy.waitReload();

    // verify post is deleted
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
    cy.findFirstPostInFeed().within(() => {
      // open post menu and check delete is not available
      cy.get('#menu-btn').should('be.visible').click();
      cy.get('#post-tooltip-menu').should('be.visible').within(() => {
        cy.get('#delete-post').should('not.exist');
      });
    });
  });

  it('can tag whilst creating post', () => {
    const postContent = `I can post with tags! ${Date.now()}`;
    const tag1 = 'alpacas';
    const tag2 = 'llamas';
    const tag3 = 'vicuñas';

    cy.get('#quick-post-create-content').within(() => {
      cy.get('textarea').should('have.value', '');
      // type the post
      cy.get('textarea').type(postContent);

      // add tags to the post
      cy.get('#tag-btn').click();
      cy.get('#modal-root').should('be.visible').within(() => {
        cy.get('h1').contains('Tag');
        cy.get('input').type(tag1);
        cy.get('#add-btn').should('be.visible').click();
        cy.get('input').type(tag2);
        cy.get('#add-btn').should('be.visible').click();
        cy.get('input').type(tag3);
        cy.get('#add-btn').should('be.visible').click();
        cy.get('#close-btn').click();
      });

      // verify the tags are displayed in the quick post area
      cy.get('#tags').children().should('have.length', 3);
      cy.get('#tags').children().eq(0).contains(tag1);
      cy.get('#tags').children().eq(1).contains(tag2);
      cy.get('#tags').children().eq(2).contains(tag3);

      // check displayed content length
      cy.get('#content-length').innerTextShouldEq(`${postContent.length} / 1000`);

      // submit the post
      cy.get('#post-btn').click();
    });

    clickShowNewPostsBtn();

    // verify the post text and tags are displayed correctly in feed
    cy.findFirstPostInFeed().within(() => {
      // check text
      cy.get('#post-content-text').innerTextShouldEq(postContent);

      // check tags (currently ordered reverse alphabetical)
      cy.get('#tags').find('#tag-0').contains(tag3);
      cy.get('#tags').find('#tag-1').contains(tag2);
      cy.get('#tags').find('#tag-2').contains(tag1);
    });
  });

  it('can tag and remove tags from existing post', () => {
    const postContent = `I can add and remove tags from my existing post! ${Date.now()}`;
    const tag1 = 'bananas';
    const tag2 = 'pjammas';
    const tag3 = 'rastas';

    createQuickPost(postContent);

    // TODO: remove manual refresh, see https://github.com/pubky/pubky-app/issues/539
    cy.waitReload();

    // add tags to the post
    tagPostInFeed(postContent, [tag1, tag2, tag3]);

    // TODO: remove manual refresh, see https://github.com/pubky/pubky-app/issues/541
    // should test before and after refresh
    cy.waitReload();

    // within the latest post in the feed
    cy.findFirstPostInFeed().within(() => {
      cy.get('#tags').children().its('length').then((_oldLength) => {
        cy.get('#tags').within(() => {
          // verify the tags are displayed in the post
          cy.get('#tag-0').contains(tag3);
          cy.get('#tag-1').contains(tag2);
          cy.get('#tag-2').contains(tag1);

          // remove tag from the post
          cy.get('#tag-1').click();
        });

        // verify the tag is removed from the post and other tags remain
        // TODO: check children length once bug fixed, see https://github.com/pubky/pubky-app/issues/543
        //cy.get('#tags').children().should('have.length', oldLength - 1);

        cy.get('#tags').innerTextShouldNotContain(tag2);
        cy.get('#tags').within(() => {
          cy.get('#tag-0').should('exist').contains(tag3);
          cy.get('#tag-2').should('exist').contains(tag1);
        });
      });
    });

    // refresh page and check tag is still removed
    cy.waitReload();
    cy.get('#tags').innerTextShouldNotContain(tag2);
  });

  // todo: consider creating user to create the post to bookmark
  // TODO: reenable once bug fixed: https://github.com/pubky/pubky-app/issues/751
  it.skip('can bookmark post then remove bookmark', () => {
    const postContent = `This post will be bookmarked! ${Date.now()}`;

    // create a post to bookmark
    createQuickPost(postContent);

    // TODO: remove manual refresh, see https://github.com/pubky/pubky-app/issues/545
    cy.waitReload();

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
    cy.get('#posts-feed').innerTextContains('No bookmarks yet').then((noBookmarksYet) => {
      if (noBookmarksYet) cy.reload();
    });

    cy.get('#posts-feed').children().eq(0).should('have.length', 1).children().eq(0).within(() => {
      // verify the post has been bookmarked
      cy.get('#post-content-text').innerTextShouldEq(postContent);

      // remove the bookmark
      cy.get('#bookmark-btn').click();
    });

    // refresh to update the bookmarks page
    cy.waitReload();

    //verify the post is no longer bookmarked
    cy.get('#posts-feed').should('contain.text', 'No bookmarks yet')
  });

  // todo: consider creating user to create the post to repost
  it('can repost with content then delete the repost', () => {
    // create a post to repost
    const postContent = `This post will be reposted with content! ${Date.now()}`;
    const repostContent = 'Reposted with content!';
    createQuickPost(postContent);

    // TODO: remove manual refresh, see https://github.com/pubky/pubky-app/issues/546
    cy.waitReload();

    // repost with content
    cy.slowDown(fastMs);
    repostPost({ repostContent, postContent });

    // check repost message is shown (before the alert disappears)
    cy.get('#message-alert').should('be.visible').and('contain.text', 'Repost');
    cy.slowDown(defaultMs);

    // verify the repost with content is displayed correctly in feed
    // TODO: remove manual refresh refresh, see https://github.com/pubky/pubky-app/issues/466 & https://github.com/pubky/pubky-app/issues/523
    cy.waitReload();
    cy.findFirstPostInFeed().within(() => {
      // check that both the repost text and original post text are displayed
      const expectedContent = [repostContent, postContent];
      cy.get('#post-content-text').each((elem, index) => {
        cy.wrap(elem).innerTextShouldEq(expectedContent[index]);
      });
    });

    // delete the repost
    deletePost();

    // TODO: remove manual refresh, see https://github.com/pubky/pubky-app/issues/493
    cy.waitReload();

    // verify the repost is deleted
    cy.findFirstPostInFeed().within(() => {
      // check that first post is the original post
      cy.get('#post-content-text').innerTextShouldEq(postContent);
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
    // refresh to workaround for https://github.com/pubky/pubky-app/issues/466 & https://github.com/pubky/pubky-app/issues/523
    cy.waitReload();

    cy.findFirstPostInFeed().within(($post) => {
      // check that only original post text is displayed and not additional content text
      cy.get('#post-content-text').its('length').should('eq', 1);
      cy.wrap($post).innerTextShouldContain(username + ' reposted');

      // undo the repost
      cy.wrap($post).contains('Undo repost').click();
    });

    // TODO: remove manual refresh, see https://github.com/pubky/pubky-app/issues/493
    cy.waitReload();
    if (Cypress.env('ci')) cy.wait(3000);

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

    // TODO: remove manual refresh, see https://github.com/pubky/pubky-app/issues/546
    cy.waitReload();

    // repost
    repostPost({ repostContent, postContent });

    // refresh to workaround for https://github.com/pubky/pubky-app/issues/466
    cy.waitReload();

    // delete the original post (index 1 as the repost is at index 0)
    deletePost(1);

    // TODO: remove manual refresh, see https://github.com/pubky/pubky-app/issues/493
    cy.waitReload();

    // verify the repost is still displayed in feed
    cy.findFirstPostInFeed().within(($post) => {
      // check that only the repost text is displayed and not the original content text
      cy.wrap($post).innerTextShouldContain("This post has been deleted")
      cy.get('#post-content-text').innerTextShouldEq(repostContent);
    });
  });

  // todo: consider creating user to create the post to reply to
  it('can reply to a post and delete the reply', () => {
    // create a post to reply to
    const postContent = `This post will be replied to! ${Date.now()}`;
    const replyContent = `This is my reply! ${Date.now()}`;
    createQuickPost(postContent);
    clickShowNewPostsBtn();

    // reply to the post
    cy.slowDown(fastMs);
    cy.findFirstPostInFeed().within(() => {
      cy.get('#reply-btn').click();
    });
    cy.get('#modal-root').should('be.visible').within(($modal) => {
      cy.get('h1').contains('Reply');
      // check that the post content is displayed in the reply modal
      cy.wrap($modal).contains(postContent);
      cy.get('textarea').should('have.value', '');
      cy.get('textarea').type(replyContent);
      cy.get('#reply-btn').click();
    });

    // check reply message is shown (before the alert disappears)
    cy.get('#message-alert').should('be.visible').and('contain.text', 'Reply');
    cy.slowDown(defaultMs);

    // verify the reply is displayed correctly in feed
    // refresh to workaround for https://github.com/pubky/pubky-app/issues/466
    cy.waitReload();
    if (Cypress.env('ci')) cy.wait(3000);
    cy.findFirstPostInFeed().within(($post) => {
      cy.wrap($post).innerTextShouldContain(postContent)
      cy.wrap($post).innerTextShouldContain(replyContent);
    });

    // delete the reply (post is at index 1) (menuBtnIdx 1 for reply)
    deletePost(0, 1);

    // verify the reply is deleted
    // refresh to workaround for https://github.com/pubky/pubky-app/issues/466
    cy.waitReload();
    cy.findFirstPostInFeed().within(($post) => {
      cy.wrap($post).innerTextShouldContain(postContent)
      cy.wrap($post).innerTextShouldNotContain(replyContent);
    });
  });

  it('cannot see reply of a deleted post in feed', () => {
    // create a post to reply to
    const postContent = `This post will be replied to! ${Date.now()}`;
    const replyContent = `This is my reply! ${Date.now()}`;
    createQuickPost(postContent);
    clickShowNewPostsBtn();

    // reply to the post
    cy.findFirstPostInFeed().within(() => {
      cy.get('#post-content-text').innerTextShouldEq(postContent);
      cy.get('#reply-btn').click();
    });
    cy.get('#modal-root').should('be.visible').within(() => {
      cy.get('textarea').type(replyContent);
      cy.get('#reply-btn').click();
    });

    // refresh to workaround for https://github.com/pubky/pubky-app/issues/466
    cy.waitReload();

    // delete the original post
    deletePost();

    // TODO: remove manual refresh, see https://github.com/pubky/pubky-app/issues/493
    cy.waitReload();

    // verify the reply and original post are no longer displayed in feed
    cy.findFirstPostInFeed().within(() => {
      cy.get('#post-content-text').innerTextShouldNotContain(replyContent);
      cy.get('#post-content-text').innerTextShouldNotContain(postContent);
    });

    // todo: check that reply still shown in own profile page
    // todo: test article
  });
});