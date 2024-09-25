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
  cy.get('#posts-feed').children().eq(idx).within(() => {
    // This approach is necessary for due to additional space inserted before final word.
    cy.get('#post-content-text').innerTextShouldEq(postContent);
  });
};

export const latestPostInFeedContentEq = (postContent: string) => {
  postInFeedContentEq(postContent, 1);
};

export const createQuickPost = (postContent: string, expectedPostLength? : number) => {
  cy.get('#quick-post-create-content').should('be.visible').within(() => {
    // input post content within quick post area
    cy.get('textarea').should('have.value', '')
      .get('textarea').type(postContent);
    // verify displayed content length
    cy.log('postContent.length: ', postContent.length);
    expectedPostLength
      ? cy.get('#content-length').innerTextShouldEq(`${expectedPostLength} / 300`)
      : cy.get('#content-length').innerTextShouldEq(`${postContent.length} / 300`);
    // submit
    cy.get('#post-btn').click();
  });
};

// menuBtnIdx: 0 for original post, 1 for reply
export const deletePost = (postIdx = 1, menuBtnIdx = 0) => {
  cy.get('#posts-feed').children().eq(postIdx).within(() => {
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

// repost any post in the feed that contains the filterText by index
// if no arguments or just repostContent is provided then it reposts the latest post in the feed
// TODO: default filterText value to filter out the quick post area then can change default index to 0
export const repostPost = ({repostContent, postContent, filterText, postIdx}: {repostContent?: string, postContent?: string, filterText?: string, postIdx?: number}) => {
  cy.findPostInFeed(filterText, postIdx).within(() => {
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
