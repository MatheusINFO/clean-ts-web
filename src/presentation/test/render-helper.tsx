import React from 'react'
import { Router } from 'react-router-dom'
import { render } from '@testing-library/react'
import { RecoilRoot } from 'recoil'
import { currentAccountState } from '@/presentation/components'
import { mockAccountModel } from '@/domain/test'
import { AccountModel } from '@/domain/models'

type SutTypes = {
  setCurrentAccountMock: (account: AccountModel) => void
}

type Params = {
  Page: React.FC
  history: any
  account?: AccountModel
}

export const renderWithHistory = ({
  Page,
  history,
  account = mockAccountModel(),
}: Params): SutTypes => {
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
        <Page />
      </Router>
    </RecoilRoot>
  )

  return {
    setCurrentAccountMock,
  }
}
