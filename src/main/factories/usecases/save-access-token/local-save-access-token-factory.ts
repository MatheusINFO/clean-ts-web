import { makeLocalStorageAdapterFactory } from '@/main/factories/cache'
import { LocalSaveAccessToken } from '@/data/usecases/save-access-token/local-save-access-token'

export const makeLocalSaveAccessTokenFactory = (): LocalSaveAccessToken => {
  return new LocalSaveAccessToken(makeLocalStorageAdapterFactory())
}
