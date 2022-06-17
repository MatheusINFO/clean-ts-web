import { SurveyList } from '@/presentation/pages'
import React from 'react'
import {
  BrowserRouter,
  Switch,
  Route,
  BrowserRouterProps,
} from 'react-router-dom'
import { ApiContext } from '@/presentation/contexts'
import { setCurrentAccountAdapter } from '@/main/adapters'
import { makeLoginFactory, makeSignUpFactory } from '@/main/factories/pages'

type Props = BrowserRouterProps | Readonly<BrowserRouterProps>

const Router: React.FC<Props> = (props: Props) => (
  <ApiContext.Provider value={{ setCurrentAccount: setCurrentAccountAdapter }}>
    <BrowserRouter {...props}>
      <Switch>
        <Route exact path="/login" component={makeLoginFactory} />
        <Route exact path="/signup" component={makeSignUpFactory} />
        <Route exact path="/" component={SurveyList} />
      </Switch>
    </BrowserRouter>
  </ApiContext.Provider>
)

export default Router
