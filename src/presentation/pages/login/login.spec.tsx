import React from 'react'
import { render, RenderResult } from '@testing-library/react'
import Login from './login'

type SutTypes = {
  sut: RenderResult
}

const makeSut = (): SutTypes => {
  const sut = render(<Login />)
  return {
    sut,
  }
}

describe('LoginComponent', () => {
  it('Should start with initial state', () => {
    const { sut } = makeSut()
    const errorWrap = sut.getByTestId('error-wrap')
    const button = sut.getByTestId('submit') as HTMLButtonElement
    const emailStatus = sut.getByTestId('email-status')
    const passwordStatus = sut.getByTestId('password-status')

    expect(errorWrap.childElementCount).toBe(0)
    expect(button.disabled).toBeTruthy()
    expect(emailStatus.title).toBe('Campo obrigatório')
    expect(emailStatus.textContent).toBe('🙁')
    expect(passwordStatus.title).toBe('Campo obrigatório')
    expect(passwordStatus.textContent).toBe('🙁')
  })
})
