import { HttpPostParams } from '@/data/protocols/http'
import axios from 'axios'
import faker from 'faker'
import { AxiosHttpClient } from './axios-http-client'

jest.mock('axios')

const mockedAxiosResult = {
  status: faker.random.number(),
  data: faker.random.objectElement(),
}

const mockedAxios = axios as jest.Mocked<typeof axios>
mockedAxios.post.mockResolvedValue(mockedAxiosResult)

const mockPostRequest = (): HttpPostParams<any> => ({
  url: faker.internet.url(),
  body: faker.random.objectElement(),
})

type SutTypes = {
  sut: AxiosHttpClient
}

const makeSut = (): SutTypes => {
  const sut = new AxiosHttpClient()

  return {
    sut,
  }
}

describe('AxiosHttpClient', () => {
  it('Should call axios with correct data and verb', async () => {
    const request = mockPostRequest()
    const { sut } = makeSut()
    await sut.post(request)
    expect(mockedAxios.post).toHaveBeenCalledWith(request.url, request.body)
  })

  it('Should return the correct statusCode and body', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.post(mockPostRequest())
    expect(httpResponse).toEqual({
      statusCode: mockedAxiosResult.status,
      body: mockedAxiosResult.data,
    })
  })
})
