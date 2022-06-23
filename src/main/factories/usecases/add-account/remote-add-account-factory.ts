import { AddAccount } from '@/domain/usecases'
import { RemoteAddAccount } from '@/data/usecases'
import { makeAxiosHttpClientFactory, makeApiUrl } from '@/main/factories/http'

export const makeRemoteAddAccountFactory = (): AddAccount => {
  return new RemoteAddAccount(
    makeApiUrl('signup'),
    makeAxiosHttpClientFactory()
  )
}
