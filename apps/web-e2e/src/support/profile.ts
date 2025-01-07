interface ProfileField {
  editSelector: string;
  verifySelector: string;
}

const profileFields: { [key: string]: ProfileField } = {
  name: {
    editSelector: '#edit-profile-name-input',
    verifySelector: '#profile-username-header',
  },
  bio: {
    editSelector: '#edit-profile-bio-input',
    verifySelector: '#profile-bio-content',
  },
  linkWebsite: {
    editSelector: '#edit-profile-link-website-input',
    verifySelector: '#profile-link-website',
  },
  linkBluesky: {
    editSelector: '#edit-profile-link-bluesky-input',
    verifySelector: '#profile-link-bluesky',
  },
};

// use on edit profile page
export const addLinks = (links: { label: string; url: string }[]) => {
  links.forEach((link) => {
    cy.get('#edit-profile-add-link-btn').click();
    cy.get('#add-profile-link-header').should('be.visible');
    cy.get('#add-profile-link-label-input').type(link.label);
    cy.get('#add-profile-link-url-input').type(link.url);
    cy.get('#add-profile-link-submit-btn').click();
    cy.get(`#edit-profile-link-${link.label.toLowerCase()}-input`).should('be.visible');
  });
}

// use on edit profile page
// todo: add support for profile picture upload
export const editProfileAndVerify = (profileData: Partial<Record<keyof typeof profileFields, string>>) => {
  // Perform the edit on each field in profileData
  Object.entries(profileData).forEach(([field, value]) => {
    const { editSelector } = profileFields[field];
    cy.get(editSelector).clear()
    cy.get(editSelector).type(value);
  });

  // Save the changes
  cy.get('#edit-profile-save-btn').click();

  // Verify redirection to the profile page
  cy.location('pathname').should('eq', '/profile');

  // TODO: remove workaround for slow profile edit and required manual refresh https://github.com/pubky/pubky-app/issues/493
  // Wait and reload the page to ensure changes are persisted
  cy.waitReload(Cypress.env('ci') ? 5000 : 2000);

  // Verify the changes for each field in profileData
  Object.entries(profileData).forEach(([field, value]) => {
    const { verifySelector } = profileFields[field];
    // if value begins with 'http://' or 'https://' remove it
    const valueWithoutHttp = value.replace(/^https?:\/\//, '');

    // This approach fails for bio due to additional space inserted before final word.
    // cy.get(verifySelector).should('have.text', value);

    // This is the equivalent of Selenium's getText() method, which returns the innerText of a visible element.
    cy.get(verifySelector).should(($elem) => {
      expect($elem.get(0).innerText).to.eq(valueWithoutHttp)
    })
  });
};

export const clickFollowButton = () => {
  cy.get('#profile-follow-btn').click();

  // Check follow button is now unfollow
  cy.get('#profile-follow-btn').should('not.exist');
  cy.get('#profile-unfollow-btn').should('be.visible').and('have.text', 'Unfollow');
};

// wait for notifications to load profile names (prevents 'no longer attached to the DOM' error when checking list of notifications)
export const waitForNotificationsToLoad = (attempts: number = 5) => {
  if (attempts <= 0) assert(false, `waitForNotificationsToLoad: Notifications not loaded`);

  cy.get('#profile-tab-content > div').then(($notificationsList) => {
    cy.wrap($notificationsList).invoke('text').then((text) => {
      // if contains 'pk:' then pubky is being used whilst waiting for profile name
      if (text.includes('No notifications yet') || text.includes('Loading') || text.includes('pk:')) {
        cy.wait(1000);
        waitForNotificationsToLoad(attempts - 1);
      }
    });
  });
};

export const checkLatestNotification = (expectedContent: string[], profileToNavigateTo?: string) => {
  waitForNotificationsToLoad();
  cy.get('#profile-tab-content > div').children().should('have.length.at.least', 1).first().within(() => {
    // assert that each expected string is present in the first notification listed
    expectedContent.forEach((content) => {
      cy.contains(content);
    });
    // if profile name is provided, navigate to it in the notification
    if (profileToNavigateTo) cy.get('a').contains(profileToNavigateTo).click();
  });
};