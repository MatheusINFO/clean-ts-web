import React from 'react'
import { SurveyModel } from '@/domain/models'
import {
  SurveyItem,
  SurveyItemEmpty,
} from '@/presentation/pages/survey-list/components'
import Styles from './survey-list-item-styles.scss'
import { LoadSurveyList } from '@/domain/usecases'

type Props = {
  surveys: LoadSurveyList.Result
}

const SurveyListItem: React.FC<Props> = ({ surveys }: Props) => (
  <ul className={Styles.listWrap} data-testid="survey-list">
    {surveys.length ? (
      surveys.map((survey: SurveyModel) => (
        <SurveyItem key={survey.id} survey={survey} />
      ))
    ) : (
      <SurveyItemEmpty />
    )}
  </ul>
)

export default SurveyListItem
