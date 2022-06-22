import { SaveSurveyResult } from '@/domain/usecases'
import { HttpClient } from '@/data/protocols/http'
import { RemoteSurveyResultModel } from '@/data/models'

export class RemoteSaveSurveyResult implements SaveSurveyResult {
  constructor(
    private readonly url: string,
    private readonly httpGetClient: HttpClient<SaveSurveyResult.Result>
  ) {}

  async save(
    params: SaveSurveyResult.Params
  ): Promise<SaveSurveyResult.Result> {
    await this.httpGetClient.request({
      url: this.url,
      method: 'put',
    })
    return null
  }
}

export namespace RemoteSaveSurveyResult {
  export type Result = RemoteSurveyResultModel
}
