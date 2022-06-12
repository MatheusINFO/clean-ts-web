import React from 'react'
import faker from 'faker'
import {
  render,
  RenderResult,
  fireEvent,
  cleanup,
} from '@testing-library/react'
import Login from './login'
import { ValidationStub } from '@/presentation/test'
import { AccountModel } from '@/domain/models'
import { Authentication, AuthenticationParams } from '@/domain/usecases'
import { mockAccountModel } from '@/domain/test'

class AuthenticationSpy implements Authentication {
  account = mockAccountModel()
  params: AuthenticationParams

  async auth(params: AuthenticationParams): Promise<AccountModel> {
    this.params = params
    return this.account
  }
}

type SutTypes = {
  sut: RenderResult
  authenticationSpy: AuthenticationSpy
}

type SutParams = {
  validationError: string
}

const makeSut = (params?: SutParams): SutTypes => {
  const authenticationSpy = new AuthenticationSpy()
  const validationStub = new ValidationStub()
  validationStub.errorMessage = params?.validationError
  const sut = render(
    <Login validation={validationStub} authentication={authenticationSpy} />
  )

  return {
    sut,
    authenticationSpy,
  }
}

describe('LoginComponent', () => {
  afterEach(cleanup)

  it('Should start with initial state', () => {
    const validationError = faker.random.words()
    const { sut } = makeSut({
      validationError,
    })
    const errorWrap = sut.getByTestId('error-wrap')
    const button = sut.getByTestId('submit') as HTMLButtonElement
    const emailStatus = sut.getByTestId('email-status')
    const passwordStatus = sut.getByTestId('password-status')

    expect(errorWrap.childElementCount).toBe(0)
    expect(button.disabled).toBeTruthy()
    expect(emailStatus.title).toBe(validationError)
    expect(emailStatus.textContent).toBe('🙁')
    expect(passwordStatus.title).toBe(validationError)
    expect(passwordStatus.textContent).toBe('🙁')
  })

  it('Should show email error if Validation fails', () => {
    const validationError = faker.random.words()
    const { sut } = makeSut({
      validationError,
    })
    const emailInput = sut.getByTestId('email')
    fireEvent.input(emailInput, { target: { value: faker.internet.email() } })
    const emailStatus = sut.getByTestId('email-status')

    expect(emailStatus.title).toBe(validationError)
    expect(emailStatus.textContent).toBe('🙁')
  })

  it('Should show password error if Validation fails', () => {
    const validationError = faker.random.words()
    const { sut } = makeSut({
      validationError,
    })
    const passwordInput = sut.getByTestId('password')
    fireEvent.input(passwordInput, {
      target: { value: faker.internet.password() },
    })
    const passwordStatus = sut.getByTestId('password-status')

    expect(passwordStatus.title).toBe(validationError)
    expect(passwordStatus.textContent).toBe('🙁')
  })

  it('Should show valid email state if Validation succeds', () => {
    const { sut } = makeSut()
    const emailInput = sut.getByTestId('email')
    fireEvent.input(emailInput, {
      target: { value: faker.internet.email() },
    })
    const emailStatus = sut.getByTestId('email-status')

    expect(emailStatus.title).toBe('Tudo certo!')
    expect(emailStatus.textContent).toBe('🙂')
  })

  it('Should show valid password state if Validation succeds', () => {
    const { sut } = makeSut()
    const passwordInput = sut.getByTestId('password')
    fireEvent.input(passwordInput, {
      target: { value: faker.internet.password() },
    })
    const passwordStatus = sut.getByTestId('password-status')

    expect(passwordStatus.title).toBe('Tudo certo!')
    expect(passwordStatus.textContent).toBe('🙂')
  })

  it('Should enable submit button if form is valid', () => {
    const { sut } = makeSut()
    const button = sut.getByTestId('submit') as HTMLButtonElement
    const passwordInput = sut.getByTestId('password')
    const emailInput = sut.getByTestId('email')
    fireEvent.input(passwordInput, {
      target: { value: faker.internet.password() },
    })
    fireEvent.input(emailInput, {
      target: { value: faker.internet.email() },
    })

    expect(button.disabled).toBeFalsy()
  })

  it('Should show spinner on submit', () => {
    const { sut } = makeSut()
    const button = sut.getByTestId('submit') as HTMLButtonElement
    const passwordInput = sut.getByTestId('password')
    const emailInput = sut.getByTestId('email')
    fireEvent.input(passwordInput, {
      target: { value: faker.internet.password() },
    })
    fireEvent.input(emailInput, {
      target: { value: faker.internet.email() },
    })
    fireEvent.click(button)

    const spinner = sut.getByTestId('spinner')
    expect(spinner).toBeTruthy()
  })

  it('Should call Authentication with correct values', () => {
    const { sut, authenticationSpy } = makeSut()
    const email = faker.internet.email()
    const password = faker.internet.password()
    const button = sut.getByTestId('submit') as HTMLButtonElement
    const passwordInput = sut.getByTestId('password')
    const emailInput = sut.getByTestId('email')
    fireEvent.input(passwordInput, {
      target: { value: password },
    })
    fireEvent.input(emailInput, {
      target: { value: email },
    })
    fireEvent.click(button)

    expect(authenticationSpy.params).toEqual({
      email,
      password,
    })
  })
})
