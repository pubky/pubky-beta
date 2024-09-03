import { backupDownloadFilePath } from '../support/auth';
import { savePubkyToAlias } from '../support/profile';
import { slowCypressDown } from 'cypress-slow-down';

describe('contacts', () => {
  before(() => {
    slowCypressDown(200);
    cy.deleteDownloadsFolder();

    // Grant clipboard permissions (requires browser to be in focus)
    Cypress.automation('remote:debugger:protocol', {
      command: 'Browser.grantPermissions',
      params: {
        permissions: ['clipboardReadWrite', 'clipboardSanitizedWrite'],
        origin: window.location.origin,
      },
    })
  });

  it('editing should retain any changes made to own profile', () => {
    // Create account 1
    cy.onboardAsNewUser('#1 Friend', "Man's best friend");

    // Backup
    cy.backupRecoveryFile();
    cy.renameFile(backupDownloadFilePath(), backupDownloadFilePath('pubky1.pkarr'));

    // Copy and store pubky for account 1
    cy.get('#header-profile-pic').click();
    cy.get('#profile-copy-pubkey-btn').click();
    // todo: move to helper module
    cy.window().then((win) => {
      return win.navigator.clipboard.readText().then((text) => {
        // assert that pubky was copied to clipboard in correct format
        expect(text).to.match(/^pk:/);
        return text;
        // store pubky for later use
      });
    }).then((text) => {
      cy.wrap(text).as('pubky1');
    });
    
    // IT WORKS!
    cy.get('@pubky1').then((ss) => {
      cy.log(`pubky1: ${ss}`);
    });
    cy.pause();

    // Sign out of account 1
    cy.signOut(true);

    // Create account 2
    cy.onboardAsNewUser('#2 Friend', "Man's second best friend");

    // Backup
    cy.backupRecoveryFile();
    cy.renameFile(backupDownloadFilePath(), backupDownloadFilePath('pubky2.pkarr'));

    // Copy and store pubky for account 2
    cy.get('#header-profile-pic').click();
    cy.get('#profile-copy-pubkey-btn').click();
    savePubkyToAlias('pubky2');
  
    //const pub1 = this.pubky1[0];

    //cy.log(`pubky2: ${this.pubky2}`);
    
    // Add account 1 as friend
    // Check profile for following
    // Sign out

    // Sign in account 1
    // Check profile for follower
    // Follow account 2
    // Check profile for following and follower
    // Sign out

    // Sign in account 2
    // Check profile for following, follower and friend
  });
});
