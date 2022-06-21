import React from 'react'
import { render, screen } from '@testing-library/react'
import SurveyItem from './survey-item'
import { mockSurveyModel } from '@/domain/test/mock-survey-list'
import { SurveyModel } from '@/domain/models'
import { IconName } from '@/presentation/components'

const makeSut = (survey: SurveyModel = mockSurveyModel()): void => {
  render(<SurveyItem survey={survey} />)
}

describe('SurveyItem', () => {
  it('Should render with correct values and thumUpIcon', () => {
    const survey = Object.assign(mockSurveyModel(), {
      didAnswer: true,
      date: new Date(),
    })
    makeSut(survey)
    expect(screen.getByTestId('icon')).toHaveProperty('src', IconName.thumbUp)
    expect(screen.getByTestId('question')).toHaveTextContent(survey.question)
  })

  it('Should render with correct values and thumDownIcon', () => {
    const survey = Object.assign(mockSurveyModel(), {
      didAnswer: false,
      date: new Date(),
    })
    makeSut(survey)
    expect(screen.getByTestId('icon')).toHaveProperty('src', IconName.thumbDown)
  })
})
