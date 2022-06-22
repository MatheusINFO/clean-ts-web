import { GetStorage } from '@/data/protocols/cache'
import { HttpClient } from '@/data/protocols/http'

export class AuthorizeHttpClientDecorator implements HttpClient {
  constructor(
    private readonly getStorage: GetStorage,
    private readonly httpGetClient: HttpClient
  ) {}

  async request(params: HttpClient.Params): Promise<HttpClient.Response> {
    const account = this.getStorage.get('account')

    if (account?.accessToken) {
      Object.assign(params, {
        headers: Object.assign(params.headers || {}, {
          'x-access-token': account.accessToken,
        }),
      })
    }

    return await this.httpGetClient.request(params)
  }
}
