import React from 'react'
import { render, screen } from '@testing-library/react'
import SurveyItem from './survey-item'
import { mockSurveyModel } from '@/domain/test/mock-survey-list'
import { SurveyModel } from '@/domain/models'
import { IconName } from '@/presentation/components'

const makeSut = (survey: SurveyModel): void => {
  render(<SurveyItem survey={survey} />)
}

describe('SurveyItem', () => {
  it('Should render with correct values', () => {
    const survey = mockSurveyModel()
    survey.didAnswer = true
    survey.date = new Date('2001-01-30T00:00:00')
    makeSut(survey)
    expect(screen.getByTestId('icon')).toHaveProperty('src', IconName.thumbUp)
    expect(screen.getByTestId('question')).toHaveTextContent(survey.question)
    expect(screen.getByTestId('day')).toHaveTextContent('30')
    expect(screen.getByTestId('month')).toHaveTextContent('jan')
    expect(screen.getByTestId('year')).toHaveTextContent('2001')
  })
})
