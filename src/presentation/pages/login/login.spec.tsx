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
    expect(errorWrap.childElementCount).toBe(0)
    expect(button.disabled).toBeTruthy()
  })
})
