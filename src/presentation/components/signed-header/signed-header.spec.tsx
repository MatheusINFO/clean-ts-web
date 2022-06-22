import React from 'react'
import { RecoilRoot } from 'recoil'
import { fireEvent, render, screen } from '@testing-library/react'
import { Router } from 'react-router-dom'
import { createMemoryHistory } from 'history'
import SignedHeader from './signed-header'
import { mockAccountModel } from '@/domain/test'
import { AccountModel } from '@/domain/models'
import { currentAccountState } from '../atoms/atom'

type SutTypes = {
  setCurrentAccountMock: (account: AccountModel) => void
  history: any
}

const makeSut = (account = mockAccountModel()): SutTypes => {
  const history = createMemoryHistory({ initialEntries: ['/'] }) as any
  const setCurrentAccountMock = jest.fn()

  render(
    <RecoilRoot
      initializeState={({ set }) =>
        set(currentAccountState, {
          setCurrentAccount: setCurrentAccountMock,
          getCurrentAccount: () => account,
        })
      }>
      <Router history={history}>
        <SignedHeader />
      </Router>
    </RecoilRoot>
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
