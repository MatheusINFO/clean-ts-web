import { AccessDeniedError, UnexpectedError } from '@/domain/erros'
import { LoadSurveyList } from '@/domain/usecases'
import { HttpClient, HttpStatusCode } from '@/data/protocols/http'

export class RemoteLoadSurveyList implements LoadSurveyList {
  constructor(
    private readonly url: string,
    private readonly httpGetClient: HttpClient<RemoteLoadSurveyList.Result>
  ) {}

  async loadAll(): Promise<LoadSurveyList.Result> {
    const httpResponse = await this.httpGetClient.request({
      url: this.url,
      method: 'get',
    })

    switch (httpResponse.statusCode) {
      case HttpStatusCode.success:
        return httpResponse.body
      case HttpStatusCode.noContent:
        return []
      case HttpStatusCode.forbidden:
        throw new AccessDeniedError()
      default:
        throw new UnexpectedError()
    }
  }
}

export namespace RemoteLoadSurveyList {
  export type Result = LoadSurveyList.Result
}
