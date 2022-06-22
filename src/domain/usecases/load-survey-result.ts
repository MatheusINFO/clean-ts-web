import { SurveyResultModel } from '@/domain/models'

export interface LoadSurveyResult {
  load: () => Promise<LoadSurveyResult.Result>
}

export namespace LoadSurveyResult {
  export type Result = SurveyResultModel
}
