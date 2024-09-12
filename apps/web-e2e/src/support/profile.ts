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

  // Reload the page to ensure changes are persisted
  cy.reload();

  // Verify the changes for each field in profileData
  Object.entries(profileData).forEach(([field, value]) => {
    const { verifySelector } = profileFields[field];

    // This approach fails for bio due to additional space inserted before final word.
    // cy.get(verifySelector).should('have.text', value);

    // This is the equivalent of Selenium's getText() method, which returns the innerText of a visible element.
    cy.get(verifySelector).should(($elem) => {
      expect($elem.get(0).innerText).to.eq(value)
    })
  });
};
