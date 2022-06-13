import React from 'react'
import { render, RenderResult } from '@testing-library/react'
import Context from '@/presentation/contexts/form/form-context'
import Input from './input'

type SutTypes = {
  sut: RenderResult
}

const makeSut = (): SutTypes => {
  const sut = render(
    <Context.Provider value={{ state: {} }}>
      <Input name="field" />
    </Context.Provider>
  )

  return {
    sut,
  }
}

describe('InputComponent', () => {
  it('Should begin with readOnly', () => {
    const { sut } = makeSut()
    const input = sut.getByTestId('field') as HTMLInputElement
    expect(input.readOnly).toBeTruthy()
  })
})
