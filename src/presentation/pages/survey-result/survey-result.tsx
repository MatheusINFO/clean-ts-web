import React, { useEffect } from 'react'
import { useRecoilState, useSetRecoilState } from 'recoil'

import { LoadSurveyResult, SaveSurveyResult } from '@/domain/usecases'
import { useErrorHandler } from '@/presentation/hooks'
import { Footer, Loading, SignedHeader, Error } from '@/presentation/components'
import {
  SurveyResultData,
  surveyResultState,
  onSurveyAnswerState,
} from './components'
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
  const [state, setState] = useRecoilState(surveyResultState)
  const setOnAnswer = useSetRecoilState(onSurveyAnswerState)

  useEffect(() => {
    loadSurveyResult
      .load()
      .then((surveyResult) =>
        setState((old) => ({ ...old, surveyResult, isLoading: false }))
      )
      .catch(handleError)
  }, [state.reload])

  useEffect(() => {
    setOnAnswer({ onAnswer })
  }, [])

  const reload = (): void => {
    setState((old) => ({
      isLoading: false,
      surveyResult: null,
      error: '',
      reload: !old.reload,
    }))
  }

  const onAnswer = (answer: string): void => {
    if (state.isLoading) {
      return
    }

    setState((old) => ({ ...old, isLoading: true }))

    saveSurveyResult
      .save({ answer })
      .then((surveyResult) =>
        setState((old) => ({ ...old, surveyResult, isLoading: false }))
      )
      .catch(handleError)
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
