import { createDataTestSelector } from '../utils/createDataTestSelector';
import { getBalances } from '../utils/getBalance';
import { initNetworks } from '../utils/initNetworks'
import { findTokenToSwapTo } from '../utils/networks';

function switchNetwork() {
  cy.wait(1000)
  cy.get('body').then($body => {
    if ($body.find('button:contains("Connect to")').length) {
      cy.get('button:contains("Connect to")').click().allowMetamaskToSwitchNetwork()
    } else if ($body.find('button:contains("Confirm transaction")').is(':disabled')) {
      cy.wait(1000)
      return
    }
  })
}

function actionButton() {
  cy.get('body').then($body => {
    if ($body.find('button:contains("Please wait")').length) {
      cy.wait(1000)
      actionButton()
    } else if ($body.find('button:contains("Confirm transaction")').length) {
      cy.get('button:contains("Confirm transaction")').click()
      cy.wait(5000)
      cy.get('body').then(_$body => {
        if (_$body.find('h1:contains("Oops! Unable to submit your Order")').length) {
          swap()
        } else {
          cy.confirmMetamaskTransaction()
        }
      })
    }
  })
}

describe('Swap tokens', () => {
  before(() => {
    initNetworks();
    cy.visit("/");
    cy.get('button').contains('Confirm').click();
  });

  it('should connect wallet', () => {
    cy.get(createDataTestSelector("ui-connect-wallet")).click();
    cy.get(createDataTestSelector("rk-wallet-option-io.metamask")).click();
    cy.acceptMetamaskAccess();
  });

  it('Swaps continuously', () => {
    swap()
  });
});

function swap() {
  cy.visit('/')


  cy.wrap(getBalances())
    .then(balances => {
      const highestBalance = balances.reduce((max, balance) => balance.balance > max.balance ? balance : max, { name: '', balance: 0 });
      return cy.getCurrentNetwork().then(currentNetwork => {
        const currentTokeBalance = balances.find(balance => balance.name === currentNetwork?.name)
        console.log({currentTokeBalance})
        const token = currentTokeBalance.balance < 0.1 ? highestBalance : currentTokeBalance

        if (token.balance < 0.1) {
          cy.wait(30000)
          return swap()
        }
        const { name } = token

        if (!name) {
          throw 'Cannot get token name';
        }

        cy.get(createDataTestSelector('ui-select-network-and-asset')).eq(0).find('span.text-center').then((el) => {
          // Do nothing if already selected
          if (el.length > 0 && el.text() === name) {
            return;
          } else {
            cy.get(createDataTestSelector('ui-select-network-and-asset')).eq(0).click();
            cy.get(createDataTestSelector('ui-select-network')).contains(name).should('be.visible').click()
            cy.get(createDataTestSelector('ui-select-network-and-asset')).eq(0).find('span.text-center').should('have.text', name);
          }
          return;
        });

        switchNetwork()
        const tokenToSwapTo = findTokenToSwapTo(name);
        if (!tokenToSwapTo) {
          throw 'Cannot find token to swap to';
        }

        cy.get(createDataTestSelector('ui-select-network-and-asset')).eq(2).find('span.text-center').then((el) => {
          // Do nothing if already selected
          if (el.length > 0 && el.text() === name) {
            return;
          } else {
            cy.get(createDataTestSelector('ui-select-network-and-asset')).eq(2).click();
            cy.get(createDataTestSelector('ui-select-network')).contains(tokenToSwapTo).click();
            cy.get(createDataTestSelector('ui-select-network-and-asset')).eq(2).find('span.text-center').should('have.text', tokenToSwapTo);
          }
          return;
        });

        cy.get(createDataTestSelector('ui-max-reward-input')).then($input => {
          const value = $input.val();
          if (value !== '0.1') {
            cy.wait(1000);
            cy.wrap($input).type('0.1');
          }
        });
        cy.get(createDataTestSelector('ui-max-reward-input')).should('have.value', '0.1');

        actionButton()
      })

    })

  cy.contains('p', 'Your order has been submitted successfully and is now being processed.', { timeout: 30000 })
    .should('be.visible').then(() => {
      swap();
    });

  cy.contains('h1', 'Unable to submit your Order', { timeout: 10000 })
    .should('be.visible').then(() => {
      swap();
    });
}
