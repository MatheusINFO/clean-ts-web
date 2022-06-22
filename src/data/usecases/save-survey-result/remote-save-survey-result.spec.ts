import faker from 'faker'
import { mockSaveSurveyResultParams } from '@/domain/test'
import { SaveSurveyResult } from '@/domain/usecases'
import { HttpStatusCode } from '@/data/protocols/http'
import { HttpClientSpy, mockRemoteSurveyResultModel } from '@/data/test'
import { RemoteSaveSurveyResult } from './remote-save-survey-result'

type SutTypes = {
  sut: RemoteSaveSurveyResult
  httpClientSpy: HttpClientSpy<SaveSurveyResult.Result>
}

const makeSut = (url: string = faker.internet.url()): SutTypes => {
  const httpClientSpy = new HttpClientSpy<SaveSurveyResult.Result>()
  const sut = new RemoteSaveSurveyResult(url, httpClientSpy)

  return {
    sut,
    httpClientSpy,
  }
}

describe('RemoteSaveSurveyResult', () => {
  it('Should call HttpPutClient with correct url and method', async () => {
    const url = faker.internet.url()
    const { sut, httpClientSpy } = makeSut(url)
    httpClientSpy.response = {
      statusCode: HttpStatusCode.success,
      body: Object.assign(mockRemoteSurveyResultModel(), {
        date: faker.date.recent(),
      }),
    }
    const saveSurveyResultParams = mockSaveSurveyResultParams()
    await sut.save(saveSurveyResultParams)
    expect(httpClientSpy.url).toBe(url)
    expect(httpClientSpy.method).toBe('put')
    expect(httpClientSpy.body).toBe(saveSurveyResultParams)
  })
})
