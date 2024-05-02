describe('onboarding', () => {
  beforeEach(() => {
    cy.viewport(1920, 1080);
  });

  it('should onboard a new user, go to home and logout', () => {
    cy.visit('/onboarding');

    cy.get('#onboarding-sign-in-link').click();
    cy.location('pathname').should('eq', '/onboarding/sign-in');

    cy.get('#onboarding-sign-up-link').click();
    cy.location('pathname').should('eq', '/onboarding/sign-up');

    cy.get('#onboarding-name-input').type('Satoshi Nakamoto');
    cy.get('#onboarding-recovery-password-input').type('password');

    cy.get('#onboarding-submit-button').click();
    cy.location('pathname').should('eq', '/onboarding/confirm');

    cy.get('#onboarding-start-button').click();
    cy.location('pathname').should('eq', '/home');

    cy.visit('/logout');
    cy.location('pathname').should('eq', '/logout');

    cy.get('#logout-link').click();
    cy.location('pathname').should('eq', '/onboarding/sign-in');
  });

  it('should login with a recovery file and logout', () => {
    cy.visit('/onboarding');

    cy.get('#onboarding-sign-in-link').click();
    cy.location('pathname').should('eq', '/onboarding/sign-in');

    cy.get('#onboarding-password-input').type('password');
    cy.get('#file_input').selectFile(
      'cypress/downloads/recovery_file_2024-05-01.pkarr'
    );

    cy.get('#onboarding-sign-in-button').click();
    cy.location('pathname').should('eq', '/onboarding/permissions');

    cy.get('#onboarding-permissions-link').click();
    cy.location('pathname').should('eq', '/onboarding/welcome');

    cy.get('#onboarding-welcome-link').click();
    cy.location('pathname').should('eq', '/home');

    cy.visit('/logout');
    cy.location('pathname').should('eq', '/logout');

    cy.get('#logout-link').click();
    cy.location('pathname').should('eq', '/onboarding/sign-in');
  });
});
