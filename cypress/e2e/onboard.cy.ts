import * as path from 'path';
import { defaultBackupFilename } from '../support/auth';
import { slowCypressDown } from 'cypress-slow-down';
import { HasBackedUp, SkipOnboardingSlides } from '../support/types/enums';

describe('onboarding', () => {
  before(() => {
    slowCypressDown();
  });

  beforeEach(() => {
    cy.deleteDownloadsFolder();
  });

  it('can onboard as a new user, viewing onboarding slides, go to home and logout', () => {
    // onboard as new user without skipping onboarding slides
    cy.onboardAsNewUser('Satoshi Nakamoto', 'I am cypherpunk', SkipOnboardingSlides.No);
    cy.signOut(HasBackedUp.No);
  });

  it('should login, skipping onboarding slides, save recovery file and use it to log back in', () => {
    const username = 'satoshin';
    cy.onboardAsNewUser(username);
    cy.backupRecoveryFile('666942');

    // verify backup file
    const downloadsFolder = Cypress.config('downloadsFolder');
    const expectedFilePath = path.join(downloadsFolder, defaultBackupFilename());
    cy.readFile(expectedFilePath).should('exist');

    cy.signOut(HasBackedUp.Yes);
    cy.signIn(expectedFilePath, '666942');

    cy.get('#header-profile-pic').click();
    cy.location('pathname').should('eq', '/profile');
    cy.get('#profile-username-header').invoke('text').should('eq', username);
  });

  // the 'Explore Pubky' button got removed in https://github.com/pubky/pubky-app/commit/3ccd24b2201b1d4129decf8f06ae9e457cf36bf1
  it.skip('should allow anonymous mode without creating a profile', () => {
    cy.visit('/');
    cy.location('pathname').should('eq', '/onboarding');

    // click 'Explore Pubky' button
    cy.get('#onboarding-explore-pubky-btn').click();
    cy.location('pathname').should('eq', '/home');

    // check there is no backup reminder on feed page
    cy.get('body').should('not.contain.text', 'Backup');
    cy.get('body').should('not.contain.text', 'Back up');

    // check profile name is 'anonymous'
    cy.get('#quick-post-create-content').innerTextShouldContain('anonymous');
    cy.get('#header-profile-pic').click();
    cy.get('#profile-username-header').should('have.text', 'anonymous');
  });

  // test that invalid invite code is rejected
  it('should reject invalid invite code', () => {
    cy.visit('/');

    cy.location('pathname').should('eq', '/onboarding');

    cy.get('#onboarding-create-account-btn').click();
    cy.location('pathname').should('eq', '/onboarding/intro');

    cy.get('#onboarding-skip-intro-btn').click();

    cy.get('#onboarding-sign-up-link').click();
    cy.location('pathname').should('eq', '/onboarding/sign-up');

    // test that a code with less than 14 characters is rejected
    cy.get('#onboarding-name-input').type('invalid invite code');
    cy.get('#onboarding-token-input').type('invalidcode');
    cy.get('#onboarding-submit-button').click();
    cy.get('#onboarding-token-input-error').should('contain.text', 'must be 14 characters');

    // test that a wrong code is rejected
    cy.get('#onboarding-token-input').type('invalidcode123');
    cy.get('#onboarding-submit-button').click();
    cy.get('#onboarding-token-input-error').should('contain.text', 'Invalid');
  });
});
