import React from 'react'
import faker from 'faker'
import { fireEvent, render, RenderResult } from '@testing-library/react'
import Context from '@/presentation/contexts/form/form-context'
import Input from './input'

let field: string = faker.database.column()

type SutTypes = {
  sut: RenderResult
}

const makeSut = (): SutTypes => {
  const sut = render(
    <Context.Provider value={{ state: {} }}>
      <Input name={field} />
    </Context.Provider>
  )

  return {
    sut,
  }
}

describe('InputComponent', () => {
  beforeEach(() => {
    field = faker.database.column()
  })

  it('Should begin with readOnly', () => {
    const { sut } = makeSut()
    const input = sut.getByTestId(field) as HTMLInputElement
    expect(input.readOnly).toBeTruthy()
  })

  it('Should remove readOnly on focus', () => {
    const { sut } = makeSut()
    const input = sut.getByTestId(field) as HTMLInputElement
    fireEvent.focus(input)
    expect(input.readOnly).toBeFalsy()
  })
})
