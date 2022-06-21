export interface LoadSurveyResult {
  load: () => Promise<LoadSurveyResult.Result>
}

export namespace LoadSurveyResult {
  export type Result = {
    question: string
    date: Date
    answers: Array<{
      answer: string
      count: number
      percent: number
      image?: string
      isCurrentAccountAnswer: boolean
    }>
  }
}
