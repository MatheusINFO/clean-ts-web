import { AccountModel } from '@/domain/models'
import { HttpPostClient, HttpStatusCode } from '@/data/protocols/http'
import { Authentication, AuthenticationParams } from '@/domain/usecases'
import { InvalidCredentialsError, UnexpectedError } from '@/domain/erros'

export class RemoteAuthentication implements Authentication {
  constructor(
    private readonly url: string,
    private readonly httpClient: HttpPostClient<AccountModel>
  ) {}

  async auth(params: AuthenticationParams): Promise<AccountModel> {
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
