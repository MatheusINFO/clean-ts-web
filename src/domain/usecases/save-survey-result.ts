import { SurveyResultModel } from '@/domain/models'

export interface SaveSurveyResult {
  save: () => Promise<SaveSurveyResult.Result>
}

export namespace SaveSurveyResult {
  export type Params = {
    answer: string
  }

  export type Result = SurveyResultModel
}
