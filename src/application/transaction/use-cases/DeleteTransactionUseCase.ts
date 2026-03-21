import type { ITransactionRepository } from '../../../domain/transaction/repositories/ITransactionRepository'

export class DeleteTransactionUseCase {
  constructor(private readonly repository: ITransactionRepository) {}

  execute(id: string): void {
    this.repository.delete(id)
  }
}
