import { Authentication } from '@/domain/usecases'
import { mockAccountModel } from '@/domain/test'

export class AuthenticationSpy implements Authentication {
  account = mockAccountModel()
  params: Authentication.Params
  callsCount = 0

  async auth(params: Authentication.Params): Promise<Authentication.Result> {
    this.callsCount++
    this.params = params
    return this.account
  }
}
