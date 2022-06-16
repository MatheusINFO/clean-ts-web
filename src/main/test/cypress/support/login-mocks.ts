import faker from 'faker'
import * as Helper from '../support/http-mocks'

export const mockInvalidCredentialsError = (): void =>
  Helper.mockInvalidCredentialsError(/login/)

export const mockUnexpectedError = (): void =>
  Helper.mockUnexpectedError(/login/, 'POST')

export const mockSuccess = (): void => {
  Helper.mockSuccess(/login/, 'POST', {
    accessToken: faker.random.uuid(),
  })
}

export const mockInvalidData = (): void => {
  Helper.mockSuccess(/login/, 'POST', {
    [faker.random.word()]: faker.random.uuid(),
  })
}
