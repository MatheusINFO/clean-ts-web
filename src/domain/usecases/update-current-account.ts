import { AccountModel } from '@/domain/models'

export interface UpdateCurrentAccount {
  update: (account: AccountModel) => Promise<void>
}
