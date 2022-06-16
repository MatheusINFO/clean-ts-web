import { SetStorage } from '@/data/protocols/cache'
import { UnexpectedError } from '@/domain/erros'
import { SaveAccessToken } from '@/domain/usecases'

export class LocalSaveAccessToken implements SaveAccessToken {
  constructor(private readonly setStorage: SetStorage) {}

  async save(accessToken: string): Promise<void> {
    if (!accessToken) {
      throw new UnexpectedError()
    }

    await this.setStorage.set('accessToken', accessToken)
  }
}
