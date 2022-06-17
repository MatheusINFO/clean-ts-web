import { SetStorageMock } from '@/data/test'
import { LocalUpdateCurrentAccount } from './local-update-current-account'
import { UnexpectedError } from '@/domain/erros'
import { mockAccountModel } from '@/domain/test'

type SutTypes = {
  sut: LocalUpdateCurrentAccount
  setStorageMock: SetStorageMock
}

const makeSut = (): SutTypes => {
  const setStorageMock = new SetStorageMock()
  const sut = new LocalUpdateCurrentAccount(setStorageMock)
  return {
    sut,
    setStorageMock,
  }
}

describe('LocalUpdateCurrentAccount', () => {
  it('Should call SetStorage with correct value', async () => {
    const { sut, setStorageMock } = makeSut()
    const account = mockAccountModel()
    await sut.update(account)
    expect(setStorageMock.key).toBe('account')
    expect(setStorageMock.value).toBe(JSON.stringify(account))
  })

  it('Should throw if SetStorage throws', async () => {
    const { sut, setStorageMock } = makeSut()
    jest.spyOn(setStorageMock, 'set').mockImplementationOnce(() => {
      throw new Error()
    })
    const promise = sut.update(mockAccountModel())
    await expect(promise).rejects.toThrow(new Error())
  })

  it('Should throw if accesstoken is falsy', async () => {
    const { sut } = makeSut()
    const promise = sut.update(undefined)
    await expect(promise).rejects.toThrow(new UnexpectedError())
  })
})
