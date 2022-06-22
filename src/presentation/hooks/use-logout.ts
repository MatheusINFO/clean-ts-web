import { useRecoilValue } from 'recoil'
import { useHistory } from 'react-router-dom'
import { currentAccountState } from '@/presentation/components'

type CallBackType = () => void

export const useLogout = (): CallBackType => {
  const history = useHistory()
  const { setCurrentAccount } = useRecoilValue(currentAccountState)

  return (): void => {
    setCurrentAccount(undefined)
    history.replace('/login')
  }
}
