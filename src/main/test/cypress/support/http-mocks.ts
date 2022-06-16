import faker from 'faker'

export const mockInvalidCredentialsError = (url: RegExp): void => {
  cy.server()
  cy.route({
    method: 'POST',
    url,
    status: 401,
    response: {
      error: faker.random.words(),
    },
  }).as('request')
}

export const mockEmailInUseError = (url: RegExp): void => {
  cy.server()
  cy.route({
    method: 'POST',
    url,
    status: 403,
    response: {
      error: faker.random.words(),
    },
  }).as('request')
}

export const mockUnexpectedError = (url: RegExp, method: string): void => {
  cy.server()
  cy.route({
    method,
    url,
    status: faker.helpers.randomize([400, 404, 500]),
    response: {
      error: faker.random.words(),
    },
  }).as('request')
}

export const mockSuccess = (
  url: RegExp,
  method: string,
  response: any
): void => {
  cy.server()
  cy.route({
    method,
    url,
    status: 200,
    response,
  }).as('request')
}

export const testUrl = (path: string): void => {
  const baseUrl: string = Cypress.config().baseUrl
  cy.url().should('eq', `${baseUrl}${path}`)
}

export const testLocalStorageItem = (key: string): void => {
  cy.window().then((window) => assert.isOk(window.localStorage.getItem(key)))
}
