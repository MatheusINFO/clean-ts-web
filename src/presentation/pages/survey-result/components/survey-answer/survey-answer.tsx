import React from 'react'
import { useRecoilValue } from 'recoil'
import { SurveyResultAnswerModel } from '@/domain/models'
import Styles from './survey-answer-styles.scss'
import { onSurveyAnswerState } from '@/presentation/pages/survey-result/components'

type Props = {
  answer: SurveyResultAnswerModel
}

const SurveyAnswer: React.FC<Props> = ({ answer }: Props) => {
  const { onAnswer } = useRecoilValue(onSurveyAnswerState)

  const activeClassName = answer.isCurrentAccountAnswer ? Styles.active : ''

  const answerClick = (event: React.MouseEvent): void => {
    if (event.currentTarget.classList.contains(Styles.active)) {
      return
    }

    onAnswer(answer.answer)
  }

  return (
    <li
      data-testid="answer-wrap"
      className={[Styles.surveyAnswerWrap, activeClassName].join(' ')}
      key={answer.answer}
      onClick={answerClick}>
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
