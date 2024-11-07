import { slowCypressDown } from 'cypress-slow-down';

describe('settings', () => {
  before(() => {
    slowCypressDown();
  });

  beforeEach(() => {
    cy.onboardAsNewUser('Mr Settings', 'I like to change settings');
  });

  it.skip('Account settings is displayed correctly', () => {

  });

  it.skip('Account settings: can back up account', () => {

  });

  it.skip('Account settings: can delete account', () => {

  });

  it.skip('Account settings: can edit profile', () => {

  });

  it.skip('Account settings: can download your data', () => {

  });

  it.skip('Notifications settings is displayed correctly', () => {

  });

  // TODO: add Notifications tests in a separate file

  it.skip('Privacy and Safety settings is displayed correctly', () => {

  });

  // TODO: add Privacy and Safety tests in a separate file

  it.skip('Muted users settings displays muted users', () => {

  });

  it.skip('Language settings:new language can be selected', () => {

  });

  it.skip('Help: FAQ is displayed correctly', () => {

  });

  it.skip('Help: User Guide can be navigated to', () => {

  });

  it.skip('Help: Support link can be used', () => {

  });

});
