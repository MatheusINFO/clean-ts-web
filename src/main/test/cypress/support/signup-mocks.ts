import faker from 'faker'
import * as Helper from './http-mocks'

export const mockEmailInUseError = (): void =>
  Helper.mockEmailInUseError(/signup/)

export const mockUnexpectedError = (): void =>
  Helper.mockUnexpectedError(/signup/, 'POST')

export const mockInvalidData = (): void => {
  Helper.mockSuccess(/signup/, 'POST', {
    [faker.random.word()]: faker.random.uuid(),
  })
}

export const mockSuccess = (): void => {
  Helper.mockSuccess(/signup/, 'POST', {
    accessToken: faker.random.uuid(),
    name: faker.name.findName(),
  })
}
