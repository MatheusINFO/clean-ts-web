import faker from 'faker'
import { SurveyModel } from '../models'

export const mockSurveyModel = (): SurveyModel => ({
  id: faker.random.uuid(),
  question: faker.random.words(10),
  answers: [
    {
      answer: faker.random.words(4),
      image: faker.image.imageUrl(),
    },
    {
      answer: faker.random.words(4),
    },
  ],
  date: faker.date.recent(),
  didAnswer: faker.random.boolean(),
})

export const mockSurveyListModel = (): SurveyModel[] => [
  mockSurveyModel(),
  mockSurveyModel(),
  mockSurveyModel(),
]
