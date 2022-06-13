import React from 'react'
import {
  BrowserRouter,
  Switch,
  Route,
  BrowserRouterProps,
} from 'react-router-dom'

type Props = (BrowserRouterProps | Readonly<BrowserRouterProps>) & {
  makeLogin: React.FC
}

const Router: React.FC<Props> = (props: Props) => (
  <BrowserRouter {...props}>
    <Switch>
      <Route exact path="/login" component={props.makeLogin} />
    </Switch>
  </BrowserRouter>
)

export default Router
