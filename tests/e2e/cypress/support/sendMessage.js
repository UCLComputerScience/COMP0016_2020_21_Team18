/* eslint-disable no-undef */

const sendMessage = (text) => {
  cy.get("#msg").type(text);
  cy.get(".send-button").children("button").click();
};

Cypress.Commands.add("sendMessage", (text) => {
  sendMessage(text);
});
