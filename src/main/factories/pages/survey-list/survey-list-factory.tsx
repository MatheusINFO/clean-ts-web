import React from 'react'

import { SurveyList } from '@/presentation/pages'
import { makeRemoteSurveyListFactory } from '@/main/factories/usecases'

export const makeSurveyListFactory: React.FC = () => (
  <SurveyList loadSurveyList={makeRemoteSurveyListFactory()} />
)
