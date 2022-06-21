import React from 'react'
import { Calendar, Icon, IconName } from '@/presentation/components'
import Styles from './survey-item-styles.scss'
import { SurveyModel } from '@/domain/models'
import { Link } from 'react-router-dom'

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

        <Calendar className={Styles.caldendarWrap} date={surveyDate} />

        <p data-testid="question">{survey.question}</p>
      </div>

      <footer>
        <Link data-testid="link" to={`/surveys/${survey.id}`}>
          Ver Resultado
        </Link>
      </footer>
    </li>
  )
}

export default SurveyItem
