import React from 'react'
import ReactDOM from 'react-dom'
import Router from './router/router'
import '@/presentation/styles/global.scss'
import { makeLoginFactory, makeSignUpFactory } from './factories/pages'

ReactDOM.render(
  <Router makeLogin={makeLoginFactory} makeSignUp={makeSignUpFactory} />,
  document.getElementById('main')
)
