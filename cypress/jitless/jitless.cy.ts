describe('JIT and WASM disabled scenarios', () => {
  it('should display useful message when JIT and WASM are disabled', () => {
    // For this test, we need to run with JIT and WASM disabled
    // This is done by using cypress.config.jitless.ts which has specific browser arguments:
    // Chrome: --js-flags=--jitless,--no-expose-wasm
    // Firefox: javascript.options.baselinejit=false, javascript.options.ion=false, javascript.options.wasm=false

    // visit onboarding page
    cy.visit('/');

    // check that useful message is displayed informing user to enable JIT and WASM
    cy.get('body')
      .should('contain.text', 'Something went wrong')
      .should('contain.text', 'WebAssembly is not defined')
      .should('contain.text', 'ensure that Just-In-Time (JIT) compilation is enabled');
  });
});
