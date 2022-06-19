import { AccountModel } from '@/domain/models'
import { makeLocalStorageAdapterFactory } from '@/main/factories/cache'

export const setCurrentAccountAdapter = (account: AccountModel): void => {
  makeLocalStorageAdapterFactory().set('account', account)
}

export const getCurrentAccountAdapter = (): AccountModel => {
  return makeLocalStorageAdapterFactory().get('account')
}
