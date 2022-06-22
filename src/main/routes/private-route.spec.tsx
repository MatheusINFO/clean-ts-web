import React from 'react'
import { createMemoryHistory } from 'history'
import { Router } from 'react-router-dom'
import { render, RenderResult } from '@testing-library/react'
import PrivateRoute from '@/main/routes/private-route'
import { mockAccountModel } from '@/domain/test'
import { RecoilRoot } from 'recoil'
import { currentAccountState } from '@/presentation/components'

type SutTypes = {
  sut: RenderResult
  history: any
}

const makeSut = (account = mockAccountModel()): SutTypes => {
  const history = createMemoryHistory({ initialEntries: ['/'] }) as any
  const sut = render(
    <RecoilRoot
      initializeState={({ set }) =>
        set(currentAccountState, {
          setCurrentAccount: jest.fn(),
          getCurrentAccount: () => account,
        })
      }>
      <Router history={history}>
        <PrivateRoute />
      </Router>
    </RecoilRoot>
  )

  return {
    sut,
    history,
  }
}

describe('PrivateRoute', () => {
  it('Should render current component if token is not empty', () => {
    const { history } = makeSut()
    expect(history.location.pathname).toBe('/')
  })

  it('Should redirect to /login if token is empty', () => {
    const { history } = makeSut(null)
    expect(history.location.pathname).toBe('/login')
  })
})
