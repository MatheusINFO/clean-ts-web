import { AddAccount } from '@/domain/usecases'
import { makeAxiosHttpClientFactory, makeApiUrl } from '@/main/factories/http'
import { RemoteAddAccount } from '@/data/usecases/add-account/remote-add-account'

export const makeRemoteAddAccountFactory = (): AddAccount => {
  return new RemoteAddAccount(
    makeApiUrl('signup'),
    makeAxiosHttpClientFactory()
  )
}
