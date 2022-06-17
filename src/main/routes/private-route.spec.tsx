import React from 'react'
import { createMemoryHistory } from 'history'
import { Router } from 'react-router-dom'
import { render, RenderResult } from '@testing-library/react'
import PrivateRoute from '@/main/routes/private-route'
import { ApiContext } from '@/presentation/contexts'
import { mockAccountModel } from '@/domain/test'

type SutTypes = {
  sut: RenderResult
}

const history = createMemoryHistory({ initialEntries: ['/'] }) as any
const makeSut = (account = mockAccountModel()): SutTypes => {
  const sut = render(
    <ApiContext.Provider value={{ getCurrentAccount: () => account }}>
      <Router history={history}>
        <PrivateRoute />
      </Router>
    </ApiContext.Provider>
  )

  return {
    sut,
  }
}

describe('PrivateRoute', () => {
  it('Should render current component if token is not empty', () => {
    makeSut()
    expect(history.location.pathname).toBe('/')
  })

  it('Should redirect to /login if token is empty', () => {
    makeSut(null)
    expect(history.location.pathname).toBe('/login')
  })
})
