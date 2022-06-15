import React from 'react'
import { Router } from 'react-router-dom'
import { createMemoryHistory } from 'history'
import { render, RenderResult } from '@testing-library/react'
import SignUp from './signup'

type SutTypes = {
  sut: RenderResult
}

const history = createMemoryHistory({ initialEntries: ['/signup'] }) as any
const makeSut = (): SutTypes => {
  const sut = render(
    <Router history={history}>
      <SignUp />
    </Router>
  )

  return {
    sut,
  }
}

const testChildCount = (
  sut: RenderResult,
  fieldName: string,
  quantity: number
): void => {
  const element = sut.getByTestId(fieldName)
  expect(element.childElementCount).toBe(quantity)
}

const testButtonIsDisabled = (
  sut: RenderResult,
  fieldName: string,
  isDisabled: boolean
): void => {
  const button = sut.getByTestId(fieldName) as HTMLButtonElement
  expect(button.disabled).toBe(isDisabled)
}

const testStatusForField = (
  sut: RenderResult,
  fieldName: string,
  validationError?: string
): void => {
  const fieldStatus = sut.getByTestId(`${fieldName}-status`)

  expect(fieldStatus.title).toBe(validationError || 'Tudo certo!')
  expect(fieldStatus.textContent).toBe(validationError ? '🙁' : '🙂')
}

describe('SignUpComponent', () => {
  it('Should start with initial state', () => {
    const validationError = 'Campo obrigatório'
    const { sut } = makeSut()

    testButtonIsDisabled(sut, 'submit', true)
    testChildCount(sut, 'error-wrap', 0)
    testStatusForField(sut, 'name', validationError)
    testStatusForField(sut, 'email', validationError)
    testStatusForField(sut, 'password', validationError)
    testStatusForField(sut, 'passwordConfirmation', validationError)
  })
})
