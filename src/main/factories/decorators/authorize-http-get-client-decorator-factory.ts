import { HttpGetClient } from '@/data/protocols/http'
import { makeAxiosHttpClientFactory } from '@/main/factories/http'
import { AuthorizeHttpGetClientDecorator } from '@/main/decorators'
import { makeLocalStorageAdapterFactory } from '@/main/factories/cache'

export const makeAuthorizeHttpGetClientDecoratorFactory = (): HttpGetClient => {
  return new AuthorizeHttpGetClientDecorator(
    makeLocalStorageAdapterFactory(),
    makeAxiosHttpClientFactory()
  )
}
