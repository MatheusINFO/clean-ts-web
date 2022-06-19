import faker from 'faker'
import { setLocalStorageItem } from '../support/helpers'
import {
  mockUnexpectedError,
  mockAccessDeniedError,
} from '../support/survey-list-mocks'

describe('SurveyList', () => {
  beforeEach(() => {
    setLocalStorageItem('account', {
      accessToken: faker.random.uuid(),
      name: faker.name.findName(),
    })
  })

  it('Should present error on UnexpectedError', () => {
    mockUnexpectedError()
    cy.visit('/')
    cy.getByTestId('error').should(
      'contain.text',
      'Algo de errado aconteceu. Tente novamente!'
    )
  })

  it('Should logou on AccessDeniedError', () => {
    mockAccessDeniedError()
    cy.visit('/login')
  })
})
