import faker from 'faker'
import { mockAccountModel } from '@/domain/test'
import { GetStorageSpy, HttpGetClientSpy, mockGetRequest } from '@/data/test'
import { AuthorizeHttpGetClientDecorator } from './authorize-http-get-client-decorator'

type SutTypes = {
  sut: AuthorizeHttpGetClientDecorator
  getStorageSpy: GetStorageSpy
  httpGetClientSpy: HttpGetClientSpy
}

const makeSut = (): SutTypes => {
  const httpGetClientSpy = new HttpGetClientSpy()
  const getStorageSpy = new GetStorageSpy()
  const sut = new AuthorizeHttpGetClientDecorator(
    getStorageSpy,
    httpGetClientSpy
  )

  return {
    sut,
    getStorageSpy,
    httpGetClientSpy,
  }
}

describe('AuthorizeHttpGetClientDecorator', () => {
  it('Should call GetStorage with correct value', async () => {
    const { sut, getStorageSpy } = makeSut()
    await sut.get(mockGetRequest())
    expect(getStorageSpy.key).toBe('account')
  })

  it('Should not add headers if getStorage is invalid', async () => {
    const { sut, getStorageSpy, httpGetClientSpy } = makeSut()
    jest.spyOn(getStorageSpy, 'get').mockReturnValueOnce(null)
    const httpRequest = mockGetRequest()
    delete httpRequest.headers
    await sut.get(httpRequest)

    expect(httpGetClientSpy.url).toBe(httpRequest.url)
    expect(httpGetClientSpy.headers).toBeFalsy()
  })

  it('Should add headers to HttpGetClient', async () => {
    const { sut, getStorageSpy, httpGetClientSpy } = makeSut()
    getStorageSpy.value = mockAccountModel()
    const httpRequest = mockGetRequest()
    delete httpRequest.headers
    await sut.get(httpRequest)

    expect(httpGetClientSpy.url).toBe(httpRequest.url)
    expect(httpGetClientSpy.headers).toEqual({
      'x-access-token': getStorageSpy.value.accessToken,
    })
  })

  it('Should merge headers and call HttpGetClient correctly', async () => {
    const { sut, getStorageSpy, httpGetClientSpy } = makeSut()
    getStorageSpy.value = mockAccountModel()
    const field = faker.random.words()
    const httpRequest = mockGetRequest()
    httpRequest.headers = {
      field,
    }
    await sut.get(httpRequest)

    expect(httpGetClientSpy.url).toBe(httpRequest.url)
    expect(httpGetClientSpy.headers).toEqual({
      field,
      'x-access-token': getStorageSpy.value.accessToken,
    })
  })

  it('Should return the same result as HttpGetClient', async () => {
    const { sut, httpGetClientSpy } = makeSut()
    const httpResponse = await sut.get(mockGetRequest())

    expect(httpResponse).toEqual(httpGetClientSpy.response)
  })
})
