import React from 'react'
import { useHistory } from 'react-router-dom'
import { Calendar } from '@/presentation/components'
import { LoadSurveyResult } from '@/domain/usecases'
import Styles from './survey-result-data-styles.scss'
import { SurveyResultAnswer } from '@/presentation/pages/survey-result/components'

type Props = {
  surveyResult: LoadSurveyResult.Result
}

const SurveyResultData: React.FC<Props> = ({ surveyResult }: Props) => {
  const { goBack } = useHistory()

  return (
    <>
      <hgroup>
        <Calendar date={surveyResult.date} className={Styles.calendarWrap} />
        <h2 data-testid="question">{surveyResult.question}</h2>
      </hgroup>

      <ul data-testid="answers" className={Styles.answerList}>
        {surveyResult.answers.map((answer) => (
          <SurveyResultAnswer key={answer.answer} answer={answer} />
        ))}
      </ul>

      <button
        data-testid="back-button"
        className={Styles.button}
        onClick={goBack}>
        Voltar
      </button>
    </>
  )
}

export default SurveyResultData
