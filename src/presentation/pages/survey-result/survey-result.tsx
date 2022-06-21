import React from 'react'
import FlipMove from 'react-flip-move'
import {
  Calendar,
  Footer,
  Loading,
  SignedHeader,
} from '@/presentation/components'
import Styles from './survey-result-styles.scss'

const SurveyResult: React.FC = () => {
  return (
    <div className={Styles.surveyResultWrap}>
      <SignedHeader />

      <div className={Styles.contentWrap}>
        {false && (
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

        {false && <Loading />}
      </div>

      <Footer />
    </div>
  )
}

export default SurveyResult
