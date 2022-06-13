import faker from 'faker'
import { ValidationBuilder } from './validation-builder'
import {
  EmailValidation,
  MinLengthValidation,
  RequiredFieldValidation,
} from '@/validation/validators'

describe('ValidationBuilder', () => {
  it('Should return RequiredFieldValidation', () => {
    const field = faker.database.column()
    const validations = ValidationBuilder.field(field).required().build()
    expect(validations).toEqual([new RequiredFieldValidation(field)])
  })

  it('Should return EmailValidation', () => {
    const field = faker.database.column()
    const validations = ValidationBuilder.field(field).email().build()
    expect(validations).toEqual([new EmailValidation(field)])
  })

  it('Should return MinLengthValidation', () => {
    const length = 3
    const field = faker.database.column()
    const validations = ValidationBuilder.field(field).min(length).build()
    expect(validations).toEqual([new MinLengthValidation(field, length)])
  })

  it('Should return a list of validations', () => {
    const length = 3
    const field = faker.database.column()
    const validations = ValidationBuilder.field(field)
      .required()
      .min(length)
      .email()
      .build()
    expect(validations).toEqual([
      new RequiredFieldValidation(field),
      new MinLengthValidation(field, length),
      new EmailValidation(field),
    ])
  })
})
