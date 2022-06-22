import faker from 'faker'
import { LoadSurveyResult, SaveSurveyResult } from '@/domain/usecases'

export const mockSaveSurveyResultParams = (): SaveSurveyResult.Params => ({
  answer: faker.random.word(),
})

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

export class SaveSurveyResultSpy implements SaveSurveyResult {
  callsCount = 0
  params: SaveSurveyResult.Params
  surveyResult = mockSurveyResultModel()

  async save(
    params: SaveSurveyResult.Params
  ): Promise<SaveSurveyResult.Result> {
    this.callsCount++
    this.params = params
    return this.surveyResult
  }
}
