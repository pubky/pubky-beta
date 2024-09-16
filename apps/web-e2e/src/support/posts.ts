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

// use within child of #posts-feed
export const deletePost = () => {
  // delete the repost
  cy.get('#menu-btn').should('be.visible').click();
  cy.get('#post-tooltip-menu').should('be.visible').within(() => {
    cy.get('#delete-post').should('be.visible')
      .innerTextShouldEq('Delete post')
      .get('#delete-post').click();
  });

  // confirm delete in modal
  cy.get('#modal-root').should('be.visible').within(() => {
    cy.get('h1').contains('Delete Post');
    cy.get('#delete-post-btn').click();
  });
};