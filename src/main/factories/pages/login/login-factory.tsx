import React from 'react'

import { Login } from '@/presentation/pages'
import { makeRemoteAuthenticationFactory } from '@/main/factories/usecases'
import { makeLoginValidationFactory } from './login-validation-factory'

export const makeLoginFactory: React.FC = () => (
  <Login
    authentication={makeRemoteAuthenticationFactory()}
    validation={makeLoginValidationFactory()}
  />
)
