import faker from 'faker'
import { testInputStatus, testMainError } from '../utils/form-helpers'
import {
  testLocalStorageItem,
  testUrl,
  testHttpCallsCount,
} from '../utils/helpers'
import * as Http from '../utils/http-mocks'

const path = /signup/

const mockEmailInUseError = (): void => Http.mockForbiddenError(path, 'POST')

const mockUnexpectedError = (): void => Http.mockServerError(path, 'POST')

const mockSuccess = (): void => {
  Http.mockSuccess(path, 'POST', 'fx:account')
}

const populateFields = (): void => {
  const password = faker.internet.password()

  cy.getByTestId('name').focus().type(faker.name.findName())
  cy.getByTestId('email').focus().type(faker.internet.email())
  cy.getByTestId('password').focus().type(password)
  cy.getByTestId('passwordConfirmation').focus().type(password)
}

const simulateValidSubmit = (): void => {
  populateFields()
  cy.getByTestId('submit').click()
}

describe('SignUp', () => {
  beforeEach(() => {
    cy.visit('signup')
  })

  it('Should load with correct initial state', () => {
    testInputStatus('name', 'Campo obrigatório')
    cy.getByTestId('name').should('have.attr', 'readOnly')

    testInputStatus('email', 'Campo obrigatório')
    cy.getByTestId('email').should('have.attr', 'readOnly')

    testInputStatus('password', 'Campo obrigatório')
    cy.getByTestId('password').should('have.attr', 'readOnly')

    testInputStatus('passwordConfirmation', 'Campo obrigatório')
    cy.getByTestId('passwordConfirmation').should('have.attr', 'readOnly')

    cy.getByTestId('submit').should('have.attr', 'disabled')
    cy.getByTestId('error-wrap').should('not.have.descendants')
  })

  it('Should reset state on page load', () => {
    cy.getByTestId('email').focus().type(faker.internet.email())
    testInputStatus('email')

    cy.getByTestId('login-link').click()
    cy.getByTestId('signup-link').click()

    testInputStatus('email', 'Campo obrigatório')
  })

  it('Should present error state if form is invalid', () => {
    cy.getByTestId('name').focus().type(faker.random.alphaNumeric(2))
    testInputStatus('name', 'O campo name é inválido')

    cy.getByTestId('email').focus().type(faker.random.word())
    testInputStatus('email', 'O campo email é inválido')

    cy.getByTestId('password').focus().type(faker.random.alphaNumeric(3))
    testInputStatus('password', 'O campo password é inválido')

    cy.getByTestId('passwordConfirmation')
      .focus()
      .type(faker.random.alphaNumeric(2))
    testInputStatus(
      'passwordConfirmation',
      'O campo passwordConfirmation é inválido'
    )

    cy.getByTestId('submit').should('have.attr', 'disabled')
    cy.getByTestId('error-wrap').should('not.have.descendants')
  })

  it('Should present valid state if form is valid', () => {
    const password = faker.internet.password()

    cy.getByTestId('name').focus().type(faker.name.findName())
    testInputStatus('name')

    cy.getByTestId('email').focus().type(faker.internet.email())
    testInputStatus('email')

    cy.getByTestId('password').focus().type(password)
    testInputStatus('password')

    cy.getByTestId('passwordConfirmation').focus().type(password)
    testInputStatus('passwordConfirmation')

    cy.getByTestId('submit').should('not.have.attr', 'disabled')
    cy.getByTestId('error-wrap').should('not.have.descendants')
  })

  it('Should present error if a email that are already in use are provided', () => {
    mockEmailInUseError()
    simulateValidSubmit()
    testMainError('Esse e-mail já está em uso!')
    testUrl('/signup')
  })

  it('Should present error on UnexpectedError', () => {
    mockUnexpectedError()
    simulateValidSubmit()
    testMainError('Algo de errado aconteceu. Tente novamente!')
    testUrl('/signup')
  })

  it('Should present save account if valid credentiasl are provided', () => {
    mockSuccess()
    simulateValidSubmit()
    testUrl('/')
    testLocalStorageItem('account')
  })

  it('Should prevent multiple submits', () => {
    mockSuccess()
    populateFields()
    cy.getByTestId('submit').dblclick()
    cy.wait('@request')
    testHttpCallsCount(1)
  })

  it('Should not submit with invalid form', () => {
    mockSuccess()

    cy.getByTestId('email').focus().type(faker.internet.email()).type('{enter}')

    testHttpCallsCount(0)
  })
})
