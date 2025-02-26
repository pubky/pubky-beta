export interface NetworkRequest {
  timestamp: string;
  method: string;
  url: string;
  requestBody: any;
}

export const interceptNetworkRequest = (interceptedRequests: NetworkRequest[]) => {
  cy.intercept('**/api/invite-code', (req) => {
    const requestData: NetworkRequest = {
      timestamp: new Date().toISOString(),
      method: req.method,
      url: req.url,
      requestBody: req.body
    };
    interceptedRequests.push(requestData);
  });
};

export const saveNetworkRequestLog = (interceptedRequests: NetworkRequest[], testSuite: string) => {
  const logFilePath = `dist/cypress/apps/web-e2e/invite-code-network-logs/${testSuite}.json`;
  cy.writeFile(logFilePath, JSON.stringify(interceptedRequests, null, 2), { flag: 'w' }).then(() => {
    console.log('Network log saved to', logFilePath);
  });
};

// tag a post or profile using modal with any number of tags
// use once modal is visible
// profileName is optional, it can be used to check header is `Tag {profileName}`
export const addTagsWithModal = (tags: string[]) => {
  cy.get('#modal-root').within(() => {
    cy.get('h1').contains('Tag');

    // add tags to the post
    for (const tag of tags) {
      cy.get('input').type(tag);
      cy.get('#add-btn').should('be.visible').click();
    }

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
};

// input invite code and proceed
export const passInviteCode = () => {
  // TODO: improve detection of page finished loading and redirecting
  cy.wait(1000);
  cy.location('pathname').then((path) => {
    if (path === '/invite-code') {
      // Enter invite code
      cy.get('input').type('53SU23U3');
      // Click continue button
      cy.contains('button', 'Continue').click();
      // Ensure we moved past the invite code page
      cy.location('pathname').should('eq', '/onboarding/sign-in');
      // TODO: improve detection of page finished loading and redirecting
      cy.wait(1000);
    }
  });
};
