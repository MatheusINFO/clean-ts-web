import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Styles from './signup-styles.scss'
import {
  Input,
  Footer,
  FormStatus,
  UnsignedHeader,
} from '@/presentation/components'
import Context from '@/presentation/contexts/form/form-context'
import { Validation } from '@/presentation/protocols/validation'

type Props = {
  validation: Validation
}

const SignUp: React.FC<Props> = ({ validation }: Props) => {
  const [state, setState] = useState({
    isLoading: false,
    name: '',
    email: '',
    password: '',
    passwordConfirmation: '',
    mainError: '',
    nameError: '',
    emailError: '',
    passwordError: '',
    passwordConfirmationError: '',
  })

  useEffect(() => {
    setState({
      ...state,
      nameError: validation.validate('name', state.name),
      emailError: validation.validate('email', state.email),
      passwordError: validation.validate('password', state.password),
      passwordConfirmationError: validation.validate(
        'passwordConfirmation',
        state.passwordConfirmation
      ),
    })
  }, [state.name, state.email, state.password, state.passwordConfirmation])

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault()

    setState({
      ...state,
      isLoading: true,
    })
  }

  return (
    <div className={Styles.signup}>
      <UnsignedHeader />

      <Context.Provider value={{ state, setState }}>
        <form
          data-testid="form"
          className={Styles.form}
          onSubmit={handleSubmit}>
          <h2>Criar conta</h2>
          <Input type="text" name="name" placeholder="Digite seu nome" />
          <Input type="email" name="email" placeholder="Digite seu e-mail" />
          <Input
            type="password"
            name="password"
            placeholder="Digite sua senha"
          />
          <Input
            type="password"
            name="passwordConfirmation"
            placeholder="Confirme sua senha"
          />
          <button
            data-testid="submit"
            disabled={
              !!state.nameError ||
              !!state.emailError ||
              !!state.passwordError ||
              !!state.passwordConfirmationError
            }
            className={Styles.submit}
            type="submit">
            Entrar
          </button>
          <Link data-testid="login" to="/login" className={Styles.link}>
            Voltar para Login
          </Link>
          <FormStatus />
        </form>
      </Context.Provider>

      <Footer />
    </div>
  )
}

export default SignUp
