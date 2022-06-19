import { AddAccount } from '@/domain/usecases'
import { mockAccountModel } from '@/domain/test'

export class AddAccountSpy implements AddAccount {
  account = mockAccountModel()
  params: AddAccount.Params
  callsCount = 0

  async add(params: AddAccount.Params): Promise<AddAccount.Result> {
    this.callsCount++
    this.params = params
    return this.account
  }
}
