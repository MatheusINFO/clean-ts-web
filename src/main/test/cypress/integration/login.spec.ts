import faker from 'faker'
import {
  mockInvalidCredentialsError,
  mockInvalidData,
  mockSuccess,
  mockUnexpectedError,
} from '../support/login-mocks'
import {
  testHttpCallsCount,
  testInputStatus,
  testMainError,
} from '../support/form-helper'
import { testLocalStorageItem, testUrl } from '../support/http-mocks'

const simulateValidSubmit = (): void => {
  cy.getByTestId('email').focus().type(faker.internet.email())
  cy.getByTestId('password').focus().type(faker.random.alphaNumeric(5))
  cy.getByTestId('submit').click()
}

describe('Login', () => {
  beforeEach(() => {
    cy.visit('login')
  })

  it('Should load with correct initial state', () => {
    testInputStatus('email', 'Campo obrigatório')
    cy.getByTestId('email').should('have.attr', 'readOnly')

    testInputStatus('password', 'Campo obrigatório')
    cy.getByTestId('password').should('have.attr', 'readOnly')

    cy.getByTestId('submit').should('have.attr', 'disabled')
    cy.getByTestId('error-wrap').should('not.have.descendants')
  })

  it('Should present error state if form is invalid', () => {
    cy.getByTestId('email').focus().type(faker.random.word())
    testInputStatus('email', 'O campo email é inválido')

    cy.getByTestId('password').focus().type(faker.random.alphaNumeric(3))
    testInputStatus('password', 'O campo password é inválido')

    cy.getByTestId('submit').should('have.attr', 'disabled')
    cy.getByTestId('error-wrap').should('not.have.descendants')
  })

  it('Should present valid state if form is valid', () => {
    cy.getByTestId('email').focus().type(faker.internet.email())
    testInputStatus('email')

    cy.getByTestId('password').focus().type(faker.internet.password())
    testInputStatus('password')

    cy.getByTestId('submit').should('not.have.attr', 'disabled')
    cy.getByTestId('error-wrap').should('not.have.descendants')
  })

  it('Should present error if invalid credentials are provided', () => {
    mockInvalidCredentialsError()
    simulateValidSubmit()
    testMainError('Credenciais inválidas')
    testUrl('/login')
  })

  it('Should present error on UnexpectedError', () => {
    mockUnexpectedError()
    simulateValidSubmit()
    testMainError('Algo de errado aconteceu. Tente novamente!')
    testUrl('/login')
  })

  it('Should present UnexpectedError if invalid date is returned', () => {
    mockInvalidData()
    simulateValidSubmit()
    cy.getByTestId('error-wrap').should('not.have.descendants')
  })

  it('Should present save accessToken if valid credentiasl are provided', () => {
    mockSuccess()
    simulateValidSubmit()
    testUrl('/')
    testLocalStorageItem('accessToken')
  })

  it('Should prevent multiple submits', () => {
    mockSuccess()
    cy.getByTestId('email').focus().type('matheusinfo@github.com')
    cy.getByTestId('password').focus().type('12345')
    cy.getByTestId('submit').dblclick()
    testHttpCallsCount(1)
  })

  it('Should submit with invalid form', () => {
    mockSuccess()

    cy.getByTestId('email').focus().type(faker.internet.email()).type('{enter}')

    testHttpCallsCount(0)
  })
})
