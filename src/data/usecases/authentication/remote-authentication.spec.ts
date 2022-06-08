import { HttpPostClient } from '../../protocols/http'
import { RemoteAuthentication } from './remote-authentication'

class HttpPostClientSpy implements HttpPostClient {
  url?: string

  async post(url: string): Promise<void> {
    this.url = url
  }
}

describe('RemoteAuthentication', () => {
  it('Should call HttpPostClient with correct URL', async () => {
    const url = 'any_url'
    const httpClient = new HttpPostClientSpy()
    const sut = new RemoteAuthentication(url, httpClient)
    await sut.auth()
    expect(httpClient.url).toBe(url)
  })
})
