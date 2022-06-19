import { AccessDeniedError, UnexpectedError } from '@/domain/erros'
import { LoadSurveyList } from '@/domain/usecases'
import { HttpGetClient, HttpStatusCode } from '@/data/protocols/http'

export class RemoteLoadSurveyList implements LoadSurveyList {
  constructor(
    private readonly url: string,
    private readonly httpGetClient: HttpGetClient<RemoteLoadSurveyList.Result>
  ) {}

  async loadAll(): Promise<LoadSurveyList.Result> {
    const httpResponse = await this.httpGetClient.get({ url: this.url })

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
