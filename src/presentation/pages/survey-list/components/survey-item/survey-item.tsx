import React from 'react'
import { Icon, IconName } from '@/presentation/components'
import Styles from './survey-item-styles.scss'
import { SurveyModel } from '@/domain/models'

type Props = {
  survey: SurveyModel
}

const SurveyItem: React.FC<Props> = ({ survey }: Props) => {
  const iconName = survey.didAnswer ? IconName.thumbUp : IconName.thumbDown
  const surveyDate = new Date(survey.date)

  return (
    <li className={Styles.surveyItemWrap}>
      <div className={Styles.surveyContent}>
        <Icon className={Styles.iconWrap} iconName={iconName} />

        <time>
          <span data-testid="day" className={Styles.day}>
            {surveyDate.getDate().toString().padStart(2, '0')}
          </span>
          <span data-testid="month" className={Styles.month}>
            {surveyDate
              .toLocaleString('pt-br', { month: 'short' })
              .replace('.', '')}
          </span>
          <span data-testid="year" className={Styles.year}>
            {surveyDate.getFullYear()}
          </span>
        </time>

        <p data-testid="question">{survey.question}</p>
      </div>

      <footer>Ver Resultado</footer>
    </li>
  )
}

export default SurveyItem
