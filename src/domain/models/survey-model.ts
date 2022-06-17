export type SurveyAnswerModel = {
  answer: string
  image?: string
}

export type SurveyModel = {
  id: string
  question: string
  answers: SurveyAnswerModel[]
  date: Date
  didAnswer: boolean
}
