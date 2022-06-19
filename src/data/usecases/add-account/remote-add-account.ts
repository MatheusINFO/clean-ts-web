import { AddAccount } from '@/domain/usecases'
import { EmailInUseError, UnexpectedError } from '@/domain/erros'
import { HttpPostClient, HttpStatusCode } from '@/data/protocols/http'

export class RemoteAddAccount implements AddAccount {
  constructor(
    private readonly url: string,
    private readonly httpClient: HttpPostClient<RemoteAddAccount.Result>
  ) {}

  async add(params: AddAccount.Params): Promise<AddAccount.Result> {
    const httpResponse = await this.httpClient.post({
      url: this.url,
      body: params,
    })

    switch (httpResponse.statusCode) {
      case HttpStatusCode.success:
        return httpResponse.body
      case HttpStatusCode.forbidden:
        throw new EmailInUseError()
      default:
        throw new UnexpectedError()
    }
  }
}

export namespace RemoteAddAccount {
  export type Result = AddAccount.Result
}
