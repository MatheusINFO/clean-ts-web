import React from 'react'
import {
  BrowserRouter,
  Switch,
  Route,
  BrowserRouterProps,
} from 'react-router-dom'
import { ApiContext } from '@/presentation/contexts'
import {
  getCurrentAccountAdapter,
  setCurrentAccountAdapter,
} from '@/main/adapters'
import {
  makeLoginFactory,
  makeSignUpFactory,
  makeSurveyListFactory,
} from '@/main/factories/pages'
import PrivateRoute from './private-route'

type Props = BrowserRouterProps | Readonly<BrowserRouterProps>

const Router: React.FC<Props> = (props: Props) => (
  <ApiContext.Provider
    value={{
      setCurrentAccount: setCurrentAccountAdapter,
      getCurrentAccount: getCurrentAccountAdapter,
    }}>
    <BrowserRouter {...props}>
      <Switch>
        <Route exact path="/login" component={makeLoginFactory} />
        <Route exact path="/signup" component={makeSignUpFactory} />
        <PrivateRoute exact path="/" component={makeSurveyListFactory} />
      </Switch>
    </BrowserRouter>
  </ApiContext.Provider>
)

export default Router
