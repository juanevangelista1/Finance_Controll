import type { ICreditCardRepository } from '../../../domain/creditCard/repositories/ICreditCardRepository'

export class DeleteCreditCardUseCase {
  constructor(private readonly repository: ICreditCardRepository) {}

  execute(id: string): void {
    this.repository.delete(id)
  }
}
