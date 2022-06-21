import React from 'react'
import FlipMove from 'react-flip-move'
import { Footer, SignedHeader, Spinner } from '@/presentation/components'
import Styles from './survey-result-styles.scss'

const SurveyResult: React.FC = () => {
  return (
    <div className={Styles.surveyResultWrap}>
      <SignedHeader />

      <div className={Styles.contentWrap}>
        <h2>Qual é seu framework web favorito?</h2>
        <FlipMove className={Styles.answerList}>
          <li className={Styles.active}>
            <img src="https://fordevs.herokuapp.com/static/img/logo-angular.png" />
            <span className={Styles.answer}>ReactJS</span>
            <span className={Styles.percent}>20</span>
          </li>
        </FlipMove>

        <button>Voltar</button>

        <div className={Styles.loadingWrap}>
          <div className={Styles.loading}>
            <span>Aguarde...</span>
            <Spinner isNegative />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default SurveyResult
