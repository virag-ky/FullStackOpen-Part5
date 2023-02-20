describe('Blog app', function () {
  beforeEach(function () {
    cy.request('POST', 'http://localhost:3003/api/testing/reset');
    const user = {
      name: 'bobby',
      username: 'bobby',
      password: 'abc',
    };
    cy.request('POST', 'http://localhost:3003/api/users/', user);
    cy.visit('http://localhost:3000');
  });

  it('login form can be opened', function () {
    cy.contains('Login');
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
      cy.get('#create').click();
      cy.contains('new blog created with Cypress by Jane Doe');
    });
  });
});
