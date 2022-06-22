import React from 'react'
import faker from 'faker'
import { Router } from 'react-router-dom'
import { createMemoryHistory } from 'history'
import {
  fireEvent,
  render,
  RenderResult,
  waitFor,
  screen,
} from '@testing-library/react'
import {
  AddAccountSpy,
  populateInputField,
  testStatusForField,
  ValidationStub,
} from '@/presentation/test'
import { EmailInUseError } from '@/domain/erros'
import { ApiContext } from '@/presentation/contexts'
import SignUp from './signup'
import { AddAccount } from '@/domain/usecases'
import { RecoilRoot } from 'recoil'

type SutTypes = {
  sut: RenderResult
  addAccountSpy: AddAccountSpy
  setCurrentAccountMock: (account: AddAccount.Params) => void
  history: any
}

type SutParams = {
  validationError: string
}

const makeSut = (params?: SutParams): SutTypes => {
  const history = createMemoryHistory({ initialEntries: ['/signup'] }) as any
  const addAccountSpy = new AddAccountSpy()
  const validationStub = new ValidationStub()
  validationStub.errorMessage = params?.validationError
  const setCurrentAccountMock = jest.fn()

  const sut = render(
    <RecoilRoot>
      <ApiContext.Provider value={{ setCurrentAccount: setCurrentAccountMock }}>
        <Router history={history}>
          <SignUp validation={validationStub} addAccount={addAccountSpy} />
        </Router>
      </ApiContext.Provider>
    </RecoilRoot>
  )

  return {
    sut,
    addAccountSpy,
    setCurrentAccountMock,
    history,
  }
}

const simulateValidSubmit = (
  name = faker.name.findName(),
  email = faker.internet.email(),
  password = faker.internet.password()
): void => {
  const button = screen.getByTestId('submit') as HTMLButtonElement
  populateInputField('name', name)
  populateInputField('email', email)
  populateInputField('password', password)
  populateInputField('passwordConfirmation', password)

  fireEvent.click(button)
}

describe('SignUpComponent', () => {
  it('Should start with initial state', () => {
    const validationError = faker.random.words()
    makeSut({
      validationError,
    })

    expect(screen.getByTestId('submit')).toBeDisabled()
    expect(screen.getByTestId('error-wrap').children).toHaveLength(0)
    testStatusForField('name', validationError)
    testStatusForField('email', validationError)
    testStatusForField('password', validationError)
    testStatusForField('passwordConfirmation', validationError)
  })

  it('Should show name error if Validation fails', () => {
    const validationError = faker.random.words()
    makeSut({
      validationError,
    })
    populateInputField('name', faker.name.findName())
    testStatusForField('name', validationError)
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
    populateInputField('password', faker.internet.email())
    testStatusForField('password', validationError)
  })

  it('Should show passwordConfirmation error if Validation fails', () => {
    const validationError = faker.random.words()
    makeSut({
      validationError,
    })
    populateInputField('passwordConfirmation', faker.internet.email())
    testStatusForField('passwordConfirmation', validationError)
  })

  it('Should show valid name state if Validation succeds', () => {
    makeSut()
    populateInputField('name', faker.name.findName())
    testStatusForField('name')
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

  it('Should show valid passwordConfirmation state if Validation succeds', () => {
    makeSut()
    populateInputField('passwordConfirmation', faker.internet.password())
    testStatusForField('passwordConfirmation')
  })

  it('Should enable submit button if form is valid', () => {
    makeSut()
    populateInputField('name', faker.name.findName())
    populateInputField('email', faker.internet.email())
    populateInputField('password', faker.internet.password())
    populateInputField('passwordConfirmation', faker.internet.password())
    expect(screen.getByTestId('submit')).toBeEnabled()
  })

  it('Should show spinner on submit', () => {
    makeSut()
    simulateValidSubmit()
    expect(screen.queryByTestId('spinner')).toBeInTheDocument()
  })

  it('Should call AddAccount with correct values', () => {
    const { addAccountSpy } = makeSut()
    const name = faker.name.findName()
    const email = faker.internet.email()
    const password = faker.internet.password()
    simulateValidSubmit(name, email, password)

    expect(addAccountSpy.params).toEqual({
      name,
      email,
      password,
      passwordConfirmation: password,
    })
  })

  it('Should call AddAccount only once', () => {
    const { addAccountSpy } = makeSut()
    simulateValidSubmit()
    simulateValidSubmit()

    expect(addAccountSpy.callsCount).toBe(1)
  })

  it('Should not call AddAccount if form is invalid', () => {
    const validationError = faker.random.words()
    const { addAccountSpy } = makeSut({
      validationError,
    })
    populateInputField('email', faker.internet.email())
    fireEvent.submit(screen.getByTestId('form'))

    expect(addAccountSpy.callsCount).toBe(0)
  })

  it('Should present error if AddAccount fails', async () => {
    const { addAccountSpy } = makeSut()
    const error = new EmailInUseError()
    jest.spyOn(addAccountSpy, 'add').mockRejectedValueOnce(error)

    await waitFor(() => simulateValidSubmit())

    expect(screen.getByTestId('error-wrap')).toHaveTextContent(error.message)
    expect(screen.getByTestId('error-wrap').children).toHaveLength(1)
  })

  it('Shoul call setCurrentAccount on success and move to correct page', async () => {
    const { history, addAccountSpy, setCurrentAccountMock } = makeSut()
    await waitFor(() => simulateValidSubmit())
    expect(setCurrentAccountMock).toHaveBeenCalledWith(addAccountSpy.account)
    expect(history.length).toBe(1)
    expect(history.location.pathname).toBe('/')
  })

  it('Should go to login page', async () => {
    const { history } = makeSut()
    const loginLink = screen.getByTestId('login-link')
    fireEvent.click(loginLink)
    expect(history.length).toBe(1)
    expect(history.location.pathname).toBe('/login')
  })
})
