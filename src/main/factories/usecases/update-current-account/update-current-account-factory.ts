import { makeLocalStorageAdapterFactory } from '@/main/factories/cache'
import { LocalUpdateCurrentAccount } from '@/data/usecases/update-current-account/local-update-current-account'

export const makeLocalUpdateCurrentAccountFactory =
  (): LocalUpdateCurrentAccount => {
    return new LocalUpdateCurrentAccount(makeLocalStorageAdapterFactory())
  }
