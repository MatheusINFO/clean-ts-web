import React from 'react'
import { createMemoryHistory } from 'history'
import { screen, waitFor, fireEvent } from '@testing-library/react'
import {
  LoadSurveyResultSpy,
  mockSurveyResultModel,
  SaveSurveyResultSpy,
} from '@/domain/test'
import SurveyResult from './survey-result'
import { AccessDeniedError, UnexpectedError } from '@/domain/erros'
import { AccountModel } from '@/domain/models'
import { renderWithHistory } from '@/presentation/test'

type SutTypes = {
  loadSurveyResultSpy: LoadSurveyResultSpy
  saveSurveyResultSpy: SaveSurveyResultSpy
  setCurrentAccountMock: (account: AccountModel) => void
  history: any
}

type SutParams = {
  loadSurveyResultSpy?: LoadSurveyResultSpy
  saveSurveyResultSpy?: SaveSurveyResultSpy
}

const makeSut = ({
  loadSurveyResultSpy = new LoadSurveyResultSpy(),
  saveSurveyResultSpy = new SaveSurveyResultSpy(),
}: SutParams = {}): SutTypes => {
  const history = createMemoryHistory({
    initialEntries: ['/', '/survey/any_id'],
    initialIndex: 1,
  }) as any

  const { setCurrentAccountMock } = renderWithHistory({
    history,
    Page: () => (
      <SurveyResult
        loadSurveyResult={loadSurveyResultSpy}
        saveSurveyResult={saveSurveyResultSpy}
      />
    ),
  })

  return {
    loadSurveyResultSpy,
    setCurrentAccountMock,
    saveSurveyResultSpy,
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
    await waitFor(() => makeSut({ loadSurveyResultSpy: loadSurveyResultSpy }))
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
    await waitFor(() => makeSut({ loadSurveyResultSpy: loadSurveyResultSpy }))

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
      makeSut({ loadSurveyResultSpy: loadSurveyResultSpy })
    )

    expect(setCurrentAccountMock).toHaveBeenCalledWith(undefined)
    expect(history.location.pathname).toBe('/login')
  })

  it('Should call LoadSurveyResult again on button click', async () => {
    const loadSurveyResultSpy = new LoadSurveyResultSpy()
    jest
      .spyOn(loadSurveyResultSpy, 'load')
      .mockRejectedValueOnce(new UnexpectedError())
    await waitFor(() => makeSut({ loadSurveyResultSpy: loadSurveyResultSpy }))

    await waitFor(() => fireEvent.click(screen.getByTestId('reload')))
    expect(loadSurveyResultSpy.callsCount).toBe(1)
  })

  it('Should goto SurveyList on back button click', async () => {
    const { history } = await waitFor(() => makeSut())
    fireEvent.click(screen.getByTestId('back-button'))
    expect(history.location.pathname).toBe('/')
  })

  it('Should not present Loading on active answer click', async () => {
    await waitFor(() => makeSut())
    const answersWrap = screen.queryAllByTestId('answer-wrap')
    fireEvent.click(answersWrap[0])
    expect(screen.queryByTestId('loading')).not.toBeInTheDocument()
  })

  it('Should call SaveSurveyResult on non active answer click', async () => {
    const { saveSurveyResultSpy, loadSurveyResultSpy } = await waitFor(() =>
      makeSut()
    )
    const answersWrap = screen.queryAllByTestId('answer-wrap')
    fireEvent.click(answersWrap[1])
    expect(screen.queryByTestId('loading')).toBeInTheDocument()
    expect(saveSurveyResultSpy.params).toEqual({
      answer: loadSurveyResultSpy.surveyResult.answers[1].answer,
    })
    await waitFor(() => answersWrap)
  })

  it('Should render error on UnexpectedError', async () => {
    const saveSurveyResultSpy = new SaveSurveyResultSpy()
    const error = new UnexpectedError()
    jest.spyOn(saveSurveyResultSpy, 'save').mockRejectedValueOnce(error)
    await waitFor(() => makeSut({ saveSurveyResultSpy: saveSurveyResultSpy }))

    const answersWrap = screen.queryAllByTestId('answer-wrap')
    await waitFor(() => fireEvent.click(answersWrap[1]))

    expect(screen.queryByTestId('question')).not.toBeInTheDocument()
    expect(screen.queryByTestId('loading')).not.toBeInTheDocument()
    expect(screen.getByTestId('error')).toHaveTextContent(error.message)
  })

  it('Should logout on accessDeniedError', async () => {
    const saveSurveyResultSpy = new SaveSurveyResultSpy()
    jest
      .spyOn(saveSurveyResultSpy, 'save')
      .mockRejectedValueOnce(new AccessDeniedError())
    const { setCurrentAccountMock, history } = await waitFor(() =>
      makeSut({ saveSurveyResultSpy: saveSurveyResultSpy })
    )

    const answersWrap = screen.queryAllByTestId('answer-wrap')
    await waitFor(() => fireEvent.click(answersWrap[1]))

    expect(setCurrentAccountMock).toHaveBeenCalledWith(undefined)
    expect(history.location.pathname).toBe('/login')
  })

  it('Should present SurveyResult data on SaveSurveyResult success', async () => {
    const surveyResult = Object.assign(mockSurveyResultModel(), {
      date: new Date('2001-01-30T00:00:00'),
    })
    const saveSurveyResultSpy = new SaveSurveyResultSpy()
    saveSurveyResultSpy.surveyResult = surveyResult
    await waitFor(() => makeSut({ saveSurveyResultSpy: saveSurveyResultSpy }))

    const answersWrap = screen.queryAllByTestId('answer-wrap')
    await waitFor(() => fireEvent.click(answersWrap[1]))

    expect(screen.getByTestId('question')).toHaveTextContent(
      surveyResult.question
    )
    expect(screen.getByTestId('answers').childElementCount).toBe(
      surveyResult.answers.length
    )
    expect(screen.getByTestId('day')).toHaveTextContent('30')
    expect(screen.getByTestId('month')).toHaveTextContent('jan')
    expect(screen.getByTestId('year')).toHaveTextContent('2001')

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

    expect(screen.queryByTestId('loading')).not.toBeInTheDocument()
  })

  it('Should prevent multiple answer click', async () => {
    const { saveSurveyResultSpy } = await waitFor(() => makeSut())

    const answersWrap = screen.queryAllByTestId('answer-wrap')
    await waitFor(() => fireEvent.click(answersWrap[1]))
    await waitFor(() => fireEvent.click(answersWrap[1]))

    expect(saveSurveyResultSpy.callsCount).toBe(1)
  })
})
