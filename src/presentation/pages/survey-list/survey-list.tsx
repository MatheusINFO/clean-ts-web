import React from 'react'
import { Footer, SignedHeader } from '@/presentation/components'
import Styles from './survey-list-styles.scss'
import { SurveyItem, SurveyItemEmpty } from './components'

const SurveyList: React.FC = () => (
  <div className={Styles.surveyListWrap}>
    <SignedHeader />

    <div className={Styles.contentWrap}>
      <h2>Enquetes</h2>
      <ul>
        <SurveyItem />
        <SurveyItemEmpty />
      </ul>
    </div>

    <Footer />
  </div>
)

export default SurveyList
