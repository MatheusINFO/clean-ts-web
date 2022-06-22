import React from 'react'
import { fireEvent, screen } from '@testing-library/react'
import { createMemoryHistory } from 'history'
import SignedHeader from './signed-header'
import { mockAccountModel } from '@/domain/test'
import { AccountModel } from '@/domain/models'
import { renderWithHistory } from '@/presentation/test'

type SutTypes = {
  setCurrentAccountMock: (account: AccountModel) => void
  history: any
}

const makeSut = (account = mockAccountModel()): SutTypes => {
  const history = createMemoryHistory({ initialEntries: ['/'] }) as any

  const { setCurrentAccountMock } = renderWithHistory({
    history,
    Page: () => <SignedHeader />,
    account,
  })

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
