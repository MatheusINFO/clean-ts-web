import faker from 'faker'
import { RemoteLoadSurveyResult } from '@/data/usecases'

export const mockRemoteSurveyResultModel =
  (): RemoteLoadSurveyResult.Result => ({
    question: faker.random.words(),
    date: faker.date.recent().toISOString(),
    answers: [
      {
        answer: faker.random.words(),
        count: faker.datatype.number(),
        percent: faker.datatype.number(),
        image: faker.image.imageUrl(),
        isCurrentAccountAnswer: faker.datatype.boolean(),
      },
    ],
  })
