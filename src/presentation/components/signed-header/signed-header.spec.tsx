import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import { Router } from 'react-router-dom'
import { createMemoryHistory } from 'history'
import SignedHeader from './signed-header'
import { ApiContext } from '@/presentation/contexts'

type SutTypes = {
  setCurrentAccountMock: any
}

const history = createMemoryHistory({ initialEntries: ['/'] }) as any
const makeSut = (): SutTypes => {
  const setCurrentAccountMock = jest.fn()

  render(
    <ApiContext.Provider value={{ setCurrentAccount: setCurrentAccountMock }}>
      <Router history={history}>
        <SignedHeader />
      </Router>
    </ApiContext.Provider>
  )

  return {
    setCurrentAccountMock,
  }
}

describe('SignedHeader', () => {
  it('Should call setCurrentAdapter with null', () => {
    const { setCurrentAccountMock } = makeSut()

    fireEvent.click(screen.getByTestId('logout'))
    expect(setCurrentAccountMock).toHaveBeenCalledWith(undefined)
    expect(history.location.pathname).toBe('/login')
  })
})
