import faker from 'faker'
import * as Http from './http-mocks'

export const mockEmailInUseError = (): void =>
  Http.mockForbiddenError(/signup/, 'POST')

export const mockUnexpectedError = (): void => Http.mockServerError(/signup/, 'POST')

export const mockSuccess = (): void => {
  Http.mockSuccess(/signup/, 'POST', {
    accessToken: faker.random.uuid(),
    name: faker.name.findName(),
  })
}
