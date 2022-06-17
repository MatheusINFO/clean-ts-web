import React, { memo } from 'react'
import { Logo } from '@/presentation/components'
import Styles from './signed-header-styles.scss'

const SignedHeader: React.FC = () => (
  <header className={Styles.headerWrap}>
    <div className={Styles.headerContent}>
      <Logo />
      <div className={Styles.logoutWrap}>
        <span>Matheus</span>
        <a href="#">sair</a>
      </div>
    </div>
  </header>
)

export default memo(SignedHeader)
