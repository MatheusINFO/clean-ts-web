import React, { useEffect, useState, useContext } from 'react'
import { SurveyModel } from '@/domain/models'
import { LoadSurveyList } from '@/domain/usecases'
import { AccessDeniedError } from '@/domain/erros'
import { ApiContext } from '@/presentation/contexts'
import { Footer, SignedHeader } from '@/presentation/components'
import { SurveyContext, SurveyListItem, Error } from './components'
import Styles from './survey-list-styles.scss'
import { useHistory } from 'react-router-dom'

type Props = {
  loadSurveyList: LoadSurveyList
}

const SurveyList: React.FC<Props> = ({ loadSurveyList }: Props) => {
  const history = useHistory()
  const { setCurrentAccount } = useContext(ApiContext)
  const [state, setState] = useState({
    surveys: [] as SurveyModel[],
    error: '',
    reload: false,
  })

  useEffect(() => {
    loadSurveyList
      .loadAll()
      .then((surveys) => setState({ ...state, surveys }))
      .catch((error) => {
        if (error instanceof AccessDeniedError) {
          setCurrentAccount(undefined)
          history.replace('/login')
        } else {
          setState({ ...state, error: error.message })
        }
      })
  }, [state.reload])

  return (
    <div className={Styles.surveyListWrap}>
      <SignedHeader />

      <div className={Styles.contentWrap}>
        <h2>Enquetes</h2>
        <SurveyContext.Provider value={{ state, setState }}>
          {state.error ? <Error /> : <SurveyListItem />}
        </SurveyContext.Provider>
      </div>

      <Footer />
    </div>
  )
}

export default SurveyList
