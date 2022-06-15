import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Styles from './signup-styles.scss'
import {
  Input,
  Footer,
  FormStatus,
  UnsignedHeader,
} from '@/presentation/components'
import Context from '@/presentation/contexts/form/form-context'

const SignUp: React.FC = () => {
  const [state] = useState({
    isLoading: false,
    name: '',
    email: '',
    password: '',
    passwordConfirmation: '',
    mainError: '',
    nameError: 'Campo obrigatório',
    emailError: 'Campo obrigatório',
    passwordError: 'Campo obrigatório',
    passwordConfirmationError: 'Campo obrigatório',
  })

  return (
    <div className={Styles.signup}>
      <UnsignedHeader />

      <Context.Provider value={{ state }}>
        <form data-testid="form" className={Styles.form}>
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
            disabled
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
