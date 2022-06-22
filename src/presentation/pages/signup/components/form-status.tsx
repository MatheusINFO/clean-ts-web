import React from 'react'
import { useRecoilState } from 'recoil'
import { FormStatus as FormStatusBase } from '@/presentation/components'
import { signupState } from './atom'

const FormStatus: React.FC = () => {
  const [state] = useRecoilState(signupState)

  return <FormStatusBase state={state} />
}

export default FormStatus
