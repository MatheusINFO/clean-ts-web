export type SurveyResultAnswerModel = {
  answer: string
  count: number
  percent: number
  image?: string
  isCurrentAccountAnswer: boolean
}

export type SurveyResultModel = {
  question: string
  date: Date
  answers: SurveyResultAnswerModel[]
}
