import React from 'react'
import { Signup } from '@/presentation/pages'
import {
  makeLocalUpdateCurrentAccountFactory,
  makeRemoteAddAccountFactory,
} from '@/main/factories/usecases'
import { makeSignUpValidationFactory } from './signup-validation-factory'

export const makeSignUpFactory: React.FC = () => (
  <Signup
    addAccount={makeRemoteAddAccountFactory()}
    validation={makeSignUpValidationFactory()}
    updateCurrentAccount={makeLocalUpdateCurrentAccountFactory()}
  />
)
