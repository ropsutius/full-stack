const baseUrl = 'http://localhost:3003/api/';
const frontEnd = 'http://localhost:3000/';

Cypress.Commands.add('login', ({ username, password }) => {
  cy.request('POST', `${baseUrl}login`, {
    username,
    password,
  }).then(({ body }) => {
    localStorage.setItem('bloggingServiceUser', JSON.stringify(body));
    cy.visit(frontEnd);
  });
});

Cypress.Commands.add('postBlog', ({ title, author, url, likes }) => {
  cy.request({
    method: 'POST',
    url: `${baseUrl}blogs`,
    headers: {
      Authorization: `bearer ${
        JSON.parse(localStorage.getItem('bloggingServiceUser')).token
      }`,
    },
    body: { title, author, url, likes },
  }).then(() => {
    cy.visit(frontEnd);
  });
});

describe('Blog app', function () {
  beforeEach(function () {
    cy.request('POST', `${baseUrl}testing/reset`);
    cy.request('POST', `${baseUrl}users`, {
      username: 'test',
      name: 'test',
      password: '1234',
    });
    cy.visit(frontEnd);
  });

  it('Login button is shown first on screen and clicking it reveals the login form', function () {
    cy.contains('Blogging Service');
    cy.contains('login').click();
    cy.contains('log in to service');
    cy.contains('username');
    cy.contains('password');
  });

  describe('Login', function () {
    it('Successful login attempt', function () {
      cy.contains('login').click();
      cy.get('#username').type('test');
      cy.get('#password').type('1234');
      cy.get('#login-button').click();

      cy.contains('test logged in');
    });

    it('Unsuccessful login attempt', function () {
      cy.contains('login').click();
      cy.get('#username').type('wrong');
      cy.get('#password').type('creds');
      cy.get('#login-button').click();

      cy.contains('Incorrect username or password');
    });
  });

  describe('When logged in', function () {
    beforeEach(function () {
      cy.login({ username: 'test', password: '1234' });
    });

    it('Create a new blog', function () {
      cy.contains('new note').click();
      cy.get('#title').type('New Title');
      cy.get('#author').type('New Author');
      cy.get('#url').type('www.url.com');

      cy.get('#add-blog').click();
      cy.contains('Blog, titled: New Title was added');
      cy.contains('New Title New Author');
    });

    describe('When logged in with a post', function () {
      beforeEach(function () {
        cy.postBlog({
          title: 'New Title',
          author: 'New Author',
          url: 'www.url.com',
        });
      });

      it('Like a blog', function () {
        cy.contains('view').click();
        cy.contains('likes 0');
        cy.contains('like').click();
        cy.contains('likes 1');
      });

      it('Delete a blog', function () {
        cy.contains('view').click();
        cy.contains('remove').click();
        cy.contains('New Title').should('not.exist');
      });
    });

    describe('When logged in with multiple posts', function () {
      beforeEach(function () {
        for (let i = 0; i < 10; i++) {
          cy.postBlog({
            title: 'New Title',
            author: 'New Author',
            url: 'www.url.com',
            likes: i,
          });
        }
      });

      it('Blogs are in correct order with the most liked blog at the top', function () {
        for (let i = 0; i < 10; i++) {
          cy.contains('view').click();
          cy.get('.likes')
            .eq(i)
            .should('contain', 9 - i);
        }
      });
    });
  });
});
