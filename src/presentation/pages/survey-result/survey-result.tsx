import React, { useState } from 'react'
import FlipMove from 'react-flip-move'
import {
  Calendar,
  Footer,
  Loading,
  SignedHeader,
  Error,
} from '@/presentation/components'
import Styles from './survey-result-styles.scss'
import { LoadSurveyResult } from '@/domain/usecases'

const SurveyResult: React.FC = () => {
  const [state] = useState({
    isLoading: false,
    error: '',
    surveyResult: null as LoadSurveyResult.Result,
  })

  return (
    <div className={Styles.surveyResultWrap}>
      <SignedHeader />

      <div data-testid="survey-result" className={Styles.contentWrap}>
        {state.surveyResult && (
          <>
            <hgroup>
              <Calendar date={new Date()} className={Styles.calendarWrap} />
              <h2>Qual é seu framework web favorito?</h2>
            </hgroup>

            <FlipMove className={Styles.answerList}>
              <li className={Styles.active}>
                <img src="https://fordevs.herokuapp.com/static/img/logo-angular.png" />
                <span className={Styles.answer}>ReactJS</span>
                <span className={Styles.percent}>20</span>
              </li>
            </FlipMove>

            <button>Voltar</button>
          </>
        )}

        {state.isLoading && <Loading />}
        {state.error && <Error error={state.error} reload={() => null} />}
      </div>

      <Footer />
    </div>
  )
}

export default SurveyResult
