import { mockAccountModel } from '@/domain/test'
import { LocalStorageAdapter } from '@/infra/cache/local-storage-adapter/local-storage-adapter'
import { setCurrentAccountAdapter } from './current-account-adapter'

jest.mock('@/infra/cache/local-storage-adapter/local-storage-adapter')

describe('CurrentAccountAdapter', () => {
  it('Should call LocalStorageAdapter with correct values', () => {
    const account = mockAccountModel()
    const localStorageAdapterSpy = jest.spyOn(
      LocalStorageAdapter.prototype,
      'set'
    )
    setCurrentAccountAdapter(account)
    expect(localStorageAdapterSpy).toHaveBeenCalledWith('account', account)
  })
})
