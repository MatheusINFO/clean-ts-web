import React from 'react'
import { Router } from 'react-router-dom'
import { createMemoryHistory } from 'history'
import faker from 'faker'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
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

  render(
    <ApiContext.Provider value={{ setCurrentAccount: setCurrentAccountMock }}>
      <Router history={history}>
        <Login validation={validationStub} authentication={authenticationSpy} />
      </Router>
    </ApiContext.Provider>
  )

  return {
    authenticationSpy,
    setCurrentAccountMock,
  }
}

const simulateValidSubmit = (
  email = faker.internet.email(),
  password = faker.internet.password()
): void => {
  const button = screen.getByTestId('submit') as HTMLButtonElement
  populateInputField('email', email)
  populateInputField('password', password)

  fireEvent.click(button)
}

describe('LoginComponent', () => {
  it('Should start with initial state', () => {
    const validationError = faker.random.words()
    makeSut({
      validationError,
    })

    testButtonIsDisabled('submit', true)
    testChildCount('error-wrap', 0)
    testStatusForField('email', validationError)
    testStatusForField('password', validationError)
  })

  it('Should show email error if Validation fails', () => {
    const validationError = faker.random.words()
    makeSut({
      validationError,
    })
    populateInputField('email', faker.internet.email())
    testStatusForField('email', validationError)
  })

  it('Should show password error if Validation fails', () => {
    const validationError = faker.random.words()
    makeSut({
      validationError,
    })
    populateInputField('password', faker.internet.password())
    testStatusForField('password', validationError)
  })

  it('Should show valid email state if Validation succeds', () => {
    makeSut()
    populateInputField('email', faker.internet.email())
    testStatusForField('email')
  })

  it('Should show valid password state if Validation succeds', () => {
    makeSut()
    populateInputField('password', faker.internet.password())
    testStatusForField('password')
  })

  it('Should enable submit button if form is valid', () => {
    makeSut()
    populateInputField('email', faker.internet.email())
    populateInputField('password', faker.internet.password())
    testButtonIsDisabled('submit', false)
  })

  it('Should show spinner on submit', () => {
    makeSut()
    simulateValidSubmit()
    testElementExists('spinner')
  })

  it('Should call Authentication with correct values', () => {
    const { authenticationSpy } = makeSut()
    const email = faker.internet.email()
    const password = faker.internet.password()
    simulateValidSubmit(email, password)

    expect(authenticationSpy.params).toEqual({
      email,
      password,
    })
  })

  it('Should call Authentication only once', () => {
    const { authenticationSpy } = makeSut()
    simulateValidSubmit()
    simulateValidSubmit()

    expect(authenticationSpy.callsCount).toBe(1)
  })

  it('Should not call Authentication if form is invalid', () => {
    const validationError = faker.random.words()
    const { authenticationSpy } = makeSut({
      validationError,
    })
    populateInputField('email', faker.internet.email())
    fireEvent.submit(screen.getByTestId('form'))

    expect(authenticationSpy.callsCount).toBe(0)
  })

  it('Should present error if Authentication fails', async () => {
    const { authenticationSpy } = makeSut()
    const error = new InvalidCredentialsError()
    jest.spyOn(authenticationSpy, 'auth').mockRejectedValueOnce(error)

    await waitFor(() => simulateValidSubmit())

    testElementText('error-wrap', error.message)
    testChildCount('error-wrap', 1)
  })

  it('Shoul call setCurrentAccount on success and move to correct page', async () => {
    const { authenticationSpy, setCurrentAccountMock } = makeSut()
    await waitFor(() => simulateValidSubmit())
    expect(setCurrentAccountMock).toHaveBeenCalledWith(
      authenticationSpy.account
    )
    expect(history.length).toBe(1)
    expect(history.location.pathname).toBe('/')
  })

  it('Should go to signup page', async () => {
    makeSut()
    const signupLink = screen.getByTestId('signup-link')
    fireEvent.click(signupLink)
    expect(history.length).toBe(1)
    expect(history.location.pathname).toBe('/signup')
  })
})
