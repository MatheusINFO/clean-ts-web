import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import { Router } from 'react-router-dom'
import { createMemoryHistory } from 'history'
import SignedHeader from './signed-header'
import { ApiContext } from '@/presentation/contexts'
import { mockAccountModel } from '@/domain/test'
import { AccountModel } from '@/domain/models'

type SutTypes = {
  setCurrentAccountMock: (account: AccountModel) => void
  history: any
}

const makeSut = (account = mockAccountModel()): SutTypes => {
  const history = createMemoryHistory({ initialEntries: ['/'] }) as any
  const setCurrentAccountMock = jest.fn()

  render(
    <ApiContext.Provider
      value={{
        setCurrentAccount: setCurrentAccountMock,
        getCurrentAccount: () => account,
      }}>
      <Router history={history}>
        <SignedHeader />
      </Router>
    </ApiContext.Provider>
  )

  return {
    setCurrentAccountMock,
    history,
  }
}

describe('SignedHeader', () => {
  it('Should call setCurrentAdapter with null', () => {
    const { setCurrentAccountMock, history } = makeSut()

    fireEvent.click(screen.getByTestId('logout'))
    expect(setCurrentAccountMock).toHaveBeenCalledWith(undefined)
    expect(history.location.pathname).toBe('/login')
  })

  it('Should render username correctly', () => {
    const account = mockAccountModel()
    makeSut(account)
    expect(screen.getByTestId('username')).toHaveTextContent(account.name)
  })
})
