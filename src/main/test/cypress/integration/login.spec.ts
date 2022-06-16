import faker from 'faker'

const baseUrl: string = Cypress.config().baseUrl

describe('Login', () => {
  beforeEach(() => {
    cy.server()
    cy.visit('login')
  })

  it('Should load with correct initial state', () => {
    cy.getByTestId('email-wrap').should('have.attr', 'data-status', 'invalid')
    cy.getByTestId('email')
      .should('have.attr', 'title', 'Campo obrigatório')
      .should('have.attr', 'readonly')
    cy.getByTestId('email-label').should(
      'have.attr',
      'title',
      'Campo obrigatório'
    )
    cy.getByTestId('password-wrap').should(
      'have.attr',
      'data-status',
      'invalid'
    )
    cy.getByTestId('password')
      .should('have.attr', 'title', 'Campo obrigatório')
      .should('have.attr', 'readonly')
    cy.getByTestId('password-label').should(
      'have.attr',
      'title',
      'Campo obrigatório'
    )
    cy.getByTestId('submit').should('have.attr', 'disabled')
    cy.getByTestId('error-wrap').should('not.have.descendants')
  })

  it('Should present error state if form is invalid', () => {
    cy.getByTestId('email')
      .focus()
      .type(faker.random.word())
      .should('have.attr', 'title', 'O campo email é inválido')
    cy.getByTestId('email-wrap').should('have.attr', 'data-status', 'invalid')
    cy.getByTestId('email-label').should(
      'have.attr',
      'title',
      'O campo email é inválido'
    )
    cy.getByTestId('password')
      .focus()
      .type(faker.random.alphaNumeric(3))
      .should('have.attr', 'title', 'O campo password é inválido')
    cy.getByTestId('password-wrap').should(
      'have.attr',
      'data-status',
      'invalid'
    )
    cy.getByTestId('password-label').should(
      'have.attr',
      'title',
      'O campo password é inválido'
    )
    cy.getByTestId('submit').should('have.attr', 'disabled')
    cy.getByTestId('error-wrap').should('not.have.descendants')
  })

  it('Should present valid state if form is valid', () => {
    cy.getByTestId('email')
      .focus()
      .type(faker.internet.email())
      .should('not.have.attr', 'title')
    cy.getByTestId('email-wrap').should('have.attr', 'data-status', 'valid')
    cy.getByTestId('email-label').should('not.have.attr', 'title')

    cy.getByTestId('password')
      .focus()
      .type(faker.internet.password())
      .should('not.have.attr', 'title')
    cy.getByTestId('password-wrap').should('have.attr', 'data-status', 'valid')
    cy.getByTestId('password-label').should('not.have.attr', 'title')

    cy.getByTestId('submit').should('not.have.attr', 'disabled')

    cy.getByTestId('error-wrap').should('not.have.descendants')
  })

  it('Should present error if invalid credentials are provided', () => {
    cy.route({
      method: 'POST',
      url: /login/,
      status: 401,
      response: {
        error: faker.random.words(),
      },
    })
    cy.getByTestId('email').focus().type(faker.internet.email())
    cy.getByTestId('password').focus().type(faker.random.alphaNumeric(5))
    cy.getByTestId('submit').click()
    cy.getByTestId('error-wrap')
      .getByTestId('spinner')
      .should('not.exist')
      .getByTestId('main-error')
      .should('contain.text', 'Credenciais inválidas')

    cy.url().should('eq', `${baseUrl}/login`)
  })

  it('Should present error on UnexpectedError', () => {
    cy.route({
      method: 'POST',
      url: /login/,
      status: faker.helpers.randomize([400, 404, 500]),
      response: {
        error: faker.random.words(),
      },
    })
    cy.getByTestId('email').focus().type(faker.internet.email())
    cy.getByTestId('password').focus().type(faker.random.alphaNumeric(5))
    cy.getByTestId('submit').click()
    cy.getByTestId('error-wrap')
      .getByTestId('spinner')
      .should('not.exist')
      .getByTestId('main-error')
      .should('contain.text', 'Algo de errado aconteceu. Tente novamente!')

    cy.url().should('eq', `${baseUrl}/login`)
  })

  it('Should present UnexpectedError if invalid date is returned', () => {
    cy.route({
      method: 'POST',
      url: /login/,
      status: 200,
      response: {
        [faker.random.word()]: faker.random.uuid(),
      },
    })

    cy.getByTestId('email').focus().type('matheusinfo@github.com')
    cy.getByTestId('password').focus().type('12345')
    cy.getByTestId('submit').click()
    cy.getByTestId('error-wrap')
      .getByTestId('spinner')
      .should('not.exist')
      .getByTestId('main-error')
      .should('contain.text', 'Algo de errado aconteceu. Tente novamente!')
  })

  it('Should present save accessToken if valid credentiasl are provided', () => {
    cy.route({
      method: 'POST',
      url: /login/,
      status: 200,
      response: {
        accessToken: faker.random.uuid(),
      },
    })

    cy.getByTestId('email').focus().type('matheusinfo@github.com')
    cy.getByTestId('password').focus().type('12345').type('{enter}')
    cy.getByTestId('error-wrap').should('not.exist')

    cy.url().should('eq', `${baseUrl}/`)
    cy.window().then((window) =>
      assert.isOk(window.localStorage.getItem('accessToken'))
    )
  })

  it('Should prevent multiple submits', () => {
    cy.route({
      method: 'POST',
      url: /login/,
      status: 200,
      response: {
        accessToken: faker.random.uuid(),
      },
    }).as('request')

    cy.getByTestId('email').focus().type('matheusinfo@github.com')
    cy.getByTestId('password').focus().type('12345')
    cy.getByTestId('submit').dblclick()
    cy.get('@request.all').should('have.length', 1)
  })

  it('Should submit with invalid form', () => {
    cy.route({
      method: 'POST',
      url: /login/,
      status: 200,
      response: {
        accessToken: faker.random.uuid(),
      },
    }).as('request')

    cy.getByTestId('email')
      .focus()
      .type('matheusinfo@github.com')
      .type('{enter}')
    cy.get('@request.all').should('have.length', 0)
  })
})
