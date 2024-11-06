import "./commands";
import "@synthetixio/synpress/support";

before(() => {
    // cy.setupMetamask(Cypress.env())
    console.log()

    cy.setupMetamask(Cypress.env('SECRET_WORDS'), Cypress.env('NETWORK_NAME'), Cypress.env('PASSWORD'), true)
})

Cypress.on('fail', (error, runnable) => {
    // Log the error (optional)
    console.error('Test failed:', error);
  
    // Restart the test by re-running the runnable (the entire test)
    return cy.reload().then(() => {
      runnable.fn();
    });
  });