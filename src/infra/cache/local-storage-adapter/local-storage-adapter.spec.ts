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
      const value = faker.random.objectElement<{}>()
      sut.set(key, value)
      expect(localStorage.setItem).toHaveBeenCalledWith(
        key,
        JSON.stringify(value)
      )
    })

    it('Should remove localStorage if value is null', () => {
      const { sut } = makeSut()
      const key = faker.database.column()
      const value = undefined
      sut.set(key, value)
      expect(localStorage.removeItem).toHaveBeenCalledWith(key)
    })
  })

  describe('GET', () => {
    it('Should call localStorage with correct values', () => {
      const { sut } = makeSut()
      const key = faker.database.column()
      const value = faker.random.objectElement<{}>()
      const getItemSpy = jest
        .spyOn(localStorage, 'getItem')
        .mockReturnValueOnce(JSON.stringify(value))

      const object = sut.get(key)

      expect(getItemSpy).toHaveBeenCalledWith(key)
      expect(object).toEqual(value)
    })
  })
})
