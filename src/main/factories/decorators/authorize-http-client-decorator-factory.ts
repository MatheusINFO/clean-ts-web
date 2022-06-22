import { HttpClient } from '@/data/protocols/http'
import { makeAxiosHttpClientFactory } from '@/main/factories/http'
import { AuthorizeHttpClientDecorator } from '@/main/decorators'
import { makeLocalStorageAdapterFactory } from '@/main/factories/cache'

export const makeAuthorizeHttpClientDecoratorFactory = (): HttpClient => {
  return new AuthorizeHttpClientDecorator(
    makeLocalStorageAdapterFactory(),
    makeAxiosHttpClientFactory()
  )
}
