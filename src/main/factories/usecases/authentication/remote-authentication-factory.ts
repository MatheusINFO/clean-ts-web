import { Authentication } from '@/domain/usecases'
import { RemoteAuthentication } from '@/data/usecases'
import { makeAxiosHttpClientFactory, makeApiUrl } from '@/main/factories/http'

export const makeRemoteAuthenticationFactory = (): Authentication => {
  return new RemoteAuthentication(
    makeApiUrl('login'),
    makeAxiosHttpClientFactory()
  )
}
