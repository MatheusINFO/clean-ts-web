import faker from 'faker'
import { InvalidFieldError } from '@/validation/errors'
import { EmailValidation } from './email-validation'

let field: string = faker.database.column()

type SutTypes = {
  sut: EmailValidation
}

const makeSut = (): SutTypes => {
  const sut = new EmailValidation(field)

  return {
    sut,
  }
}

describe('EmailValidation', () => {
  beforeEach(() => {
    field = faker.database.column()
  })

  it('Should return error if email is invalid', () => {
    const { sut } = makeSut()
    const error = sut.validate(faker.random.word())
    expect(error).toEqual(new InvalidFieldError(field))
  })

  it('Should return falsy if email is valid', () => {
    const { sut } = makeSut()
    const error = sut.validate(faker.internet.email())
    expect(error).toBeFalsy()
  })

  it('Should falsy if email is empty', () => {
    const { sut } = makeSut()
    const error = sut.validate(faker.internet.email())
    expect(error).toBeFalsy()
  })
})
