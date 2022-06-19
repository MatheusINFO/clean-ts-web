import { useContext } from 'react'
import { useHistory } from 'react-router-dom'
import { ApiContext } from '@/presentation/contexts'

type CallBackType = () => void

export const useLogout = (): CallBackType => {
  const history = useHistory()
  const { setCurrentAccount } = useContext(ApiContext)

  return (): void => {
    setCurrentAccount(undefined)
    history.replace('/login')
  }
}
