import axios from 'axios'
import { HttpPostParams, HttpResponse } from '@/data/protocols/http'

export class AxiosHttpClient {
  async post(params: HttpPostParams<any>): Promise<HttpResponse<any>> {
    await axios(params.url)
    return null
  }
}
