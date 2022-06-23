import * as Http from '../utils/http-mocks'
import {
  getLocalStorageItem,
  setLocalStorageItem,
  testUrl,
} from '../utils/helpers'

const path = /surveys/

const mockLoadSuccess = (): void =>
  Http.mockSuccess(path, 'GET', 'fx:load-survey-result')

describe('SurveyResult', () => {
  describe('load', () => {
    const mockUnexpectedError = (): void => Http.mockServerError(path, 'GET')
    const mockAccessDeniedError = (): void =>
      Http.mockForbiddenError(path, 'GET')

    beforeEach(() => {
      cy.fixture('account').then((account) =>
        setLocalStorageItem('account', account)
      )
    })

    it('Should present error on UnexpectedError', () => {
      mockUnexpectedError()
      cy.visit('/surveys/any_id')
      cy.getByTestId('error').should(
        'contain.text',
        'Algo de errado aconteceu. Tente novamente!'
      )
    })

    it('Should reload on button click', () => {
      mockUnexpectedError()
      cy.visit('/surveys/any_id')
      cy.getByTestId('error').should(
        'contain.text',
        'Algo de errado aconteceu. Tente novamente!'
      )
      mockLoadSuccess()
      cy.getByTestId('reload').click()
      cy.getByTestId('question').should('exist')
    })

    it('Should logout on AccessDeniedError', () => {
      mockAccessDeniedError()
      cy.visit('/surveys/any_id')
      testUrl('/login')
    })

    it('Should present correct username', () => {
      mockUnexpectedError()
      cy.visit('/surveys/any_id')
      const { name } = getLocalStorageItem('account')
      cy.getByTestId('username').should('contain.text', name)
    })

    it('Should logout on logout link click', () => {
      mockUnexpectedError()
      cy.visit('/surveys/any_id')
      cy.getByTestId('logout').click()
      testUrl('/login')
    })

    it('Should present survey result', () => {
      mockLoadSuccess()
      cy.visit('/surveys/any_id')
      cy.getByTestId('question').should('have.text', 'Question')
      cy.getByTestId('day').should('have.text', '03')
      cy.getByTestId('month').should('have.text', 'fev')
      cy.getByTestId('year').should('have.text', '2018')
      cy.get('li:nth-child(1)').then((li) => {
        assert.equal(li.find('[data-testid="answer"]').text(), 'any_answer')
        assert.equal(li.find('[data-testid="image"]').attr('src'), 'any_image')
        assert.equal(li.find('[data-testid="percent"]').text(), '70%')
      })
      cy.get('li:nth-child(2)').then((li) => {
        assert.equal(li.find('[data-testid="answer"]').text(), 'any_answer2')
        assert.notExists(li.find('[data-testid="image"]'))
        assert.equal(li.find('[data-testid="percent"]').text(), '30%')
      })
    })

    it('Should go back on button click', () => {
      mockLoadSuccess()
      cy.visit('/')
      cy.visit('/surveys/any_id')
      cy.getByTestId('back-button').click()
      testUrl('/')
    })
  })

  describe('save', () => {
    const mockUnexpectedError = (): void => Http.mockServerError(path, 'PUT')
    const mockAccessDeniedError = (): void =>
      Http.mockForbiddenError(path, 'PUT')
    const mockSaveSuccess = (): void =>
      Http.mockSuccess(path, 'PUT', 'fx:save-survey-result')

    beforeEach(() => {
      cy.fixture('account').then((account) =>
        setLocalStorageItem('account', account)
      )
      mockLoadSuccess()
      cy.visit('/surveys/any_id')
    })

    it('Should present error on UnexpectedError', () => {
      mockUnexpectedError()
      cy.get('li:nth-child(2)').click()
      cy.getByTestId('error').should(
        'contain.text',
        'Algo de errado aconteceu. Tente novamente!'
      )
    })

    it('Should logout on AccessDeniedError', () => {
      mockAccessDeniedError()
      cy.get('li:nth-child(2)').click()
      testUrl('/login')
    })

    it('Should present survey result', () => {
      mockSaveSuccess()
      cy.get('li:nth-child(2)').click()

      cy.getByTestId('question').should('have.text', 'Other Question')
      cy.getByTestId('day').should('have.text', '23')
      cy.getByTestId('month').should('have.text', 'mar')
      cy.getByTestId('year').should('have.text', '2020')
      cy.get('li:nth-child(1)').then((li) => {
        assert.equal(li.find('[data-testid="answer"]').text(), 'other_answer')
        assert.equal(
          li.find('[data-testid="image"]').attr('src'),
          'other_image'
        )
        assert.equal(li.find('[data-testid="percent"]').text(), '50%')
      })
      cy.get('li:nth-child(2)').then((li) => {
        assert.equal(li.find('[data-testid="answer"]').text(), 'other_answer2')
        assert.notExists(li.find('[data-testid="image"]'))
        assert.equal(li.find('[data-testid="percent"]').text(), '50%')
      })
    })
  })
})
