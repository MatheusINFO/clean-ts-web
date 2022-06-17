import React, { memo } from 'react'
import Styles from './unsigned-header-styles.scss'
import { Logo } from '@/presentation/components'

const UnsignedHeader: React.FC = () => (
  <header className={Styles.headerWrap}>
    <Logo />
    <h1>4Dev - Enquetes para Programadores</h1>
  </header>
)

export default memo(UnsignedHeader)
