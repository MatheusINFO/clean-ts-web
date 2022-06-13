import { AxiosHttpClient } from '@/infra/http/axios-http-client/axios-http-client'

export const makeAxiosHttpClientFactory = (): AxiosHttpClient => {
  return new AxiosHttpClient()
}
