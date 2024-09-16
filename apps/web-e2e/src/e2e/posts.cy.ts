import { backupDownloadFilePath } from '../support/auth';
import { slowCypressDown } from 'cypress-slow-down'
// registers the cy.slowDown and cy.slowDownEnd commands
import 'cypress-slow-down/commands'
import { selectEmoji, latestPostInFeedContentEq, deletePost } from '../support/posts';
import { defaultMs, fastMs } from '../support/slow-down';

describe('posts', () => {
  before(() => {
    slowCypressDown();
    cy.deleteDownloadsFolder();

    // create profile to post from
    cy.onboardAsNewUser('Poster', "Big on posting.");
    cy.backupRecoveryFile();
    cy.renameFile(backupDownloadFilePath(), backupDownloadFilePath('poster.pkarr'));
  });

  beforeEach(() => {
    // sign in if not already
    cy.location('pathname').then((currentPath) => {
      if (currentPath !== '/home') {
        cy.signIn(backupDownloadFilePath('poster.pkarr'));
      };
    });
  });

  it('can post from quick post box', () => {
    const postContent = `I can post using the quick post box! ${Date.now()}`;
    cy.get('#quick-post-create-content').within(() => {
      // input post content within quick post area and submit
      cy.get('textarea').should('have.value', '');
      cy.get('textarea').type(postContent);
      cy.get('#post-btn').click();
    });

    // verify the post is displayed correctly in feed
    latestPostInFeedContentEq(postContent);
  });

  it('can post from new post', () => {
    const postContent = `I can make a new post! ${Date.now()}`;
    // click button to display new post modal
    cy.get('#new-post-btn').click();
    cy.get('h1').contains('New Post').should('be.visible');

    // input post content and submit
    cy.get('#new-post-create-content').within(() => {
      cy.get('textarea').should('have.value', '');
      cy.get('textarea').type(postContent);
      cy.get('#post-btn').click();
    });
    cy.get('#modal-root').should('not.exist');

    // verify the post is displayed correctly in feed
    latestPostInFeedContentEq(postContent);
  });

  it('can post with maximum character limit (300)', () => {
    const postContent =
      "I can make a really loooooooooooooooooooooooooooooo" +
      "ooooooooooooooooooooooooooooooooooooooooooooooooooo" +
      "ooooooooooooooooooooooooooooooooooooooooooooooooooo" +
      "ooooooooooooooooooooooooooooooooooooooooooooooooooo" +
      "ooooooooooooooooooooooooooooooooooooooooooooooooooo" +
      `ooooooooooooooooooooooong post! ${Date.now()}`;

      cy.get('#quick-post-create-content').within(() => {
        cy.get('textarea').should('have.value', '')
          .type(postContent)
        cy.get('#content-length').innerTextShouldEq('300 / 300')
          .get('#post-btn').click();
    });

    // verify the post is displayed correctly in feed
    latestPostInFeedContentEq(postContent);
  });

  it('can post with emojis', () => {
    const postContent = `🇦🇺😎🦎 I can post with emojis! ${Date.now()}`;
    const postContentWithoutEmoji = ` I can post with emojis! ${Date.now()}`;
    cy.get('#quick-post-create-content').within(() => {
      cy.get('textarea').should('have.value', '');
      // click on textarea to expand to view buttons
      cy.get('textarea').click();

      // add emojis using emoji picker
      selectEmoji('australia flag');
      selectEmoji('smiling face with sunglasses');
      selectEmoji('lizard');

      // type the rest of the post and submit
      cy.get('textarea').type(postContentWithoutEmoji);
      cy.get('#post-btn').click();
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

    // verify the post text and embedded link is displayed correctly in feed
    cy.get('#posts-feed').children().eq(1).within(() => {
      cy.get('#post-content-text').innerTextShouldEq(postContent);
      cy.get('iframe').should('be.visible');
      cy.get('iframe').should('have.attr', 'src', embedLink);
    });
  });

  it('can post with profile reference', () => {
    // create profile to refer to in a post
    cy.signOut(true);
    const uniquePrefix = Cypress._.uniqueId();
    const username = 'Jeremy The Poser';
    const fullUsername = uniquePrefix + '_' + username;
    const pubkyAlias = 'jPubky';
    cy.onboardAsNewUser(fullUsername, "My account will be referenced in a post.", pubkyAlias);
    cy.signOut(false);
    // sign back in as poster
    cy.signIn(backupDownloadFilePath('poster.pkarr'));

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
    cy.get('#quick-post-create-content').within(() => {
      // input post content within quick post area and submit
      cy.get('textarea').should('have.value', '');
      cy.get('textarea').type(postContent);
      cy.get('#post-btn').click();
    });

    // verify the post is displayed correctly in feed
    latestPostInFeedContentEq(postContent);

    // delete the post
    deletePost();

    // verify post is deleted
    cy.get('#posts-feed').children().its('length').then((length) => {
      // if at least 1 post still exists, check it doesn't match the text of the deleted post
      if (length > 1) {
        cy.get('#posts-feed').children().eq(1).within(() => {
          cy.get('#post-content-text').innerTextShouldNotEq(postContent);
        });
      };
    });
  });

  // todo: consider combining with 'can delete a post' test
  it("cannot delete other profile's post", ()    => {
    // create profile to create a post to try and delete
    cy.signOut(true);
    cy.onboardAsNewUser('Del Boy', "Try delete my post.");
    const postContent = `Noone else can delete this post! ${Date.now()}`;
    cy.get('#quick-post-create-content').within(() => {
      // input post content within quick post area and submit
      cy.get('textarea').should('have.value', '');
      cy.get('textarea').type(postContent);
      cy.get('#post-btn').click();
    });
    cy.signOut(false);
    // sign back in as poster
    cy.signIn(backupDownloadFilePath('poster.pkarr'));

    // try to delete the post made by the other account
    cy.get('#posts-feed').children().eq(1).within(() => {
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

      // submit the post
      cy.get('#post-btn').click();
    });

    // verify the post text and tags are displayed correctly in feed
    cy.get('#posts-feed').children().eq(1).within(() => {
      // check text
      cy.get('#post-content-text').innerTextShouldEq(postContent);

      // check tags
      cy.get('#tags').find('#tag-0').contains(tag1);
      cy.get('#tags').find('#tag-1').contains(tag2);
      cy.get('#tags').find('#tag-2').contains(tag3);
    });
  });

  it('can tag and remove tags from existing post', () => {
    const postContent = `I can add and remove tags from my existing post! ${Date.now()}`;
    const tag1 = 'bananas';
    const tag2 = 'pjammas';
    const tag3 = 'rastas';

    cy.get('#quick-post-create-content').within(() => {
      cy.get('textarea').should('have.value', '');
      // type the post and submit
      cy.get('textarea').type(postContent);
      cy.get('#post-btn').click();
    });

    // add tags to the post
    cy.get('#tag-btn').click();
    cy.get('#modal-root').within(() => {
      cy.get('h1').contains('Tag Post');
      cy.get('input').type(tag1);
      cy.get('#add-btn').click();
      cy.get('input').type(tag2);
      cy.get('#add-btn').click();
      cy.get('input').type(tag3);
      cy.get('#add-btn').click();

      // check current tags in modal
      cy.get('#current-tags').children('div').should('have.length', 3).then((divs) => {
        cy.wrap(divs.eq(0)).contains(tag1);
        cy.wrap(divs.eq(1)).contains(tag2);
        cy.wrap(divs.eq(2)).contains(tag3);
      });

      // close modal
      cy.get('#close-btn').click();
    });

    // within the latest post in the feed
    cy.get('#posts-feed').children().eq(1).within(() => {
      cy.get('#tags').children().its('length').then((oldLength) => {
        cy.get('#tags').within(() => {
          // verify the tags are displayed in the post
          cy.get('#tag-0').contains(tag1);
          cy.get('#tag-1').contains(tag2);
          cy.get('#tag-2').contains(tag3);

          // remove tag from the post
          cy.get('#tag-1').click();
        });

        // verify the tag is removed from the post and other tags remain
        cy.get('#tags').children().should('have.length', oldLength - 1);
        cy.get('#tags').within(() => {
          cy.get('#tag-0').should('exist').contains(tag1);
          cy.get('#tag-1').should('exist').contains(tag3);
        });
      });
    });
  });


  // todo: consider creating user to create the post to bookmark
  it('can bookmark post then remove bookmark', () => {
    // create a post to bookmark
    const postContent = `This post will be bookmarked! ${Date.now()}`;
    cy.get('#quick-post-create-content').within(() => {
      // input post content within quick post area and submit
      cy.get('textarea').should('have.value', '');
      cy.get('textarea').type(postContent);
      cy.get('#post-btn').click();
    });

    // bookmark the post
    cy.slowDown(fastMs);
    cy.get('#posts-feed').children().eq(1).within(() => {
      cy.get('#bookmark-btn').click();
    });
    // check bookmark toast is shown (before the toast disappears)
    cy.get('#toast').should('be.visible').find('h2').contains('bookmark')
    cy.slowDown(defaultMs);

    // verify the post has been bookmarked in the profile page
    cy.get('#header-profile-pic').click();
    cy.get('#profile-tab-bookmarks').click();
    cy.get('#bookmarks-content').children().first().within(() => {
      cy.get('#post-content-text').innerTextShouldEq(postContent);

      // remove the bookmark
      cy.get('#bookmark-btn').click();
    });

    // verify post is not longer listed on profile page
    cy.reload();
    cy.get('#bookmarks-content').should('contain.text', 'No bookmarks yet');
  });

  // todo: consider creating user to create the post to repost
  it('can repost with content then delete the repost', () => {
    // create a post to bookmark
    const postContent = `This post will be reposted! ${Date.now()}`;
    const repostContent = 'Reposted with content!';
    cy.get('#quick-post-create-content').within(() => {
      // input post content within quick post area and submit
      cy.get('textarea').should('have.value', '');
      cy.get('textarea').type(postContent);
      cy.get('#post-btn').click();
    });

    // repost with content
    cy.slowDown(fastMs);
    cy.get('#posts-feed').children().eq(1).within(() => {
      cy.get('#repost-btn').click();
    });
    cy.get('#modal-root').should('be.visible').within(() => {
      cy.get('h1').contains('Repost');
      cy.get('textarea').should('have.value', '');
      cy.get('textarea').type(repostContent);
      cy.get('#repost-btn').click();
    });

    // verify the repost with content is displayed correctly in feed
    // refresh to workaround for https://github.com/pubky/pubky-app/issues/466
    cy.reload();
    cy.get('#posts-feed').children().eq(1).within(() => {
      // check that both the repost text and original post text are displayed
      const expectedContent = [repostContent, postContent];
      cy.get('#post-content-text').each((elem, index) => {
        cy.wrap(elem).innerTextShouldEq(expectedContent[index]);
      });
    });

    // delete the repost
    deletePost();

    // verify the repost is deleted
    cy.get('#posts-feed').children().eq(1).within(() => {
      // check that first post is the original post
      cy.get('#post-content-text').innerTextShouldEq(postContent);
    });
  });

  // can repost without content then undo the repost
    // repost without content

    // verify the repost without content

    // undo one of the reposts

    // verify undo worked

  // can delete the original post that has been reposted

  // can reply to a post and delete the reply

  // delete original post that has been replied to

});