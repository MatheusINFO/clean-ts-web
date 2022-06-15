import { ValidationBuilder, ValidationComposite } from '@/validation/validators'

export const makeSignUpValidationFactory = (): ValidationComposite => {
  return ValidationComposite.build([
    ...ValidationBuilder.field('name').required().min(3).build(),
    ...ValidationBuilder.field('email').required().email().build(),
    ...ValidationBuilder.field('password').required().min(5).build(),
    ...ValidationBuilder.field('passwordConfirmation')
      .required()
      .min(5)
      .sameAs('password')
      .build(),
  ])
}
