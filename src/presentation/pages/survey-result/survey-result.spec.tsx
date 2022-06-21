import React from 'react'
import { screen, render } from '@testing-library/react'
import SurveyResult from './survey-result'
import { ApiContext } from '@/presentation/contexts'
import { mockAccountModel } from '@/domain/test'

const makeSut = (): void => {
  render(
    <ApiContext.Provider
      value={{
        setCurrentAccount: jest.fn(),
        getCurrentAccount: () => mockAccountModel(),
      }}>
      <SurveyResult />
    </ApiContext.Provider>
  )
}

describe('SurveyResult', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('Should present correct initial state', async () => {
    makeSut()
    const surveyResult = screen.getByTestId('survey-result')
    expect(surveyResult.childElementCount).toBe(0)
    expect(screen.queryByTestId('error')).not.toBeInTheDocument()
    expect(screen.queryByTestId('loading')).not.toBeInTheDocument()
  })
})
