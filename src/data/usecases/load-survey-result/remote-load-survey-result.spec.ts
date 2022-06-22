import faker from 'faker'
import { LoadSurveyResult } from '@/domain/usecases'
import { AccessDeniedError, UnexpectedError } from '@/domain/erros'
import { HttpStatusCode } from '@/data/protocols/http'
import { HttpClientSpy, mockRemoteSurveyResultModel } from '@/data/test'
import { RemoteLoadSurveyResult } from './remote-load-survey-result'

type SutTypes = {
  sut: RemoteLoadSurveyResult
  httpClientSpy: HttpClientSpy<LoadSurveyResult.Result>
}

const makeSut = (url: string = faker.internet.url()): SutTypes => {
  const httpClientSpy = new HttpClientSpy<LoadSurveyResult.Result>()
  const sut = new RemoteLoadSurveyResult(url, httpClientSpy)

  return {
    sut,
    httpClientSpy,
  }
}

describe('RemoteLoadSurveyResult', () => {
  it('Should call HttpGetClient with correct url and method', async () => {
    const url = faker.internet.url()
    const { sut, httpClientSpy } = makeSut(url)
    httpClientSpy.response = {
      statusCode: HttpStatusCode.success,
      body: Object.assign(mockRemoteSurveyResultModel(), {
        date: faker.date.recent(),
      }),
    }
    await sut.load()
    expect(httpClientSpy.url).toBe(url)
    expect(httpClientSpy.method).toBe('get')
  })

  it('Should call AccessDeniedError if HttpGetClient returns 403', async () => {
    const { sut, httpClientSpy } = makeSut()
    httpClientSpy.response = {
      statusCode: HttpStatusCode.forbidden,
    }
    const promise = sut.load()
    await expect(promise).rejects.toThrow(new AccessDeniedError())
  })

  it('Should call UnexpectedError if HttpGetClient returns 404', async () => {
    const { sut, httpClientSpy } = makeSut()
    httpClientSpy.response = {
      statusCode: HttpStatusCode.notFound,
    }
    const promise = sut.load()
    await expect(promise).rejects.toThrow(new UnexpectedError())
  })

  it('Should call UnexpectedError if HttpGetClient returns 500', async () => {
    const { sut, httpClientSpy } = makeSut()
    httpClientSpy.response = {
      statusCode: HttpStatusCode.serverError,
    }
    const promise = sut.load()
    await expect(promise).rejects.toThrow(new UnexpectedError())
  })

  it('Should return a SurveyResult on success', async () => {
    const { sut, httpClientSpy } = makeSut()
    const httpResponse = Object.assign(mockRemoteSurveyResultModel(), {
      date: faker.date.recent(),
    })
    httpClientSpy.response = {
      statusCode: HttpStatusCode.success,
      body: httpResponse,
    }
    const surveyResult = await sut.load()
    expect(surveyResult).toEqual({
      ...httpResponse,
      date: new Date(httpResponse.date),
    })
  })
})
