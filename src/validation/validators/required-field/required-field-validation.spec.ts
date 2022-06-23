import faker from 'faker'

import { RequiredFieldError } from '@/validation/errors'
import { RequiredFieldValidation } from './required-field-validation'

let field: string = faker.database.column()

type SutTypes = {
  sut: RequiredFieldValidation
}

const makeSut = (): SutTypes => {
  const sut = new RequiredFieldValidation(field)

  return {
    sut,
  }
}

describe('RequiredFieldValidation', () => {
  beforeEach(() => {
    field = faker.database.column()
  })

  it('Should return error if field is empty', () => {
    const { sut } = makeSut()
    const error = sut.validate({ field: '' })
    expect(error).toEqual(new RequiredFieldError())
  })

  it('Should return false if field is not empty', () => {
    const { sut } = makeSut()
    const error = sut.validate({ [field]: faker.random.word() })
    expect(error).toBeFalsy()
  })
})
