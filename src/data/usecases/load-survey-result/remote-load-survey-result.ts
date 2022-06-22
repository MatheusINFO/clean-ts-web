import { LoadSurveyResult } from '@/domain/usecases'
import { AccessDeniedError, UnexpectedError } from '@/domain/erros'
import { RemoteSurveyResultModel } from '@/data/models'
import { HttpClient, HttpStatusCode } from '@/data/protocols/http'

export class RemoteLoadSurveyResult implements LoadSurveyResult {
  constructor(
    private readonly url: string,
    private readonly httpGetClient: HttpClient<LoadSurveyResult.Result>
  ) {}

  async load(): Promise<LoadSurveyResult.Result> {
    const httpResponse = await this.httpGetClient.request({
      url: this.url,
      method: 'get',
    })

    switch (httpResponse.statusCode) {
      case HttpStatusCode.success:
        return Object.assign({}, httpResponse.body, {
          date: new Date(httpResponse.body.date),
        })
      case HttpStatusCode.forbidden:
        throw new AccessDeniedError()
      default:
        throw new UnexpectedError()
    }
  }
}

export namespace RemoteLoadSurveyResult {
  export type Result = RemoteSurveyResultModel
}
