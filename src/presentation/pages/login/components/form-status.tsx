import React from 'react'
import { useRecoilState } from 'recoil'
import { FormStatus as FormStatusBase } from '@/presentation/components'
import { loginState } from './atom'

const FormStatus: React.FC = () => {
  const [state] = useRecoilState(loginState)

  return <FormStatusBase state={state} />
}

export default FormStatus
