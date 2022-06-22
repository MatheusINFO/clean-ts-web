import axios, { AxiosResponse } from 'axios'
import { HttpClient } from '@/data/protocols/http'

export class AxiosHttpClient implements HttpClient {
  async request(params: HttpClient.Params): Promise<HttpClient.Response<any>> {
    let axiosResponse: AxiosResponse

    try {
      axiosResponse = await axios.request({
        url: params.url,
        data: params.body,
        headers: params.headers,
        method: params.method,
      })
    } catch (error) {
      axiosResponse = error.response
    }

    return {
      body: axiosResponse.data,
      statusCode: axiosResponse.status,
    }
  }
}
