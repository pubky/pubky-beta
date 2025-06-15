import { backupDownloadFilePath } from '../support/auth';
import { slowCypressDown } from 'cypress-slow-down';
// registers the cy.slowDown and cy.slowDownEnd commands
import 'cypress-slow-down/commands';
import { createQuickPost, createQuickPostWithTags } from '../support/posts';
import { CheckIndexed } from '../support/types/enums';

describe('search', () => {
  before(() => {
    slowCypressDown();
    cy.deleteDownloadsFolder();
  });

  // TODO: continue test once search bug is fixed, see https://github.com/pubky/pubky-app/issues/1427
  it('can search for tag to find posts with that tag', () => {
    const uniqueId = Cypress._.uniqueId(Date.now().toString().slice(-2));
    const tag1 = `tag1-${uniqueId}`;
    const tag2 = `tag2-${uniqueId}`;
    const tag3 = `tag3-${uniqueId}`;
    const postTag1 = `Post with tag1 and tag3 ${Date.now()}`;
    const postTag2 = `Post with tag2 ${Date.now()}`;
    const postTags2and3 = `Post with tag2 and tag3 ${Date.now()}`;
    const postNoTags = `Post with no tags ${Date.now()}`;

    // sign up as new user
    cy.onboardAsNewUser('Mr Search', 'I like to search');

    // create a post with tag1
    createQuickPostWithTags(postTag1, [tag1]);
    // create a post with tag2
    createQuickPostWithTags(postTag2, [tag2]);
    // create a post with tag1 and tag2
    createQuickPostWithTags(postTags2and3, [tag2, tag3]);
    // create a post with no tags
    createQuickPost(postNoTags);

    // wait for posts to be indexed before searching
    cy.findFirstPostInFeed(CheckIndexed.Yes);

    // search for a single tag
    cy.get('#header-search-input').type(tag1).type('{enter}');
    // confirm tag remains displayed in the search bar
    cy.get('#header-search-input').innerTextContains(tag1);

    // confirm one post is seen in result
    cy.get('#post-search-results').children().should('have.length', 1);
    // confirm correct post is seen in result
    cy.findPostInSearchResults(postTag1).innerTextShouldContain(postTag1).innerTextShouldNotContain(postTag2);

    // search for two tags
    // TODO: FAILS here because of multi-tag search bug, see https://github.com/pubky/pubky-app/issues/1427
    // cy.get('#header-search-input').type(tag2).type('{enter}');
    // confirm both tags remain displayed in the search bar
    // cy.get('#header-search-input').innerTextContains(tag1).and('innerTextContains', tag2);

    // confirm three posts are seen in result
    // cy.get('#post-search-results')
    //   .children()
    //   .should('have.length', 3);
    // confirm correct posts are seen in result
    // cy.findPostInSearchResults(postTag1).innerTextShouldContain(tag1);
    // cy.findPostInSearchResults(postTag2).innerTextShouldContain(tag2);
    // cy.findPostInSearchResults(postTags2and3).innerTextShouldContain(tag2).innerTextShouldContain(tag3);

    // remove first tag from search

    // confirm two posts remain in result
  });
});
