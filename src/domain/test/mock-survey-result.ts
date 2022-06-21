import faker from 'faker'
import { LoadSurveyResult } from '@/domain/usecases'

export const mockSurveyResultModel = (): LoadSurveyResult.Result => ({
  question: faker.random.words(10),
  answers: [
    {
      answer: faker.random.words(4),
      image: faker.image.imageUrl(),
      count: faker.random.number(),
      percent: faker.random.number(),
      isCurrentAccountAnswer: true,
    },
    {
      answer: faker.random.words(4),
      count: faker.random.number(),
      percent: faker.random.number(),
      isCurrentAccountAnswer: false,
    },
  ],
  date: faker.date.recent(),
})

export class LoadSurveyResultSpy implements LoadSurveyResult {
  callsCount = 0
  surveyResult = mockSurveyResultModel()

  async load(): Promise<LoadSurveyResult.Result> {
    this.callsCount++
    return this.surveyResult
  }
}
