import { HttpPostClient, HttpPostParams } from '../protocols/http'

export class HttpPostClientSpy implements HttpPostClient {
  url?: string

  async post(params: HttpPostParams): Promise<void> {
    this.url = params.url
  }
}
