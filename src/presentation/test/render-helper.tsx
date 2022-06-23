import React from 'react'
import { RecoilRoot } from 'recoil'
import { Router } from 'react-router-dom'
import { render } from '@testing-library/react'

import { AccountModel } from '@/domain/models'
import { mockAccountModel } from '@/domain/test'
import { currentAccountState } from '@/presentation/components'

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
