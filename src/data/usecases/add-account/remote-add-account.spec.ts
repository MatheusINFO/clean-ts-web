import faker from 'faker'
import { AccountModel } from '@/domain/models'
import { mockAccountModel } from '@/domain/test'
import { UnexpectedError, EmailInUseError } from '@/domain/erros'
import { mockAddAccount } from '@/domain/test/mock-add-account'
import { HttpPostClientSpy } from '@/data/test'
import { HttpStatusCode } from '@/data/protocols/http'
import { RemoteAddAccount } from './remote-add-account'

type SutTypes = {
  sut: RemoteAddAccount
  httpPostClientSpy: HttpPostClientSpy<AccountModel>
}

const makeSut = (url: string = faker.internet.url()): SutTypes => {
  const httpPostClientSpy = new HttpPostClientSpy<AccountModel>()
  const sut = new RemoteAddAccount(url, httpPostClientSpy)

  return {
    sut,
    httpPostClientSpy,
  }
}

describe('RemoteAddAccount', () => {
  it('Should call HttpPostClient with correct URL', async () => {
    const url = faker.internet.url()
    const { sut, httpPostClientSpy } = makeSut(url)
    await sut.add(mockAddAccount())
    expect(httpPostClientSpy.url).toBe(url)
  })

  it('Should call HttpPostClient with correct body', async () => {
    const { sut, httpPostClientSpy } = makeSut()
    const addAccountParams = mockAddAccount()
    await sut.add(addAccountParams)
    expect(httpPostClientSpy.body).toEqual(addAccountParams)
  })

  it('Should call UnexpectedError if HttpPostClient returns 400', async () => {
    const { sut, httpPostClientSpy } = makeSut()
    httpPostClientSpy.response = {
      statusCode: HttpStatusCode.badRequest,
    }
    const promise = sut.add(mockAddAccount())
    await expect(promise).rejects.toThrow(new UnexpectedError())
  })

  it('Should call EmailInUseError if HttpPostClient returns 403', async () => {
    const { sut, httpPostClientSpy } = makeSut()
    httpPostClientSpy.response = {
      statusCode: HttpStatusCode.forbidden,
    }
    const promise = sut.add(mockAddAccount())
    await expect(promise).rejects.toThrow(new EmailInUseError())
  })

  it('Should call UnexpectedError if HttpPostClient returns 404', async () => {
    const { sut, httpPostClientSpy } = makeSut()
    httpPostClientSpy.response = {
      statusCode: HttpStatusCode.noContent,
    }
    const promise = sut.add(mockAddAccount())
    await expect(promise).rejects.toThrow(new UnexpectedError())
  })

  it('Should call UnexpectedError if HttpPostClient returns 500', async () => {
    const { sut, httpPostClientSpy } = makeSut()
    httpPostClientSpy.response = {
      statusCode: HttpStatusCode.serverError,
    }
    const promise = sut.add(mockAddAccount())
    await expect(promise).rejects.toThrow(new UnexpectedError())
  })

  it('Should return an AccountModel if HttpPostClient returns 200', async () => {
    const { sut, httpPostClientSpy } = makeSut()
    const httpResult = mockAccountModel()
    httpPostClientSpy.response = {
      statusCode: HttpStatusCode.success,
      body: httpResult,
    }
    const account = await sut.add(mockAddAccount())
    expect(account).toEqual(httpResult)
  })
})
