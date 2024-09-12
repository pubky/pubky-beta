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