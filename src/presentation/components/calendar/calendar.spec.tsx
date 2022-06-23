import React from 'react'
import { render, screen } from '@testing-library/react'

import Calendar from './calendar'

const makeSut = (date: Date): void => {
  render(<Calendar date={date} />)
}

describe('Calendar', () => {
  it('Should render with correct values', () => {
    makeSut(new Date('2001-01-30T00:00:00'))
    expect(screen.getByTestId('day')).toHaveTextContent('30')
    expect(screen.getByTestId('month')).toHaveTextContent('jan')
    expect(screen.getByTestId('year')).toHaveTextContent('2001')
  })

  it('Should render with correct values ', () => {
    makeSut(new Date('2001-01-03T00:00:00'))
    expect(screen.getByTestId('day')).toHaveTextContent('03')
    expect(screen.getByTestId('month')).toHaveTextContent('jan')
    expect(screen.getByTestId('year')).toHaveTextContent('2001')
  })
})
