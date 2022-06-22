import React, { useRef } from 'react'
import Styles from './input-styles.scss'

type Props = React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
> & {
  state: any
  setState: any
}

const Input: React.FC<Props> = ({ state, setState, ...props }: Props) => {
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
