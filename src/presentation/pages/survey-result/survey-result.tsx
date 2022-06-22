import React, { useEffect, useState } from 'react'
import { Footer, Loading, SignedHeader, Error } from '@/presentation/components'
import { LoadSurveyResult, SaveSurveyResult } from '@/domain/usecases'
import { useErrorHandler } from '@/presentation/hooks'
import { SurveyResultContext, SurveyResultData } from './components'
import Styles from './survey-result-styles.scss'

type Props = {
  loadSurveyResult: LoadSurveyResult
  saveSurveyResult: SaveSurveyResult
}

const SurveyResult: React.FC<Props> = ({
  loadSurveyResult,
  saveSurveyResult,
}: Props) => {
  const handleError = useErrorHandler((error: Error) => {
    setState((old) => ({
      ...old,
      surveyResult: null,
      error: error.message,
      isLoading: false,
    }))
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
      .then((surveyResult) =>
        setState((old) => ({ ...old, surveyResult, isLoading: false }))
      )
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

  const onAnswer = (answer: string): void => {
    setState((old) => ({ ...old, isLoading: true }))
    saveSurveyResult
      .save({ answer })
      .then((surveyResult) => setState((old) => ({ ...old, surveyResult })))
      .catch(handleError)
  }

  return (
    <div className={Styles.surveyResultWrap}>
      <SignedHeader />

      <SurveyResultContext.Provider value={{ onAnswer }}>
        <div data-testid="survey-result" className={Styles.contentWrap}>
          {state.surveyResult && (
            <SurveyResultData surveyResult={state.surveyResult} />
          )}
          {state.isLoading && <Loading />}
          {state.error && <Error error={state.error} reload={reload} />}
        </div>
      </SurveyResultContext.Provider>

      <Footer />
    </div>
  )
}

export default SurveyResult
