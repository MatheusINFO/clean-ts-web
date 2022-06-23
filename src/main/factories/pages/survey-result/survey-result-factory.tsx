import React from 'react'
import { useParams } from 'react-router-dom'

import { SurveyResult } from '@/presentation/pages'
import {
  makeRemoteSurveyResultFactory,
  makeRemoteSaveResultFactory,
} from '@/main/factories/usecases'

export const makeSurveyResultFactory: React.FC = () => {
  const { id } = useParams<{ id: string }>()

  return (
    <SurveyResult
      loadSurveyResult={makeRemoteSurveyResultFactory(id)}
      saveSurveyResult={makeRemoteSaveResultFactory(id)}
    />
  )
}
