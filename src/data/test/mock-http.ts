import faker from 'faker'
import { HttpClient, HttpMethod, HttpStatusCode } from '@/data/protocols/http'

export const mockHttpRequest = (): HttpClient.Params => ({
  url: faker.internet.url(),
  body: faker.random.objectElement(),
  headers: faker.random.objectElement(),
  method: faker.random.arrayElement(['post', 'get', 'put']),
})

export class HttpClientSpy<R = any> implements HttpClient<R> {
  url?: string
  body?: any
  headers?: any
  method: HttpMethod
  response: HttpClient.Response<R> = {
    statusCode: HttpStatusCode.success,
  }

  async request(params: HttpClient.Params): Promise<HttpClient.Response<R>> {
    this.url = params.url
    this.body = params.body
    this.headers = params.headers
    this.method = params.method
    return this.response
  }
}
