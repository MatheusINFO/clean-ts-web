import { SurveyModel } from '@/domain/models'
import { LoadSurveyList } from '@/domain/usecases'

export class RemoteLoadSurveyList implements LoadSurveyList {
  constructor(
    private readonly url: string,
    private readonly httpGetClient: any
  ) {}

  async loadAll(): Promise<SurveyModel> {
    await this.httpGetClient.get({ url: this.url })
    return null
  }
}
