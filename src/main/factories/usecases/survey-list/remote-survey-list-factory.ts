import { LoadSurveyList } from '@/domain/usecases'
import { makeAxiosHttpClientFactory, makeApiUrl } from '@/main/factories/http'
import { RemoteLoadSurveyList } from '@/data/usecases/load-survey-list/remote-load-survey-list'

export const makeRemoteSurveyListFactory = (): LoadSurveyList => {
  return new RemoteLoadSurveyList(
    makeApiUrl('surveys'),
    makeAxiosHttpClientFactory()
  )
}
