import 'jest-localstorage-mock'
import React from 'react'
import { Router } from 'react-router-dom'
import { createMemoryHistory } from 'history'
import faker from 'faker'
import {
  render,
  RenderResult,
  fireEvent,
  cleanup,
  waitFor,
} from '@testing-library/react'
import Login from './login'
import { ValidationStub, AuthenticationSpy } from '@/presentation/test'
import { InvalidCredentialsError } from '@/domain/erros'

type SutTypes = {
  sut: RenderResult
  authenticationSpy: AuthenticationSpy
}

type SutParams = {
  validationError: string
}

const history = createMemoryHistory({ initialEntries: ['/login'] })
const makeSut = (params?: SutParams): SutTypes => {
  const authenticationSpy = new AuthenticationSpy()
  const validationStub = new ValidationStub()
  validationStub.errorMessage = params?.validationError
  const sut = render(
    <Router history={history}>
      <Login validation={validationStub} authentication={authenticationSpy} />
    </Router>
  )

  return {
    sut,
    authenticationSpy,
  }
}

const simulateStatusForField = (
  sut: RenderResult,
  fieldName: string,
  validationError?: string
): void => {
  const fieldStatus = sut.getByTestId(`${fieldName}-status`)

  expect(fieldStatus.title).toBe(validationError || 'Tudo certo!')
  expect(fieldStatus.textContent).toBe(validationError ? '🙁' : '🙂')
}

const populateInputField = (
  sut: RenderResult,
  fieldName: string,
  fieldValue: string
): void => {
  const input = sut.getByTestId(fieldName)

  fireEvent.input(input, {
    target: { value: fieldValue },
  })
}

const simulateValidSubmit = (
  sut: RenderResult,
  email = faker.internet.email(),
  password = faker.internet.password()
): void => {
  const button = sut.getByTestId('submit') as HTMLButtonElement
  populateInputField(sut, 'email', email)
  populateInputField(sut, 'password', password)

  fireEvent.click(button)
}

describe('LoginComponent', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  afterEach(cleanup)

  it('Should start with initial state', () => {
    const validationError = faker.random.words()
    const { sut } = makeSut({
      validationError,
    })
    const errorWrap = sut.getByTestId('error-wrap')
    const button = sut.getByTestId('submit') as HTMLButtonElement

    expect(errorWrap.childElementCount).toBe(0)
    expect(button.disabled).toBeTruthy()
    simulateStatusForField(sut, 'email', validationError)
    simulateStatusForField(sut, 'password', validationError)
  })

  it('Should show email error if Validation fails', () => {
    const validationError = faker.random.words()
    const { sut } = makeSut({
      validationError,
    })
    populateInputField(sut, 'email', faker.internet.email())
    simulateStatusForField(sut, 'email', validationError)
  })

  it('Should show password error if Validation fails', () => {
    const validationError = faker.random.words()
    const { sut } = makeSut({
      validationError,
    })
    populateInputField(sut, 'password', faker.internet.password())
    simulateStatusForField(sut, 'password', validationError)
  })

  it('Should show valid email state if Validation succeds', () => {
    const { sut } = makeSut()
    populateInputField(sut, 'email', faker.internet.email())
    simulateStatusForField(sut, 'email')
  })

  it('Should show valid password state if Validation succeds', () => {
    const { sut } = makeSut()
    populateInputField(sut, 'password', faker.internet.password())
    simulateStatusForField(sut, 'password')
  })

  it('Should enable submit button if form is valid', () => {
    const { sut } = makeSut()
    const button = sut.getByTestId('submit') as HTMLButtonElement
    populateInputField(sut, 'email', faker.internet.email())
    populateInputField(sut, 'password', faker.internet.password())

    expect(button.disabled).toBeFalsy()
  })

  it('Should show spinner on submit', () => {
    const { sut } = makeSut()
    simulateValidSubmit(sut)
    const spinner = sut.getByTestId('spinner')
    expect(spinner).toBeTruthy()
  })

  it('Should call Authentication with correct values', () => {
    const { sut, authenticationSpy } = makeSut()
    const email = faker.internet.email()
    const password = faker.internet.password()
    simulateValidSubmit(sut, email, password)

    expect(authenticationSpy.params).toEqual({
      email,
      password,
    })
  })

  it('Should call Authentication only once', () => {
    const { sut, authenticationSpy } = makeSut()
    simulateValidSubmit(sut)
    simulateValidSubmit(sut)

    expect(authenticationSpy.callsCount).toBe(1)
  })

  it('Should not call Authentication if form is invalid', () => {
    const validationError = faker.random.words()
    const { sut, authenticationSpy } = makeSut({
      validationError,
    })
    populateInputField(sut, 'email', faker.internet.email())
    fireEvent.submit(sut.getByTestId('form'))

    expect(authenticationSpy.callsCount).toBe(0)
  })

  it('Should present error if Authentication fails', async () => {
    const { sut, authenticationSpy } = makeSut()
    const error = new InvalidCredentialsError()
    jest
      .spyOn(authenticationSpy, 'auth')
      .mockReturnValueOnce(Promise.reject(error))

    await waitFor(() => simulateValidSubmit(sut))

    const mainError = sut.getByTestId('main-error')
    const errorWrap = sut.getByTestId('error-wrap')

    expect(mainError.textContent).toBe(error.message)
    expect(errorWrap.childElementCount).toBe(1)
  })

  it('Should add accessToken to localstorage on success and move to correct page', async () => {
    const { sut, authenticationSpy } = makeSut()
    await waitFor(() => simulateValidSubmit(sut))
    expect(localStorage.setItem).toHaveBeenCalledWith(
      'accessToken',
      authenticationSpy.account.accesstoken
    )
    expect(history.length).toBe(1)
    expect(history.location.pathname).toBe('/')
  })

  it('Should go to signup page', async () => {
    const { sut } = makeSut()
    const signup = sut.getByTestId('signup')
    fireEvent.click(signup)
    expect(history.length).toBe(2)
    expect(history.location.pathname).toBe('/signup')
  })
})
