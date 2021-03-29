describe("Homepage", () => {
  it("successfully loads", () => {
    cy.visit("http://localhost:3001/");
  });
});

describe("Sending a message", () => {
  let data;

  before(() => {
    cy.visit("http://localhost:3001/");
    cy.fixture('messages.json').then(response => {
        data = response;
    });
  });

  it("shows up", () => {
    cy.sendMessage(data.message);
    cy.get(".message").last().should("contain", data.message);
  });

  it("receives a reply", () => {
    cy.wait(10000);
    cy.get(".bot-message").last().should("contain", data.response);
  });
});

describe("Searching a message", function () {
    let data;

    before(() => {
        cy.visit("http://localhost:3001/");
        cy.fixture('messages.json').then(response => {
            data = response;
            cy.sendMessage(data.message);
        });
    });

    it("can search a message", () => {
        cy.get("#search").click().type(data.message);
        cy.get(".message").last().should("contain", data.message);
    })
})