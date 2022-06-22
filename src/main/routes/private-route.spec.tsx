import React from 'react'
import { createMemoryHistory } from 'history'
import PrivateRoute from '@/main/routes/private-route'
import { mockAccountModel } from '@/domain/test'
import { renderWithHistory } from '@/presentation/test'

type SutTypes = {
  history: any
}

const makeSut = (account = mockAccountModel()): SutTypes => {
  const history = createMemoryHistory({ initialEntries: ['/'] }) as any

  renderWithHistory({
    history,
    Page: () => <PrivateRoute />,
    account,
  })

  return {
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
