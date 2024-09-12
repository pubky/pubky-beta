import { editProfileAndVerify, addLinks } from '../support/profile';
import { slowCypressDown } from 'cypress-slow-down';

describe('profile', () => {
  before(() => {
    slowCypressDown();
  });

  beforeEach(() => {
    cy.onboardAsNewUser('Edit Me', 'This bio is editable');
  });

  it('editing should retain any changes made to own profile', () => {
    // todo: add test profile picture upload

    // navigate to edit profile page
    cy.get('#header-profile-pic').click();
    cy.get('#profile-edit-btn').click();

    // edit username and bio and verify changes are persisted
    editProfileAndVerify({ name: 'Edited Name', bio: 'This bio has been edited.' });

    // re-open edit page and add two new links to the profile
    cy.get('#profile-edit-btn').click();
    addLinks([
      { label: 'Bluesky', url: 'https://bsky.app/profile/bsky.app' },
      { label: 'Github', url: 'https://github.com/synonymdev/bitkit'}
    ]);

    // check the new links are shown with correct values
    cy.get('#edit-profile-link-bluesky-input').should('be.visible')
      .and('have.value', 'https://bsky.app/profile/bsky.app');
    cy.get('#edit-profile-link-github-input').should('be.visible')
      .and('have.value', 'https://github.com/synonymdev/bitkit');

    // check the 'website' and 'email' example links are still shown
    cy.get('#edit-profile-link-website-input').should('be.visible');
    cy.get('#edit-profile-link-email-input').should('be.visible');

    // edit bio again, edit the Bluesky link and verify changes are persisted
    editProfileAndVerify({ bio: 'This bio has been edited again!', linkBluesky: 'https://bsky.app/profile/pubky.app' });

    // re-open edit page and check that default link types are not shown, only the new ones
    cy.get('#profile-edit-btn').click();
    cy.get('#edit-profile-link-website-input').should('not.exist');
    cy.get('#edit-profile-link-email-input').should('not.exist');
    cy.get('#edit-profile-link-bluesky-input').should('be.visible');
    cy.get('#edit-profile-link-github-input').should('be.visible');
  });

  it('cancelling edit should not retain any changes made to own profile', () => {
    // navigate to edit profile page
    cy.get('#header-profile-pic').click();
    cy.get('#profile-edit-btn').click();

    // change name and bio
    cy.get('#edit-profile-name-input').clear()
    cy.get('#edit-profile-name-input').type('Name Not Changed');
    cy.get('#edit-profile-bio-input').clear()
    cy.get('#edit-profile-bio-input').type('Bio Not Changed');

    // Cancel the changes
    cy.get('#edit-profile-cancel-btn').click();

    // Verify redirection to the profile page
    cy.location('pathname').should('eq', '/profile');

    // Reload the page to ensure changes are not persisted
    cy.reload();
    cy.get('#profile-username-header').invoke('text').should('eq', 'Edit Me');
    // This approach is necessary for bio due to additional space inserted before final word.
    cy.get('#profile-bio-content').should(($elem) => {
      expect($elem.get(0).innerText).to.eq('This bio is editable')
    })
  });
});
