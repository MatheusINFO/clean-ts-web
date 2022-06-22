import React from 'react'
import {
  BrowserRouter,
  Switch,
  Route,
  BrowserRouterProps,
} from 'react-router-dom'
import { RecoilRoot } from 'recoil'
import {
  getCurrentAccountAdapter,
  setCurrentAccountAdapter,
} from '@/main/adapters'
import {
  makeLoginFactory,
  makeSignUpFactory,
  makeSurveyListFactory,
  makeSurveyResultFactory,
} from '@/main/factories/pages'
import PrivateRoute from './private-route'
import { currentAccountState } from '@/presentation/components'

type Props = BrowserRouterProps | Readonly<BrowserRouterProps>

const Router: React.FC<Props> = (props: Props) => (
  <RecoilRoot
    initializeState={({ set }) =>
      set(currentAccountState, {
        setCurrentAccount: setCurrentAccountAdapter,
        getCurrentAccount: getCurrentAccountAdapter,
      })
    }>
    <BrowserRouter {...props}>
      <Switch>
        <Route exact path="/login" component={makeLoginFactory} />
        <Route exact path="/signup" component={makeSignUpFactory} />
        <PrivateRoute exact path="/" component={makeSurveyListFactory} />
        <PrivateRoute path="/surveys/:id" component={makeSurveyResultFactory} />
      </Switch>
    </BrowserRouter>
  </RecoilRoot>
)

export default Router
