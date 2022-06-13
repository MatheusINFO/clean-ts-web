import React from 'react'
import ReactDOM from 'react-dom'
import Router from './router/router'
import '@/presentation/styles/global.scss'
import { makeLoginFactory } from './factories/pages'

ReactDOM.render(
  <Router makeLogin={makeLoginFactory} />,
  document.getElementById('main')
)
