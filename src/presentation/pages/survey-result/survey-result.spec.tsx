import React from 'react'
import { Router } from 'react-router-dom'
import { createMemoryHistory, MemoryHistory } from 'history'
import { screen, render, waitFor, fireEvent } from '@testing-library/react'
import { ApiContext } from '@/presentation/contexts'
import {
  LoadSurveyResultSpy,
  mockAccountModel,
  mockSurveyResultModel,
} from '@/domain/test'
import SurveyResult from './survey-result'
import { AccessDeniedError, UnexpectedError } from '@/domain/erros'
import { AccountModel } from '@/domain/models'

type SutTypes = {
  loadSurveyResultSpy: LoadSurveyResultSpy
  setCurrentAccountMock: (account: AccountModel) => void
  history: MemoryHistory
}

const makeSut = (loadSurveyResultSpy = new LoadSurveyResultSpy()): SutTypes => {
  const history = createMemoryHistory({ initialEntries: ['/'] }) as any
  const setCurrentAccountMock = jest.fn()

  render(
    <ApiContext.Provider
      value={{
        setCurrentAccount: setCurrentAccountMock,
        getCurrentAccount: () => mockAccountModel(),
      }}>
      <Router history={history}>
        <SurveyResult loadSurveyResult={loadSurveyResultSpy} />
      </Router>
    </ApiContext.Provider>
  )

  return {
    loadSurveyResultSpy,
    setCurrentAccountMock,
    history,
  }
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
    await waitFor(() => surveyResult)
  })

  it('Should call LoadSurveyResult', async () => {
    const { loadSurveyResultSpy } = await waitFor(() => makeSut())
    expect(loadSurveyResultSpy.callsCount).toBe(1)
  })

  it('Should present SurveyResult data on success', async () => {
    const surveyResult = Object.assign(mockSurveyResultModel(), {
      date: new Date('2001-01-30T00:00:00'),
    })
    const loadSurveyResultSpy = new LoadSurveyResultSpy()
    loadSurveyResultSpy.surveyResult = surveyResult
    await waitFor(() => makeSut(loadSurveyResultSpy))
    expect(screen.getByTestId('question')).toHaveTextContent(
      surveyResult.question
    )
    expect(screen.getByTestId('answers').childElementCount).toBe(
      surveyResult.answers.length
    )
    expect(screen.getByTestId('day')).toHaveTextContent('30')
    expect(screen.getByTestId('month')).toHaveTextContent('jan')
    expect(screen.getByTestId('year')).toHaveTextContent('2001')

    const answersWrap = screen.queryAllByTestId('answer-wrap')
    expect(answersWrap[0]).toHaveClass('active')
    expect(answersWrap[1]).not.toHaveClass('active')

    const images = screen.queryAllByTestId('image')
    expect(images[0]).toHaveAttribute('src', surveyResult.answers[0].image)
    expect(images[0]).toHaveAttribute('alt', surveyResult.answers[0].answer)
    expect(images[1]).toBeFalsy()

    const answers = screen.queryAllByTestId('answer')
    expect(answers[0]).toHaveTextContent(surveyResult.answers[0].answer)

    const percents = screen.queryAllByTestId('percent')
    expect(percents[0]).toHaveTextContent(`${surveyResult.answers[0].percent}%`)
  })

  it('Should render error on UnexpectedError', async () => {
    const loadSurveyResultSpy = new LoadSurveyResultSpy()
    const error = new UnexpectedError()
    jest.spyOn(loadSurveyResultSpy, 'load').mockRejectedValueOnce(error)
    await waitFor(() => makeSut(loadSurveyResultSpy))

    expect(screen.queryByTestId('question')).not.toBeInTheDocument()
    expect(screen.queryByTestId('loading')).not.toBeInTheDocument()
    expect(screen.getByTestId('error')).toHaveTextContent(error.message)
  })

  it('Should logout on accessDeniedError', async () => {
    const loadSurveyResultSpy = new LoadSurveyResultSpy()
    jest
      .spyOn(loadSurveyResultSpy, 'load')
      .mockRejectedValueOnce(new AccessDeniedError())
    const { setCurrentAccountMock, history } = await waitFor(() =>
      makeSut(loadSurveyResultSpy)
    )

    expect(setCurrentAccountMock).toHaveBeenCalledWith(undefined)
    expect(history.location.pathname).toBe('/login')
  })

  it('Should call LoadSurveyResult again on button click', async () => {
    const loadSurveyResultSpy = new LoadSurveyResultSpy()
    jest
      .spyOn(loadSurveyResultSpy, 'load')
      .mockRejectedValueOnce(new UnexpectedError())
    await waitFor(() => makeSut(loadSurveyResultSpy))

    await waitFor(() => fireEvent.click(screen.getByTestId('reload')))
    expect(loadSurveyResultSpy.callsCount).toBe(1)
  })
})
