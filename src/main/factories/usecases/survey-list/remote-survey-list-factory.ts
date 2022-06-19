import { LoadSurveyList } from '@/domain/usecases'
import { makeApiUrl } from '@/main/factories/http'
import { makeAuthorizeHttpGetClientDecoratorFactory } from '@/main/factories/decorators'
import { RemoteLoadSurveyList } from '@/data/usecases/load-survey-list/remote-load-survey-list'

export const makeRemoteSurveyListFactory = (): LoadSurveyList => {
  return new RemoteLoadSurveyList(
    makeApiUrl('surveys'),
    makeAuthorizeHttpGetClientDecoratorFactory()
  )
}
