import type { ITransactionRepository } from '../../../domain/transaction/repositories/ITransactionRepository'
import type { Transaction } from '../../../domain/transaction/entities/Transaction'
import type { CreateTransactionDTO } from '../dtos/TransactionDTO'

export class CreateTransactionUseCase {
  constructor(private readonly repository: ITransactionRepository) {}

  execute(data: CreateTransactionDTO): Transaction {
    return this.repository.create(data)
  }
}
