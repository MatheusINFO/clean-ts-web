import { SurveyList } from '@/presentation/pages'
import React from 'react'
import {
  BrowserRouter,
  Switch,
  Route,
  BrowserRouterProps,
} from 'react-router-dom'
import { makeLoginFactory, makeSignUpFactory } from '@/main/factories/pages'

type Props = BrowserRouterProps | Readonly<BrowserRouterProps>

const Router: React.FC<Props> = (props: Props) => (
  <BrowserRouter {...props}>
    <Switch>
      <Route exact path="/login" component={makeLoginFactory} />
      <Route exact path="/signup" component={makeSignUpFactory} />
      <Route exact path="/" component={SurveyList} />
    </Switch>
  </BrowserRouter>
)

export default Router
