import React, { useContext, useRef } from 'react'
import Styles from './input-styles.scss'
import { FormContext } from '@/presentation/contexts'

type Props = React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>

const Input: React.FC<Props> = (props: Props) => {
  const { state, setState } = useContext(FormContext)
  const inputRef = useRef<HTMLInputElement>()
  const error = state[`${props.name}Error`]

  return (
    <div
      data-testid={`${props.name}-wrap`}
      className={Styles.inputWrap}
      data-status={error ? 'invalid' : 'valid'}>
      <input
        {...props}
        readOnly
        title={error}
        ref={inputRef}
        placeholder=" "
        onFocus={(e: React.FocusEvent<HTMLInputElement>) =>
          (e.target.readOnly = false)
        }
        data-testid={props.name}
        onChange={(e: React.FocusEvent<HTMLInputElement>) =>
          setState({
            ...state,
            [e.target.name]: e.target.value,
          })
        }
      />

      <label
        data-testid={`${props.name}-label`}
        title={error}
        onClick={() => inputRef.current.focus()}>
        {props.placeholder}
      </label>
    </div>
  )
}

export default Input
