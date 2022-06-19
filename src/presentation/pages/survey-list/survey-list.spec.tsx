import React from 'react'
import { createMemoryHistory } from 'history'
import { Router } from 'react-router-dom'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { UnexpectedError } from '@/domain/erros'
import { LoadSurveyListSpy } from '@/presentation/test'
import { ApiContext } from '@/presentation/contexts'
import SurveyList from './survey-list'
import { mockAccountModel } from '@/domain/test'

type SutTypes = {
  loadSurveyListSpy: LoadSurveyListSpy
}

const history = createMemoryHistory({ initialEntries: ['/'] }) as any
const makeSut = (loadSurveyListSpy = new LoadSurveyListSpy()): SutTypes => {
  render(
    <ApiContext.Provider
      value={{
        setCurrentAccount: jest.fn(),
        getCurrentAccount: () => mockAccountModel(),
      }}>
      <Router history={history}>
        <SurveyList loadSurveyList={loadSurveyListSpy} />
      </Router>
    </ApiContext.Provider>
  )

  return {
    loadSurveyListSpy,
  }
}

describe('SurveyList', () => {
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
