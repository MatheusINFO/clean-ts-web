import React, { memo } from 'react'

import { Logo } from '@/presentation/components'
import Styles from './unsigned-header-styles.scss'

const UnsignedHeader: React.FC = () => (
  <header className={Styles.headerWrap}>
    <Logo />
    <h1>4Dev - Enquetes para Programadores</h1>
  </header>
)

export default memo(UnsignedHeader)
