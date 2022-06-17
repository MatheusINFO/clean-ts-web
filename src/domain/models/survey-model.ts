export type SurveyModel = {
  id: string
  question: string
  answers: [
    {
      answer: string
      image?: string
    }
  ]
  date: Date
  didAnswer: boolean
}
