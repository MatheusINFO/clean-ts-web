import faker from 'faker'
import { RequiredFieldValidation } from './required-field-validation'
import { RequiredFieldError } from '@/validation/errors'

type SutTypes = {
  sut: RequiredFieldValidation
}

const makeSut = (): SutTypes => {
  const sut = new RequiredFieldValidation(faker.database.column())

  return {
    sut,
  }
}

describe('RequiredFieldValidation', () => {
  it('Should return error if field is empty', () => {
    const { sut } = makeSut()
    const error = sut.validate('')
    expect(error).toEqual(new RequiredFieldError())
  })

  it('Should return false if field is not empty', () => {
    const { sut } = makeSut()
    const error = sut.validate(faker.random.word())
    expect(error).toBeFalsy()
  })
})
