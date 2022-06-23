import faker from 'faker'

import { SurveyModel } from '@/domain/models'

export const mockSurveyModel = (): SurveyModel => ({
  id: faker.datatype.uuid(),
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
  date: faker.date.recent().toISOString(),
  didAnswer: faker.datatype.boolean(),
})

export const mockSurveyListModel = (): SurveyModel[] => [
  mockSurveyModel(),
  mockSurveyModel(),
  mockSurveyModel(),
]
