import React from 'react'
import {
  BrowserRouter,
  Switch,
  Route,
  BrowserRouterProps,
} from 'react-router-dom'
import { RecoilRoot } from 'recoil'
import { ApiContext } from '@/presentation/contexts'
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

type Props = BrowserRouterProps | Readonly<BrowserRouterProps>

const Router: React.FC<Props> = (props: Props) => (
  <RecoilRoot>
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
          <PrivateRoute
            path="/surveys/:id"
            component={makeSurveyResultFactory}
          />
        </Switch>
      </BrowserRouter>
    </ApiContext.Provider>
  </RecoilRoot>
)

export default Router
