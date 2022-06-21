import { HttpGetClient } from '@/data/protocols/http'
import { LoadSurveyResult } from '@/domain/usecases'

export class RemoteLoadSurveyResult implements LoadSurveyResult {
  constructor(
    private readonly url: string,
    private readonly httpGetClient: HttpGetClient
  ) {}

  async load(): Promise<LoadSurveyResult.Result> {
    await this.httpGetClient.get({ url: this.url })
    return null
  }
}
