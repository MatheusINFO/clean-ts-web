import React from 'react'
import { useRecoilState } from 'recoil'
import { Input as InputBase } from '@/presentation/components'
import { signupState } from './index'

type Props = {
  type: string
  name: string
  placeholder: string
}

const Input: React.FC<Props> = ({ name, placeholder, type }: Props) => {
  const [state, setState] = useRecoilState(signupState)

  return (
    <InputBase
      type={type}
      name={name}
      placeholder={placeholder}
      state={state}
      setState={setState}
    />
  )
}

export default Input
