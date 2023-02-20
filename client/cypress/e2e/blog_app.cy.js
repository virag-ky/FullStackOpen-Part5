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
});
