import type { Transaction } from '../entities/Transaction'
import type { CreateTransactionDTO } from '../../../application/transaction/dtos/TransactionDTO'

export interface ITransactionRepository {
  findAll(): Transaction[]
  findById(id: string): Transaction | undefined
  create(data: CreateTransactionDTO): Transaction
  delete(id: string): void
  clear(): void
}
