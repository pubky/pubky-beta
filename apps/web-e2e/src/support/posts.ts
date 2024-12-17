import { defaultMs } from "./slow-down";

// select an emoji using the emoji picket by its data-full-name attribute
export const selectEmoji = (emojiName: string) => {
  cy.get('#emoji-btn').click();
  cy.get('#emoji-picker').should('be.visible');
  cy.get('#emoji-picker').within(() => {
    cy.get(`button[data-full-name*="${emojiName}"]`).click();
  });
};

// verify that a post in the feed has the expected content, post is located by index
export const postInFeedContentEq = (postContent: string, idx: number) => {
  cy.get('#posts-feed').find('#timeline').children().should('have.length.gte', 1).eq(idx).within(() => {
    // This approach is necessary for due to additional space inserted before final word.
    cy.get('#post-content-text').innerTextShouldEq(postContent);
  });
};

export const latestPostInFeedContentEq = (postContent: string) => {
  postInFeedContentEq(postContent, 0);
};

export const createQuickPost = (postContent: string, expectedPostLength? : number) => {
  cy.get('#quick-post-create-content').should('be.visible').within(() => {
    // input post content within quick post area
    cy.get('textarea').should('have.value', '')
      .get('textarea').type(postContent);
    // verify displayed content length
    cy.log('postContent.length: ', postContent.length);
    expectedPostLength
      ? cy.get('#content-length').innerTextShouldEq(`${expectedPostLength} / 1000`)
      : cy.get('#content-length').innerTextShouldEq(`${postContent.length} / 1000`);
    // submit
    cy.get('#post-btn').click();
  });
};

// repost any post in the feed that contains the filterText by index
// if no arguments or just repostContent is provided then it reposts the latest post in the feed
// TODO: default filterText value to filter out the quick post area then can change default index to 0
export const repostPost = ({repostContent, postContent, filterText, postIdx}: {repostContent?: string, postContent?: string, filterText?: string, postIdx?: number}) => {
  cy.findPostInFeed(postIdx, filterText).within(() => {
    cy.get('#repost-btn').click();
  });
  cy.get('#modal-root').should('be.visible').within(($modal) => {
    cy.get('h1').contains('Repost');
    // optionally check that the post content is displayed in the repost modal
    if (postContent) cy.wrap($modal).contains(postContent);
    cy.get('textarea').should('have.value', '');
    if (repostContent) cy.get('textarea').type(repostContent);
    cy.get('#repost-btn').click();
  });
};

// tag a post with any number of tags
export const tagPost = (postContent: string, tags: string[]) => {
  cy.findFirstPostInFeed(postContent).within(() => {
    cy.get('#tag-btn').click();
    cy.get('#modal-root').within(() => {
      cy.get('h1').contains('Tag Post');

      // add tags to the post
      for (const tag of tags) {
        cy.get('input').type(tag);
        cy.get('#add-btn').should('be.visible').click();
      };

      // TODO: uncomment once bug is fixed, see https://github.com/pubky/pubky-app/issues/541
      // check current tags in modal
      // cy.get('#current-tags').children('div').should('have.length', 3).then((divs) => {
      //   cy.wrap(divs.eq(0)).contains(tag1);
      //   cy.wrap(divs.eq(1)).contains(tag2);
      //   cy.wrap(divs.eq(2)).contains(tag3);
      // });

      // close modal
      cy.get('#close-btn').click();
    });
  });
};

// menuBtnIdx: 0 for original post, 1 for reply
export const deletePost = (postIdx = 0, menuBtnIdx = 0) => {
  cy.findPostInFeed(postIdx).within(() => {
    // delete the repost
    // cy.find('#menu-btn').eq(menuBtnIdx).should('be.visible').click();
    // '[id="menu-btn"]' will find all with id
    cy.get('[id="menu-btn"]').eq(menuBtnIdx).should('be.visible').click();
    cy.get('#post-tooltip-menu').should('be.visible').within(() => {
      cy.get('#delete-post').should('be.visible')
        .innerTextShouldEq('Delete post')
        .get('#delete-post').click();
    });
  });

  // confirm delete in modal
  cy.get('#modal-root').should('be.visible').within(() => {
    cy.get('h1').contains('Delete Post');
    cy.get('#delete-post-btn').click();
  });
};

export const checkPostIsNotAtTopOfFeed = (postContent: string) => {
  cy.get('#posts-feed').find('#timeline').children().its('length').then((length) => {
    // if at least 1 post still exists, check it doesn't match the text of the deleted post
    if (length > 0) {
      cy.get('#posts-feed').find('#timeline').children().should('have.length.gte', 1).eq(0).within(() => {
        cy.get('#post-content-text').innerTextShouldNotEq(postContent);
      });
    };
  });
};

export const checkPostIsAtIndexInFeed = (postContent: string, index: number) => {
  cy.get('#posts-feed').find('#timeline').children().should('have.length.gte', 1).eq(index).within(() => {
    cy.get('#post-content-text').innerTextShouldEq(postContent);
  });
};

// wait for 'show n new posts' button to be visible
// check its counter displayes the correct number of new posts and click it
export const clickShowNewPostsBtn = (expectedCounter = 1) => {
  cy.get('#show-new-posts-button', { timeout: Cypress.env('ci') ? 60_000 : 15_000 })
    .scrollIntoView()
    .should('be.visible')
    .should('contain.text', ` ${expectedCounter} `)
    .click();
};

const findAndCountPostsInFeed = (filterText: string, expectedCount: number) => {
  cy.get('#posts-feed').find('#timeline').children().then($posts => {
    // Filter posts by text and assert none are found
    const matchingPosts = $posts.filter((_idx, element) => element.innerText.includes(filterText));

    // Assert that the correct number of posts are found with the provided text
    expect(matchingPosts).to.have.length(expectedCount);
  });
};

export const cannotFindPostInFeed = (filterText: string) => {
  findAndCountPostsInFeed(filterText, 0);
};

export const countPostsInFeed = (filterText: string, expectedCount: number) => {
  findAndCountPostsInFeed(filterText, expectedCount);
};