import { clickFollowButton } from './profile';

export const searchForProfileByPubky = (pubky: string, profileName: string) => {
  // type pubkyinto search bar and press enter
  cy.get('#header-search-input').type(`${pubky}{enter}`);

  // check that profile page is displayed
  cy.get('#profile-username-header').should('have.text', profileName);
};

export const searchForProfileByName = (profileName: string) => {
  // type profile name into  search bar
  cy.get('#header-search-input').type(`${profileName}`);

  // click on profile found in search results
  cy.get('#user-0').should('be.visible').click();

  // check that profile page is displayed
  cy.get('#profile-username-header').should('have.text', profileName);
};

export const searchAndFollowProfile = (pubky: string, profileName: string) => {
  // search for profile
  searchForProfileByPubky(pubky, profileName);

  // Check follow button is displayed for account 1
  cy.get('#profile-follow-btn').should('be.visible').and('have.text', 'Follow');

  // follow profile
  clickFollowButton();
};
