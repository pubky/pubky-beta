import { clickFollowButton } from "./profile";

export const searchAndFollowProfile = (pubky: string, profileName: string) => {
  // type pubky for account 1 into search bar and press enter
  cy.get('#header-search-input').type(`${pubky}{enter}`);

  // check that account 1 profile page is displayed
  cy.get('#profile-username-header').should('have.text', profileName);

  // Check follow button is displayed for account 1
  cy.get('#profile-follow-btn').should('be.visible').and('have.text', 'Follow');

  // Follow account 1
  clickFollowButton();
};