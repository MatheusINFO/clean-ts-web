import faker from 'faker'
import { InvalidFieldError } from '@/validation/errors'
import { MinLengthValidation } from './min-length-validation'

let field: string = faker.database.column()

type SutTypes = {
  sut: MinLengthValidation
}

const makeSut = (minLength = 3): SutTypes => {
  const sut = new MinLengthValidation(field, minLength)

  return {
    sut,
  }
}

describe('MinLengthValidation', () => {
  beforeEach(() => {
    field = faker.database.column()
  })

  it('Should return error if value is invalid', () => {
    const { sut } = makeSut(5)
    const error = sut.validate(faker.random.alphaNumeric(4))
    expect(error).toEqual(new InvalidFieldError(field))
  })

  it('Should return falsy if value is valid', () => {
    const { sut } = makeSut()
    const error = sut.validate(faker.random.alphaNumeric(3))
    expect(error).toBeFalsy()
  })
})
