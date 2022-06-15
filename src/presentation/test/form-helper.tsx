import { fireEvent, RenderResult } from '@testing-library/react'

export const testChildCount = (
  sut: RenderResult,
  fieldName: string,
  quantity: number
): void => {
  const element = sut.getByTestId(fieldName)
  expect(element.childElementCount).toBe(quantity)
}

export const testButtonIsDisabled = (
  sut: RenderResult,
  fieldName: string,
  isDisabled: boolean
): void => {
  const button = sut.getByTestId(fieldName) as HTMLButtonElement
  expect(button.disabled).toBe(isDisabled)
}

export const testStatusForField = (
  sut: RenderResult,
  fieldName: string,
  validationError?: string
): void => {
  const fieldStatus = sut.getByTestId(`${fieldName}-status`)

  expect(fieldStatus.title).toBe(validationError || 'Tudo certo!')
  expect(fieldStatus.textContent).toBe(validationError ? '🙁' : '🙂')
}

export const populateInputField = (
  sut: RenderResult,
  fieldName: string,
  fieldValue: string
): void => {
  const input = sut.getByTestId(fieldName)

  fireEvent.input(input, {
    target: { value: fieldValue },
  })
}
