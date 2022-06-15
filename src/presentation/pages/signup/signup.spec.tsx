import React from 'react'
import faker from 'faker'
import { Router } from 'react-router-dom'
import { createMemoryHistory } from 'history'
import {
  cleanup,
  fireEvent,
  render,
  RenderResult,
  waitFor,
} from '@testing-library/react'
import {
  AddAccountSpy,
  populateInputField,
  testButtonIsDisabled,
  testChildCount,
  testElementExists,
  testElementText,
  testStatusForField,
  ValidationStub,
} from '@/presentation/test'
import { InvalidCredentialsError } from '@/domain/erros'
import SignUp from './signup'

type SutTypes = {
  sut: RenderResult
  addAccountSpy: AddAccountSpy
}

type SutParams = {
  validationError: string
}

const history = createMemoryHistory({ initialEntries: ['/signup'] }) as any
const makeSut = (params?: SutParams): SutTypes => {
  const addAccountSpy = new AddAccountSpy()
  const validationStub = new ValidationStub()
  validationStub.errorMessage = params?.validationError
  const sut = render(
    <Router history={history}>
      <SignUp validation={validationStub} addAccount={addAccountSpy} />
    </Router>
  )

  return {
    sut,
    addAccountSpy,
  }
}

const simulateValidSubmit = (
  sut: RenderResult,
  name = faker.name.findName(),
  email = faker.internet.email(),
  password = faker.internet.password()
): void => {
  const button = sut.getByTestId('submit') as HTMLButtonElement
  populateInputField(sut, 'name', name)
  populateInputField(sut, 'email', email)
  populateInputField(sut, 'password', password)
  populateInputField(sut, 'passwordConfirmation', password)

  fireEvent.click(button)
}

describe('SignUpComponent', () => {
  afterEach(cleanup)

  it('Should start with initial state', () => {
    const validationError = faker.random.words()
    const { sut } = makeSut({
      validationError,
    })

    testButtonIsDisabled(sut, 'submit', true)
    testChildCount(sut, 'error-wrap', 0)
    testStatusForField(sut, 'name', validationError)
    testStatusForField(sut, 'email', validationError)
    testStatusForField(sut, 'password', validationError)
    testStatusForField(sut, 'passwordConfirmation', validationError)
  })

  it('Should show name error if Validation fails', () => {
    const validationError = faker.random.words()
    const { sut } = makeSut({
      validationError,
    })
    populateInputField(sut, 'name', faker.name.findName())
    testStatusForField(sut, 'name', validationError)
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
    populateInputField(sut, 'password', faker.internet.email())
    testStatusForField(sut, 'password', validationError)
  })

  it('Should show passwordConfirmation error if Validation fails', () => {
    const validationError = faker.random.words()
    const { sut } = makeSut({
      validationError,
    })
    populateInputField(sut, 'passwordConfirmation', faker.internet.email())
    testStatusForField(sut, 'passwordConfirmation', validationError)
  })

  it('Should show valid name state if Validation succeds', () => {
    const { sut } = makeSut()
    populateInputField(sut, 'name', faker.name.findName())
    testStatusForField(sut, 'name')
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

  it('Should show valid passwordConfirmation state if Validation succeds', () => {
    const { sut } = makeSut()
    populateInputField(sut, 'passwordConfirmation', faker.internet.password())
    testStatusForField(sut, 'passwordConfirmation')
  })

  it('Should enable submit button if form is valid', () => {
    const { sut } = makeSut()
    populateInputField(sut, 'name', faker.name.findName())
    populateInputField(sut, 'email', faker.internet.email())
    populateInputField(sut, 'password', faker.internet.password())
    populateInputField(sut, 'passwordConfirmation', faker.internet.password())
    testButtonIsDisabled(sut, 'submit', false)
  })

  it('Should show spinner on submit', () => {
    const { sut } = makeSut()
    simulateValidSubmit(sut)
    testElementExists(sut, 'spinner')
  })

  it('Should call AddAccount with correct values', () => {
    const { sut, addAccountSpy } = makeSut()
    const name = faker.name.findName()
    const email = faker.internet.email()
    const password = faker.internet.password()
    simulateValidSubmit(sut, name, email, password)

    expect(addAccountSpy.params).toEqual({
      name,
      email,
      password,
      passwordConfirmation: password,
    })
  })

  it('Should call AddAccount only once', () => {
    const { sut, addAccountSpy } = makeSut()
    simulateValidSubmit(sut)
    simulateValidSubmit(sut)

    expect(addAccountSpy.callsCount).toBe(1)
  })

  it('Should not call AddAccount if form is invalid', () => {
    const validationError = faker.random.words()
    const { sut, addAccountSpy } = makeSut({
      validationError,
    })
    populateInputField(sut, 'email', faker.internet.email())
    fireEvent.submit(sut.getByTestId('form'))

    expect(addAccountSpy.callsCount).toBe(0)
  })

  it('Should present error if AddAccount fails', async () => {
    const { sut, addAccountSpy } = makeSut()
    const error = new InvalidCredentialsError()
    jest.spyOn(addAccountSpy, 'add').mockReturnValueOnce(Promise.reject(error))

    await waitFor(() => simulateValidSubmit(sut))

    testElementText(sut, 'error-wrap', error.message)
    testChildCount(sut, 'error-wrap', 1)
  })
})
