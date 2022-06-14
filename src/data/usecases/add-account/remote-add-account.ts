import { HttpPostClient } from '@/data/protocols/http'
import { AccountModel } from '@/domain/models'
import { AddAccountParams } from '@/domain/usecases'

export class RemoteAddAccount implements RemoteAddAccount {
  constructor(
    private readonly url: string,
    private readonly httpClient: HttpPostClient<AddAccountParams, AccountModel>
  ) {}

  async add(params: AddAccountParams): Promise<AccountModel> {
    await this.httpClient.post({
      url: this.url,
      body: params,
    })
    return null
  }
}
