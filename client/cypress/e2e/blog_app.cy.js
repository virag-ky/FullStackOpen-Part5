describe('Blog app', function () {
  beforeEach(function () {
    cy.visit('http://localhost:3000');
  });

  it('front page can be opened', function () {
    cy.contains('maisy by dog');
  });

  it('login form can be opened', function () {
    cy.contains('Login').click();
  });

  it('user can login', function () {
    cy.contains('Login').click();
    cy.get('#username').type('bobby');
    cy.get('#password').type('abc');
    cy.get('#login').click();
    cy.contains('bobby logged in');
  });

  describe('when logged in', function () {
    beforeEach(function () {
      cy.contains('Login').click();
      cy.get('#username').type('bobby');
      cy.get('#password').type('abc');
      cy.get('#login').click();
    });

    it('a new blog can be created', function () {
      cy.contains('New Blog').click();
      cy.get('#title').type('new blog created with Cypress');
      cy.get('#author').type('Jane Doe');
      cy.get('#url').type('www.example.com');
      cy.contains('Create').click();
      cy.contains('new blog created with Cypress by Jane Doe');
    });
  });
});
