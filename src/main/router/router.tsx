import { SurveyList } from '@/presentation/pages'
import React from 'react'
import {
  BrowserRouter,
  Switch,
  Route,
  BrowserRouterProps,
} from 'react-router-dom'

type Props = (BrowserRouterProps | Readonly<BrowserRouterProps>) & {
  makeLogin: React.FC
  makeSignUp: React.FC
}

const Router: React.FC<Props> = (props: Props) => (
  <BrowserRouter {...props}>
    <Switch>
      <Route exact path="/login" component={props.makeLogin} />
      <Route exact path="/signup" component={props.makeSignUp} />
      <Route exact path="/" component={SurveyList} />
    </Switch>
  </BrowserRouter>
)

export default Router
