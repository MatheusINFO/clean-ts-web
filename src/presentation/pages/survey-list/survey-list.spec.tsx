import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import SurveyList from './survey-list'
import { LoadSurveyList } from '@/domain/usecases'
import { SurveyModel } from '@/domain/models'
import { mockSurveyListModel } from '@/domain/test/mock-survey-list'

class LoadSurveyListSpy implements LoadSurveyList {
  callsCount = 0
  surveys = mockSurveyListModel()

  async loadAll(): Promise<SurveyModel[]> {
    this.callsCount++
    return this.surveys
  }
}

type SutTypes = {
  loadSurveyListSpy: LoadSurveyListSpy
}

const makeSut = (): SutTypes => {
  const loadSurveyListSpy = new LoadSurveyListSpy()

  render(<SurveyList loadSurveyList={loadSurveyListSpy} />)

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
  })
})
