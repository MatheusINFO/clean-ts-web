import React from 'react'
import { Icon, IconName } from '@/presentation/components'
import Styles from './survey-item-styles.scss'

const SurveyItem: React.FC = () => (
  <li className={Styles.surveyItemWrap}>
    <div className={Styles.surveyContent}>
      <Icon className={Styles.iconWrap} iconName={IconName.thumbUp} />

      <time>
        <span className={Styles.day}>16</span>
        <span className={Styles.month}>06</span>
        <span className={Styles.year}>2022</span>
      </time>

      <p>Qual é seu framework web favorito?</p>
    </div>

    <footer>Ver Resultado</footer>
  </li>
)

export default SurveyItem
