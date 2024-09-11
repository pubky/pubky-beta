import { backupDownloadFilePath } from '../support/auth';
import { slowCypressDown } from 'cypress-slow-down';
import { selectEmoji, latestPostInFeedContentEq } from '../support/posts';

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
        cy.get('textarea').should('have.value', '');
        cy.get('textarea').type(postContent);
        cy.innerTextShouldEq('#content-length', '300 / 300');
        cy.get('#post-btn').click();
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
      cy.innerTextShouldEq('#post-content-text', postContent);
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

});