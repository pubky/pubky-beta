import { backupDownloadFilePath } from '../support/auth';
//import { saveCopiedPubkyToAlias } from '../support/profile';
import { slowCypressDown } from 'cypress-slow-down';

describe('posts', () => {
  before(() => {
    slowCypressDown(200);
    cy.deleteDownloadsFolder();
    cy.allowClipboardForChrome();

    cy.onboardAsNewUser('Poster', "Big on posting.");
    cy.backupRecoveryFile();
    cy.renameFile(backupDownloadFilePath(), backupDownloadFilePath('poster.pkarr'));
  });

  beforeEach(() => {
    cy.location('pathname').then((currentPath) => {
      if (currentPath !== '/home') {
        cy.signIn(backupDownloadFilePath('poster.pkarr'));
      };
    });
  });

  it('can post from quick post box', () => {
    const postContent = `I can post using the quick post box! ${Date.now()}`;
    cy.get('#quick-post-create-content').within(() => {
      cy.get('textarea').should('have.value', '');
      cy.get('textarea').type(postContent);
      cy.get('#post-button').click();
    });

    // second child is the latest post
    cy.get('#posts-feed').children().eq(1).within(() => {
      cy.innerTextShouldEq('#post-content-text', postContent);
    });
  });

  it('can post from new post', () => {
    const postContent = `I can make a new post! ${Date.now()}`;
    cy.get('#new-post-btn').click();
    cy.get('h1').contains('New Post').should('be.visible');
    cy.get('#new-post-create-content').within(() => {
      cy.get('textarea').should('have.value', '');
      cy.get('textarea').type(postContent);
      cy.get('#post-button').click();
    });
    cy.get('#modal-root').should('not.exist');

    // second child is the latest post
    cy.get('#posts-feed').children().eq(1).within(() => {
      cy.innerTextShouldEq('#post-content-text', postContent);
    });
  });
  
  it.skip('can post with maximum character limit (300)', () => { });
  it.skip('can post with emojis', () => { });
  it.skip('can post with image upload', () => { });
  it.skip('can post with embedded link', () => { });
  it.skip('can post with profile reference', () => { });

});