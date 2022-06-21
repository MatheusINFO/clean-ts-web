import React, { useEffect, useState } from 'react'
import { Footer, Loading, SignedHeader, Error } from '@/presentation/components'
import Styles from './survey-result-styles.scss'
import { LoadSurveyResult } from '@/domain/usecases'
import { useErrorHandler } from '@/presentation/hooks'
import { SurveyResultData } from './components'

type Props = {
  loadSurveyResult: LoadSurveyResult
}

const SurveyResult: React.FC<Props> = ({ loadSurveyResult }: Props) => {
  const handleError = useErrorHandler((error: Error) => {
    setState((old) => ({ ...old, surveyResult: null, error: error.message }))
  })
  const [state, setState] = useState({
    isLoading: false,
    error: '',
    surveyResult: null as LoadSurveyResult.Result,
    reload: false,
  })

  useEffect(() => {
    loadSurveyResult
      .load()
      .then((surveyResult) => setState((old) => ({ ...old, surveyResult })))
      .catch(handleError)
  }, [state.reload])

  const reload = (): void => {
    setState((old) => ({
      isLoading: false,
      surveyResult: null,
      error: '',
      reload: !old.reload,
    }))
  }

  return (
    <div className={Styles.surveyResultWrap}>
      <SignedHeader />

      <div data-testid="survey-result" className={Styles.contentWrap}>
        {state.surveyResult && (
          <SurveyResultData surveyResult={state.surveyResult} />
        )}

        {state.isLoading && <Loading />}
        {state.error && <Error error={state.error} reload={reload} />}
      </div>

      <Footer />
    </div>
  )
}

export default SurveyResult
