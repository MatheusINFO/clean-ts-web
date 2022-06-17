import React from 'react'
import { Login } from '@/presentation/pages'
import {
  makeLocalUpdateCurrentAccountFactory,
  makeRemoteAuthenticationFactory,
} from '@/main/factories/usecases'
import { makeLoginValidationFactory } from './login-validation-factory'

export const makeLoginFactory: React.FC = () => (
  <Login
    authentication={makeRemoteAuthenticationFactory()}
    validation={makeLoginValidationFactory()}
    updateCurrentAccount={makeLocalUpdateCurrentAccountFactory()}
  />
)
