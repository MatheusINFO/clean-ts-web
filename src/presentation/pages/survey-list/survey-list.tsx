import React, { useEffect } from 'react'
import { LoadSurveyList } from '@/domain/usecases'
import { Footer, SignedHeader } from '@/presentation/components'
import { SurveyItemEmpty } from './components'
import Styles from './survey-list-styles.scss'

type Props = {
  loadSurveyList: LoadSurveyList
}

const SurveyList: React.FC<Props> = ({ loadSurveyList }: Props) => {
  useEffect(() => {
    ;(async function () {
      await loadSurveyList.loadAll()
    })()
  }, [])

  return (
    <div className={Styles.surveyListWrap}>
      <SignedHeader />

      <div className={Styles.contentWrap}>
        <h2>Enquetes</h2>
        <ul data-testid="survey-list">
          <SurveyItemEmpty />
        </ul>
      </div>

      <Footer />
    </div>
  )
}

export default SurveyList
