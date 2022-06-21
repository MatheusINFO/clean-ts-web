import React from 'react'
import { createMemoryHistory, MemoryHistory } from 'history'
import { fireEvent, render, screen } from '@testing-library/react'
import SurveyItem from './survey-item'
import { mockSurveyModel } from '@/domain/test'
import { SurveyModel } from '@/domain/models'
import { IconName } from '@/presentation/components'
import { Router } from 'react-router-dom'

type SutTypes = {
  history: MemoryHistory
}

const makeSut = (survey: SurveyModel = mockSurveyModel()): SutTypes => {
  const history = createMemoryHistory({ initialEntries: ['/'] }) as any
  render(
    <Router history={history}>
      <SurveyItem survey={survey} />
    </Router>
  )

  return {
    history,
  }
}

describe('SurveyItem', () => {
  it('Should render with correct values and thumUpIcon', () => {
    const survey = Object.assign(mockSurveyModel(), {
      didAnswer: true,
      date: new Date('2001-01-30T00:00:00'),
    })
    makeSut(survey)
    expect(screen.getByTestId('icon')).toHaveProperty('src', IconName.thumbUp)
    expect(screen.getByTestId('question')).toHaveTextContent(survey.question)
    expect(screen.getByTestId('day')).toHaveTextContent('30')
    expect(screen.getByTestId('month')).toHaveTextContent('jan')
    expect(screen.getByTestId('year')).toHaveTextContent('2001')
  })

  it('Should render with correct values and thumDownIcon', () => {
    const survey = Object.assign(mockSurveyModel(), {
      didAnswer: false,
      date: new Date('2001-01-03T00:00:00'),
    })
    makeSut(survey)
    expect(screen.getByTestId('icon')).toHaveProperty('src', IconName.thumbDown)
    expect(screen.getByTestId('day')).toHaveTextContent('03')
    expect(screen.getByTestId('month')).toHaveTextContent('jan')
    expect(screen.getByTestId('year')).toHaveTextContent('2001')
  })

  it('Should go to SurveyResult', () => {
    const survey = mockSurveyModel()
    const { history } = makeSut(survey)
    fireEvent.click(screen.getByTestId('link'))
    expect(history.location.pathname).toBe(`/surveys/${survey.id}`)
  })
})
