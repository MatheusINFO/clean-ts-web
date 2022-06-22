import { SurveyResultAnswerModel } from '@/domain/models'
import React from 'react'
import Styles from './survey-answer-styles.scss'

type Props = {
  answer: SurveyResultAnswerModel
}

const SurveyAnswer: React.FC<Props> = ({ answer }: Props) => {
  const activeClassName = answer.isCurrentAccountAnswer ? Styles.active : ''

  return (
    <li
      data-testid="answer-wrap"
      className={[Styles.surveyAnswerWrap, activeClassName].join(' ')}
      key={answer.answer}>
      {answer.image && (
        <img data-testid="image" src={answer.image} alt={answer.answer} />
      )}
      <span data-testid="answer" className={Styles.answer}>
        {answer.answer}
      </span>
      <span data-testid="percent" className={Styles.percent}>
        {answer.percent}%
      </span>
    </li>
  )
}

export default SurveyAnswer
