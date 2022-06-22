import { atom } from 'recoil'
import { SurveyModel } from '@/domain/models'

export const surveyListState = atom({
  key: 'surveyListState',
  default: {
    surveys: [] as SurveyModel[],
    error: '',
    reload: false,
  },
})
