import React, { memo } from 'react'
import { currentAccountState, Logo } from '@/presentation/components'
import Styles from './signed-header-styles.scss'
import { useLogout } from '@/presentation/hooks'
import { useRecoilValue } from 'recoil'

const SignedHeader: React.FC = () => {
  const logout = useLogout()
  const { getCurrentAccount } = useRecoilValue(currentAccountState)

  const handleLogout = (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ): void => {
    event.preventDefault()
    logout()
  }

  return (
    <header className={Styles.headerWrap}>
      <div className={Styles.headerContent}>
        <Logo />
        <div className={Styles.logoutWrap}>
          <span data-testid="username">{getCurrentAccount().name}</span>
          <a data-testid="logout" href="#" onClick={handleLogout}>
            sair
          </a>
        </div>
      </div>
    </header>
  )
}

export default memo(SignedHeader)
