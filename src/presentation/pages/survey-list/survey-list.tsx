import React, { useEffect } from 'react'
import { LoadSurveyList } from '@/domain/usecases'
import { Footer, SignedHeader, Error } from '@/presentation/components'
import { SurveyListItem, surveyListState } from './components'
import Styles from './survey-list-styles.scss'
import { useErrorHandler } from '@/presentation/hooks'
import { useRecoilState } from 'recoil'

type Props = {
  loadSurveyList: LoadSurveyList
}

const SurveyList: React.FC<Props> = ({ loadSurveyList }: Props) => {
  const handleError = useErrorHandler((error: Error) => {
    setState((old) => ({ ...old, error: error.message }))
  })
  const [state, setState] = useRecoilState(surveyListState)

  useEffect(() => {
    loadSurveyList
      .loadAll()
      .then((surveys) => setState((old) => ({ ...old, surveys })))
      .catch(handleError)
  }, [state.reload])

  const reload = (): void => {
    setState((old) => ({ surveys: [], error: '', reload: !old.reload }))
  }

  return (
    <div className={Styles.surveyListWrap}>
      <SignedHeader />

      <div className={Styles.contentWrap}>
        <h2>Enquetes</h2>
        {state.error ? (
          <Error error={state.error} reload={reload} />
        ) : (
          <SurveyListItem surveys={state.surveys} />
        )}
      </div>

      <Footer />
    </div>
  )
}

export default SurveyList
