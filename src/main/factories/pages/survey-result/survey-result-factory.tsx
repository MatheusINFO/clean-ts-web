import React from 'react'
import { useParams } from 'react-router-dom'
import { SurveyResult } from '@/presentation/pages'
import {
  makeRemoteSurveyResultFactory,
  makeRemoteSaveResultFactory,
} from '@/main/factories/usecases'

export const makeSurveyResultFactory: React.FC = () => {
  const params: any = useParams()

  return (
    <SurveyResult
      loadSurveyResult={makeRemoteSurveyResultFactory(params.id)}
      saveSurveyResult={makeRemoteSaveResultFactory(params.id)}
    />
  )
}
