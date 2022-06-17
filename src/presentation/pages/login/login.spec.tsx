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
import { ApiContext } from '@/presentation/contexts'
import {
  ValidationStub,
  AuthenticationSpy,
  testButtonIsDisabled,
  testChildCount,
  testStatusForField,
  populateInputField,
  testElementExists,
  testElementText,
} from '@/presentation/test'
import { InvalidCredentialsError } from '@/domain/erros'
import { AccountModel } from '@/domain/models'

type SutTypes = {
  sut: RenderResult
  authenticationSpy: AuthenticationSpy
  setCurrentAccountMock: (account: AccountModel) => void
}

type SutParams = {
  validationError: string
}

const history = createMemoryHistory({ initialEntries: ['/login'] }) as any
const makeSut = (params?: SutParams): SutTypes => {
  const validationStub = new ValidationStub()
  const authenticationSpy = new AuthenticationSpy()
  validationStub.errorMessage = params?.validationError
  const setCurrentAccountMock = jest.fn()

  const sut = render(
    <ApiContext.Provider value={{ setCurrentAccount: setCurrentAccountMock }}>
      <Router history={history}>
        <Login validation={validationStub} authentication={authenticationSpy} />
      </Router>
    </ApiContext.Provider>
  )

  return {
    sut,
    authenticationSpy,
    setCurrentAccountMock,
  }
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
  afterEach(cleanup)

  it('Should start with initial state', () => {
    const validationError = faker.random.words()
    const { sut } = makeSut({
      validationError,
    })

    testButtonIsDisabled(sut, 'submit', true)
    testChildCount(sut, 'error-wrap', 0)
    testStatusForField(sut, 'email', validationError)
    testStatusForField(sut, 'password', validationError)
  })

  it('Should show email error if Validation fails', () => {
    const validationError = faker.random.words()
    const { sut } = makeSut({
      validationError,
    })
    populateInputField(sut, 'email', faker.internet.email())
    testStatusForField(sut, 'email', validationError)
  })

  it('Should show password error if Validation fails', () => {
    const validationError = faker.random.words()
    const { sut } = makeSut({
      validationError,
    })
    populateInputField(sut, 'password', faker.internet.password())
    testStatusForField(sut, 'password', validationError)
  })

  it('Should show valid email state if Validation succeds', () => {
    const { sut } = makeSut()
    populateInputField(sut, 'email', faker.internet.email())
    testStatusForField(sut, 'email')
  })

  it('Should show valid password state if Validation succeds', () => {
    const { sut } = makeSut()
    populateInputField(sut, 'password', faker.internet.password())
    testStatusForField(sut, 'password')
  })

  it('Should enable submit button if form is valid', () => {
    const { sut } = makeSut()
    populateInputField(sut, 'email', faker.internet.email())
    populateInputField(sut, 'password', faker.internet.password())
    testButtonIsDisabled(sut, 'submit', false)
  })

  it('Should show spinner on submit', () => {
    const { sut } = makeSut()
    simulateValidSubmit(sut)
    testElementExists(sut, 'spinner')
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
    jest.spyOn(authenticationSpy, 'auth').mockRejectedValueOnce(error)

    await waitFor(() => simulateValidSubmit(sut))

    testElementText(sut, 'error-wrap', error.message)
    testChildCount(sut, 'error-wrap', 1)
  })

  it('Shoul call setCurrentAccount on success and move to correct page', async () => {
    const { sut, authenticationSpy, setCurrentAccountMock } = makeSut()
    await waitFor(() => simulateValidSubmit(sut))
    expect(setCurrentAccountMock).toHaveBeenCalledWith(
      authenticationSpy.account
    )
    expect(history.length).toBe(1)
    expect(history.location.pathname).toBe('/')
  })

  it('Should go to signup page', async () => {
    const { sut } = makeSut()
    const signupLink = sut.getByTestId('signup-link')
    fireEvent.click(signupLink)
    expect(history.length).toBe(1)
    expect(history.location.pathname).toBe('/signup')
  })
})
