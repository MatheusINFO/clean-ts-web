import { SurveyModel } from '@/domain/models'

export interface LoadSurveyList {
  loadAll: () => Promise<LoadSurveyList.Result>
}

export namespace LoadSurveyList {
  export type Result = SurveyModel[]
}
