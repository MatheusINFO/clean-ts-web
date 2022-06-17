import { AccountModel } from '@/domain/models'
import { UnexpectedError } from '@/domain/erros'
import { makeLocalStorageAdapterFactory } from '@/main/factories/cache'

export const setCurrentAccountAdapter = (account: AccountModel): void => {
  if (!account?.accessToken) {
    throw new UnexpectedError()
  }

  makeLocalStorageAdapterFactory().set('account', account)
}

export const getCurrentAccountAdapter = (): AccountModel => {
  return makeLocalStorageAdapterFactory().get('account')
}
