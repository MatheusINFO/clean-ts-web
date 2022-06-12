import React from 'react'
import {
  BrowserRouter,
  Switch,
  Route,
  BrowserRouterProps,
} from 'react-router-dom'
import { Login } from '@/presentation/pages'

type Props = BrowserRouterProps | Readonly<BrowserRouterProps>

const Router: React.FC<Props> = (props: Props) => (
  <BrowserRouter {...props}>
    <Switch>
      <Route exact path="/login" component={Login} />
    </Switch>
  </BrowserRouter>
)

export default Router
