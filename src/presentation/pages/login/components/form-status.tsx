import React from 'react'
import { useRecoilValue } from 'recoil'
import { FormStatus as FormStatusBase } from '@/presentation/components'
import { loginState } from './atom'

const FormStatus: React.FC = () => {
  const state = useRecoilValue(loginState)

  return <FormStatusBase state={state} />
}

export default FormStatus
