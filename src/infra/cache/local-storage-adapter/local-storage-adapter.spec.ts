import 'jest-localstorage-mock'
import faker from 'faker'
import { LocalStorageAdapter } from './local-storage-adapter'

type SutTypes = {
  sut: LocalStorageAdapter
}

const makeSut = (): SutTypes => {
  const sut = new LocalStorageAdapter()

  return {
    sut,
  }
}

describe('LocalStorageAdapter', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  describe('SET', () => {
    it('Should call localStorage with correct values', () => {
      const { sut } = makeSut()
      const key = faker.database.column()
      const value = faker.random.word()
      sut.set(key, value)
      expect(localStorage.setItem).toHaveBeenCalledWith(key, value)
    })
  })
})
