import React from 'react'
import { createMemoryHistory, MemoryHistory } from 'history'
import { fireEvent, screen, waitFor } from '@testing-library/react'

import { AccountModel } from '@/domain/models'
import { AccessDeniedError, UnexpectedError } from '@/domain/erros'
import { LoadSurveyListSpy, renderWithHistory } from '@/presentation/test'
import SurveyList from './survey-list'

type SutTypes = {
  loadSurveyListSpy: LoadSurveyListSpy
  setCurrentAccountMock: (account: AccountModel) => void
  history: MemoryHistory
}

const makeSut = (loadSurveyListSpy = new LoadSurveyListSpy()): SutTypes => {
  const history = createMemoryHistory({ initialEntries: ['/'] }) as any

  const { setCurrentAccountMock } = renderWithHistory({
    history,
    Page: () => <SurveyList loadSurveyList={loadSurveyListSpy} />,
  })

  return {
    loadSurveyListSpy,
    setCurrentAccountMock,
    history,
  }
}

describe('SurveyList', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('Should present 4 empty items on start', async () => {
    makeSut()
    const surveyList = screen.getByTestId('survey-list')
    expect(surveyList.querySelectorAll('li:empty')).toHaveLength(4)
    await waitFor(() => surveyList)
  })

  it('Should call LoadSurveyList', async () => {
    const { loadSurveyListSpy } = await waitFor(() => makeSut())
    expect(loadSurveyListSpy.callsCount).toBe(1)
  })

  it('Should render SurveyItems on success', async () => {
    await waitFor(() => makeSut())
    const surveyList = screen.getByTestId('survey-list')
    expect(surveyList.querySelectorAll('li.surveyItemWrap')).toHaveLength(3)
    expect(screen.queryByTestId('error')).not.toBeInTheDocument()
  })

  it('Should render error on failure', async () => {
    const error = new UnexpectedError()
    const loadSurveyListSpy = new LoadSurveyListSpy()
    jest.spyOn(loadSurveyListSpy, 'loadAll').mockRejectedValueOnce(error)
    await waitFor(() => makeSut(loadSurveyListSpy))

    expect(screen.queryByTestId('survey-list')).not.toBeInTheDocument()
    expect(screen.getByTestId('error')).toHaveTextContent(error.message)
  })

  it('Should logout on accessDeniedError', async () => {
    const loadSurveyListSpy = new LoadSurveyListSpy()
    jest
      .spyOn(loadSurveyListSpy, 'loadAll')
      .mockRejectedValueOnce(new AccessDeniedError())
    const { setCurrentAccountMock, history } = await waitFor(() =>
      makeSut(loadSurveyListSpy)
    )

    expect(setCurrentAccountMock).toHaveBeenCalledWith(undefined)
    expect(history.location.pathname).toBe('/login')
  })

  it('Should call LoadSurveyList again on button click', async () => {
    const loadSurveyListSpy = new LoadSurveyListSpy()
    jest
      .spyOn(loadSurveyListSpy, 'loadAll')
      .mockRejectedValueOnce(new UnexpectedError())
    await waitFor(() => makeSut(loadSurveyListSpy))

    await waitFor(() => fireEvent.click(screen.getByTestId('reload')))
    expect(loadSurveyListSpy.callsCount).toBe(1)
  })
})
