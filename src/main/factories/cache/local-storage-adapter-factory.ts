import { LocalStorageAdapter } from '@/infra/cache/local-storage-adapter/local-storage-adapter'

export const makeLocalStorageAdapterFactory = (): LocalStorageAdapter => {
  return new LocalStorageAdapter()
}
