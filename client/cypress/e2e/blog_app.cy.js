describe('Blog app', function () {
  beforeEach(function () {
    cy.visit('');
    cy.request('POST', `${Cypress.env('BACKEND')}/testing/reset`);
    const user = {
      name: 'bobby',
      username: 'bobby',
      password: 'abc',
    };
    cy.request('POST', `${Cypress.env('BACKEND')}/users/`, user);
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

  it('login fails with wrong password', function () {
    cy.contains('Login').click();
    cy.get('#username').type('bobby');
    cy.get('#password').type('123');
    cy.get('#login').click();

    cy.get('#notification')
      .should('have.css', 'color', 'rgb(255, 0, 0)')
      .and('have.css', 'border', '3px solid rgb(255, 0, 0)')
      .and('contain', 'Wrong username or password');

    cy.get('html').should('not.contain', 'bobby logged in');

    //cy.contains('bobby logged in').should('not.exist')
  });

  describe('when logged in', function () {
    beforeEach(function () {
      cy.login({ username: 'bobby', password: 'abc' });
    });

    it("a new blog can be created when there's no other blogs yet", function () {
      cy.contains('New Blog').click();
      cy.get('#title').type('new blog created with Cypress');
      cy.get('#author').type('Jane Doe');
      cy.get('#url').type('www.example.com');
      cy.get('#create').click();
      cy.contains('new blog created with Cypress by Jane Doe');
    });

    describe('several blogs exist', function () {
      beforeEach(function () {
        cy.createBlog({ title: 'mmm', author: 'john', url: 'www' });
        cy.createBlog({ title: 'aaa', author: 'john', url: 'www' });
        cy.createBlog({ title: 'eee', author: 'john', url: 'www' });
      });

      it('a new blog can be created when there are other blogs as well', function () {
        cy.contains('New Blog').click();
        cy.get('#title').type('new blog created with Cypress');
        cy.get('#author').type('Jane Doe');
        cy.get('#url').type('www.example.com');
        cy.get('#create').click();
        cy.contains('new blog created with Cypress by Jane Doe');
      });

      it('can add likes', function () {
        cy.contains('mmm by john');
      });
    });
  });
});
