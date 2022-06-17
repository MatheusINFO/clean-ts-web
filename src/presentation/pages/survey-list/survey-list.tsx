import React from 'react'
import { Footer, Icon, IconName, SignedHeader } from '@/presentation/components'
import Styles from './survey-list-styles.scss'

const SurveyList: React.FC = () => (
  <div className={Styles.surveyListWrap}>
    <SignedHeader />

    <div className={Styles.contentWrap}>
      <h2>Enquetes</h2>
      <ul>
        <li>
          <div className={Styles.surveyContent}>
            <Icon className={Styles.iconWrap} iconName={IconName.thumbUp} />

            <time>
              <span className={Styles.day}>16</span>
              <span className={Styles.month}>06</span>
              <span className={Styles.year}>2022</span>
            </time>

            <p>Qual é seu framework web favorito?</p>
          </div>
          <footer>Ver Resultado</footer>
        </li>

        <li>
          <div className={Styles.surveyContent}>
            <Icon className={Styles.iconWrap} iconName={IconName.thumbUp} />

            <time>
              <span className={Styles.day}>16</span>
              <span className={Styles.month}>06</span>
              <span className={Styles.year}>2022</span>
            </time>

            <p>Qual é seu framework web favorito?</p>
          </div>
          <footer>Ver Resultado</footer>
        </li>

        <li>
          <div className={Styles.surveyContent}>
            <Icon className={Styles.iconWrap} iconName={IconName.thumbUp} />

            <time>
              <span className={Styles.day}>16</span>
              <span className={Styles.month}>06</span>
              <span className={Styles.year}>2022</span>
            </time>

            <p>Qual é seu framework web favorito?</p>
          </div>
          <footer>Ver Resultado</footer>
        </li>
      </ul>
    </div>

    <Footer />
  </div>
)

export default SurveyList
