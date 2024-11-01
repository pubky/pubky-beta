import { editProfileAndVerify, addLinks } from '../support/profile';
import { slowCypressDown } from 'cypress-slow-down';

describe('settings', () => {
  before(() => {
    slowCypressDown();
  });

  beforeEach(() => {
    cy.onboardAsNewUser('Mr Settings', 'I like to change settings');
  });

  it('Account settings is displayed correctly', () => {

  });

  it('Account settings: can back up account', () => {

  });

  it('Account settings: can delete account', () => {

  });

  it('Account settings: can edit profile', () => {

  });

  it('Account settings: can download your data', () => {

  });

  it('Notifications settings is displayed correctly', () => {

  });

  // TODO: add Notifications tests in a separate file

  it('Privacy and Safety settings is displayed correctly', () => {

  });

  // TODO: add Privacy and Safety tests in a separate file

  it('Muted users settings displays muted users', () => {

  });

  it('Language settings:new language can be selected', () => {

  });

  it('Help: FAQ is displayed correctly', () => {

  });

  it('Help: User Guide can be navigated to', () => {

  });

  it('Help: Support link can be used', () => {

  });

});
