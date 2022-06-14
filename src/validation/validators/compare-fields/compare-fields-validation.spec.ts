import faker from 'faker'
import { InvalidFieldError } from '@/validation/errors'
import { CompareFieldsValidation } from './compare-fields-validation'

let field: string = faker.database.column()
let valueToCompare: string = faker.database.column()

type SutTypes = {
  sut: CompareFieldsValidation
}

const makeSut = (): SutTypes => {
  const sut = new CompareFieldsValidation(field, valueToCompare)

  return {
    sut,
  }
}

describe('CompareFieldsValidation', () => {
  beforeEach(() => {
    field = faker.database.column()
    valueToCompare = faker.database.column()
  })

  it('Should return error if compare is invalid', () => {
    const { sut } = makeSut()
    const error = sut.validate(faker.random.word())
    expect(error).toEqual(new InvalidFieldError(field))
  })

  it('Should falsy if compare is valid', () => {
    const { sut } = makeSut()
    const error = sut.validate(valueToCompare)
    expect(error).toBeFalsy()
  })
})
