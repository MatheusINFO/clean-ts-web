import faker from 'faker'

import { FieldValidationSpy } from '@/validation/test'
import { ValidationComposite } from './validation-composite'

let field: string = faker.random.word()

type SutTypes = {
  sut: ValidationComposite
  fieldValidationsSpy: FieldValidationSpy[]
}

const makeSut = (): SutTypes => {
  const fieldValidationsSpy = [
    new FieldValidationSpy(field),
    new FieldValidationSpy(field),
  ]
  const sut = ValidationComposite.build(fieldValidationsSpy)

  return {
    sut,
    fieldValidationsSpy,
  }
}

describe('ValidationComposite', () => {
  beforeEach(() => {
    field = faker.random.word()
  })

  it('Should return error if any validation fails', () => {
    const { sut, fieldValidationsSpy } = makeSut()
    const errorMessage = faker.random.words()
    fieldValidationsSpy[0].error = new Error(errorMessage)
    fieldValidationsSpy[1].error = new Error(faker.random.words())
    const error = sut.validate(field, { [field]: faker.random.words() })
    expect(error).toBe(errorMessage)
  })

  it('Should return void on validations succeds', () => {
    const { sut } = makeSut()
    const error = sut.validate(field, { [field]: faker.random.words() })
    expect(error).toBeUndefined()
  })
})
