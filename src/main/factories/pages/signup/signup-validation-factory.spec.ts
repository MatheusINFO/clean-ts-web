import { makeSignUpValidationFactory } from './signup-validation-factory'
import { ValidationBuilder, ValidationComposite } from '@/validation/validators'

describe('SignUpValidationFactory', () => {
  it('Should make ValidationComposite with correct validations', () => {
    const composite = makeSignUpValidationFactory()
    expect(composite).toEqual(
      ValidationComposite.build([
        ...ValidationBuilder.field('name').required().min(3).build(),
        ...ValidationBuilder.field('email').required().email().build(),
        ...ValidationBuilder.field('password').required().min(5).build(),
        ...ValidationBuilder.field('passwordConfirmation')
          .required()
          .min(5)
          .sameAs('password')
          .build(),
      ])
    )
  })
})
