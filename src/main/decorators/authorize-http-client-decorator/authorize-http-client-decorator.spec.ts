import faker from 'faker'

import { mockAccountModel } from '@/domain/test'
import { GetStorageSpy, HttpClientSpy, mockHttpRequest } from '@/data/test'
import { AuthorizeHttpClientDecorator } from './authorize-http-client-decorator'

type SutTypes = {
  sut: AuthorizeHttpClientDecorator
  getStorageSpy: GetStorageSpy
  httpClientSpy: HttpClientSpy
}

const makeSut = (): SutTypes => {
  const httpClientSpy = new HttpClientSpy()
  const getStorageSpy = new GetStorageSpy()
  const sut = new AuthorizeHttpClientDecorator(getStorageSpy, httpClientSpy)

  return {
    sut,
    getStorageSpy,
    httpClientSpy,
  }
}

describe('AuthorizeHttpClientDecorator', () => {
  it('Should call GetStorage with correct value', async () => {
    const { sut, getStorageSpy } = makeSut()
    await sut.request(mockHttpRequest())
    expect(getStorageSpy.key).toBe('account')
  })

  it('Should not add headers if getStorage is invalid', async () => {
    const { sut, getStorageSpy, httpClientSpy } = makeSut()
    jest.spyOn(getStorageSpy, 'get').mockReturnValueOnce(null)
    const httpRequest = mockHttpRequest()
    delete httpRequest.headers
    await sut.request(httpRequest)

    expect(httpClientSpy.url).toBe(httpRequest.url)
    expect(httpClientSpy.headers).toBeFalsy()
  })

  it('Should add headers to HttpGetClient', async () => {
    const { sut, getStorageSpy, httpClientSpy } = makeSut()
    getStorageSpy.value = mockAccountModel()
    const httpRequest = mockHttpRequest()
    delete httpRequest.headers
    await sut.request(httpRequest)

    expect(httpClientSpy.url).toBe(httpRequest.url)
    expect(httpClientSpy.headers).toEqual({
      'x-access-token': getStorageSpy.value.accessToken,
    })
  })

  it('Should merge headers and call HttpGetClient correctly', async () => {
    const { sut, getStorageSpy, httpClientSpy } = makeSut()
    getStorageSpy.value = mockAccountModel()
    const field = faker.random.words()
    const httpRequest = mockHttpRequest()
    httpRequest.headers = {
      field,
    }
    await sut.request(httpRequest)

    expect(httpClientSpy.url).toBe(httpRequest.url)
    expect(httpClientSpy.headers).toEqual({
      field,
      'x-access-token': getStorageSpy.value.accessToken,
    })
  })

  it('Should return the same result as HttpGetClient', async () => {
    const { sut, httpClientSpy } = makeSut()
    const httpResponse = await sut.request(mockHttpRequest())

    expect(httpResponse).toEqual(httpClientSpy.response)
  })
})
