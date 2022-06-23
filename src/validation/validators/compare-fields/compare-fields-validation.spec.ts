import faker from 'faker'

import { InvalidFieldError } from '@/validation/errors'
import { CompareFieldsValidation } from './compare-fields-validation'

let field: string = faker.database.column()
let fieldToCompare: string = faker.database.column()

type SutTypes = {
  sut: CompareFieldsValidation
}

const makeSut = (): SutTypes => {
  const sut = new CompareFieldsValidation(field, fieldToCompare)

  return {
    sut,
  }
}

describe('CompareFieldsValidation', () => {
  beforeEach(() => {
    field = faker.database.column()
    fieldToCompare = faker.database.column()
  })

  it('Should return error if compare is invalid', () => {
    const { sut } = makeSut()
    const error = sut.validate({
      [field]: faker.random.word(),
      [fieldToCompare]: faker.datatype.uuid(),
    })
    expect(error).toEqual(new InvalidFieldError(field))
  })

  it('Should falsy if compare is valid', () => {
    const fieldsValue = faker.random.word()
    const { sut } = makeSut()
    const error = sut.validate({
      [field]: fieldsValue,
      [fieldToCompare]: fieldsValue,
    })
    expect(error).toBeFalsy()
  })
})
