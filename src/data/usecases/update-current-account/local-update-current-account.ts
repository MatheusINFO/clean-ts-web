import { SetStorage } from '@/data/protocols/cache'
import { UnexpectedError } from '@/domain/erros'
import { AccountModel } from '@/domain/models'
import { UpdateCurrentAccount } from '@/domain/usecases'

export class LocalUpdateCurrentAccount implements UpdateCurrentAccount {
  constructor(private readonly setStorage: SetStorage) {}

  async update(account: AccountModel): Promise<void> {
    if (!account?.accessToken) {
      throw new UnexpectedError()
    }

    this.setStorage.set('account', JSON.stringify(account))
  }
}
