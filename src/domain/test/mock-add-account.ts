import faker from 'faker'

import { AddAccount } from '@/domain/usecases'

export const mockAddAccount = (): AddAccount.Params => {
  const password = faker.internet.password()

  return {
    name: faker.name.findName(),
    email: faker.internet.email(),
    password,
    passwordConfirmation: password,
  }
}
