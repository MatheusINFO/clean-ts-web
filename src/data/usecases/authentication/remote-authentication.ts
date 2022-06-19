import { HttpPostClient, HttpStatusCode } from '@/data/protocols/http'
import { Authentication } from '@/domain/usecases'
import { InvalidCredentialsError, UnexpectedError } from '@/domain/erros'

export class RemoteAuthentication implements Authentication {
  constructor(
    private readonly url: string,
    private readonly httpClient: HttpPostClient<Authentication.Result>
  ) {}

  async auth(params: Authentication.Params): Promise<Authentication.Result> {
    const httpResponse = await this.httpClient.post({
      url: this.url,
      body: params,
    })

    switch (httpResponse.statusCode) {
      case HttpStatusCode.success:
        return httpResponse.body
      case HttpStatusCode.unauthorized:
        throw new InvalidCredentialsError()
      default:
        throw new UnexpectedError()
    }
  }
}

export namespace RemoteAuthentication {
  export type Result = Authentication.Result
}
