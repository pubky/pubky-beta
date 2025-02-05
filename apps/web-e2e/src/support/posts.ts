// select an emoji using the emoji picket by its data-full-name attribute
export const selectEmojis = (emojiName: string[]) => {
  // open emoji picker
  cy.get('#emoji-btn').click();

  // select each emoji
  emojiName.forEach((emoji) => {
    cy.get('#emoji-picker').should('be.visible');
    cy.get('#emoji-picker').within(() => {
      cy.get(`button[data-full-name*="${emoji}"]`).click();
    });
  });

  // close emoji picker by clicking outside of it
  cy.get('#emoji-picker').parent().click('left');
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

// reply to any post in the feed that contains the filterText by index
export const replyToPost = ({replyContent, postContent, filterText, postIdx}: {replyContent: string, postContent?: string, filterText?: string, postIdx?: number}) => {
  cy.findPostInFeed(postIdx, filterText).within(() => {
    cy.get('#reply-btn').click();
  });
  cy.get('#modal-root').should('be.visible').within(($modal) => {
    cy.get('h1').contains('Reply');
    // check that the post content is displayed in the reply modal
    if (postContent) cy.wrap($modal).contains(postContent);
    cy.get('textarea').should('have.value', '');
    cy.get('textarea').type(replyContent);
    cy.get('#reply-btn').click();
  });
};

// repost any post in the feed that contains the filterText by index
// if no arguments or just repostContent is provided then it reposts the latest post in the feed
// TODO: default filterText value to filter out the quick post area then can change default index to 0
export const repostPost = ({repostContent, waitForIndexed, postContent, filterText, postIdx}: {repostContent?: string, waitForIndexed?: boolean, postContent?: string, filterText?: string, postIdx?: number}) => {
  cy.findPostInFeed(postIdx, filterText, waitForIndexed).within(() => {
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

// find a post first and use within it. Useful for fast tagging posts not in the feed.
export const fastTagPost = (tags: string[]) => {
  cy.get('#tags').within(() => {
    tags.forEach((tag) => {
      cy.get('#show-add-tag-input-btn').click();
      cy.get('input').type(tag);
      cy.get('#add-tag-btn').click();
    });
  });
};

// tag a post in feed with any number of tags
export const fastTagPostInFeed = (tags: string[], postContent?: string) => {
  cy.findFirstPostInFeedFiltered(postContent).within(() => {
    fastTagPost(tags);
  });
};

// menuBtnIdx: 0 for original post, 1 for reply

export const editPost = (newPostContent: string, postIdx = 0, menuBtnIdx = 0) => {
  // find post and click menu button
  cy.findPostInFeed(postIdx).within(() => {
    // '[id="menu-btn"]' finds all with id
    cy.get('[id="menu-btn"]').eq(menuBtnIdx).should('be.visible').click();
    cy.get('#post-tooltip-menu').should('be.visible').within(() => {
      cy.get('#edit-post').should('be.visible')
        .innerTextShouldEq('Edit post')
        .get('#edit-post').click();
    });
  });

  // input edited post content in modal and submit
  cy.get('#modal-root').should('be.visible').within(() => {
    cy.get('h1').contains('Edit Post');
    cy.get('textarea')
      .clear()
      .type(newPostContent);
    cy.get('#post-btn').click();
  });
};

// menuBtnIdx: 0 for original post, 1 for reply
export const deletePost = (postIdx = 0, menuBtnIdx = 0) => {
  // find post and click menu button
  cy.findPostInFeed(postIdx).within(() => {
    // '[id="menu-btn"]' finds all with id
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

// wait for feed timeline to not show "No posts yet" or "Loading"
export const waitForFeedToLoad = (seconds: number = 6) => {
  const checkTimelineRecursively = (attempts: number, firstCheck: boolean = true) => {
    if (attempts <= 0) assert(false, "Timeline still shows 'No posts yet' or 'Loading' after 5 seconds");

    cy.get('#posts-feed').find('#timeline').invoke('text').then((text) => {
      if (text.includes('No posts yet') || text.includes('Loading')) {
        firstCheck ? cy.wait(200) : cy.wait(1000);
        checkTimelineRecursively(attempts - 1, false);
      }
    });
  };

  checkTimelineRecursively(seconds);
};

// wait for 'show n new posts' button to be visible
// check its counter displayes the correct number of new posts and click it
export const clickShowNewPostsBtn = (expectedCounter = 1) => {
  // TODO: uncomment original code once 'show n new posts' button is showing again after creating a new post
  // cy.get('#show-new-posts-button', { timeout: Cypress.env('ci') ? 60_000 : 15_000 })
  //   .scrollIntoView()
  //   .should('be.visible')
  //   .should('contain.text', ` ${expectedCounter} `)
  //   .click();

  // meanwhile, just refresh the page to show new posts
  cy.wait(3_000);
  cy.reload();
  waitForFeedToLoad();
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