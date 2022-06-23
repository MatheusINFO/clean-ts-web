import { LoadSurveyList } from '@/domain/usecases'
import { RemoteLoadSurveyList } from '@/data/usecases'
import { makeApiUrl } from '@/main/factories/http'
import { makeAuthorizeHttpClientDecoratorFactory } from '@/main/factories/decorators'

export const makeRemoteSurveyListFactory = (): LoadSurveyList => {
  return new RemoteLoadSurveyList(
    makeApiUrl('surveys'),
    makeAuthorizeHttpClientDecoratorFactory()
  )
}
