import { SaveSurveyResult } from '@/domain/usecases'
import { HttpClient, HttpStatusCode } from '@/data/protocols/http'
import { RemoteSurveyResultModel } from '@/data/models'
import { AccessDeniedError, UnexpectedError } from '@/domain/erros'

export class RemoteSaveSurveyResult implements SaveSurveyResult {
  constructor(
    private readonly url: string,
    private readonly httpGetClient: HttpClient<SaveSurveyResult.Result>
  ) {}

  async save(
    params: SaveSurveyResult.Params
  ): Promise<SaveSurveyResult.Result> {
    const httpResponse = await this.httpGetClient.request({
      url: this.url,
      method: 'put',
      body: params,
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

export namespace RemoteSaveSurveyResult {
  export type Result = RemoteSurveyResultModel
}
