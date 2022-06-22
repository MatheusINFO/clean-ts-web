import { SaveSurveyResult } from '@/domain/usecases'
import { makeApiUrl } from '@/main/factories/http'
import { makeAuthorizeHttpClientDecoratorFactory } from '@/main/factories/decorators'
import { RemoteSaveSurveyResult } from '@/data/usecases/save-survey-result/remote-save-survey-result'

export const makeRemoteSaveResultFactory = (id: string): SaveSurveyResult => {
  return new RemoteSaveSurveyResult(
    makeApiUrl(`surveys/${id}/results`),
    makeAuthorizeHttpClientDecoratorFactory()
  )
}
