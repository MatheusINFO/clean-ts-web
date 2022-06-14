import { HttpPostClient, HttpStatusCode } from '@/data/protocols/http'
import { EmailInUseError, UnexpectedError } from '@/domain/erros'
import { AccountModel } from '@/domain/models'
import { AddAccountParams } from '@/domain/usecases'

export class RemoteAddAccount implements RemoteAddAccount {
  constructor(
    private readonly url: string,
    private readonly httpClient: HttpPostClient<AddAccountParams, AccountModel>
  ) {}

  async add(params: AddAccountParams): Promise<AccountModel> {
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
