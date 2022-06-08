import faker from 'faker'
import { AuthenticationParams } from '../usecases'

export const mockAuthentication = (): AuthenticationParams => ({
  email: faker.internet.email(),
  password: faker.internet.password(),
})
