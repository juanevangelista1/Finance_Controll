import type { ICreditCardRepository } from '../../../domain/creditCard/repositories/ICreditCardRepository'
import type { UpdateCreditCardDTO } from '../dtos/CreditCardDTO'

export class UpdateCreditCardUseCase {
  constructor(private readonly repository: ICreditCardRepository) {}

  execute(id: string, data: UpdateCreditCardDTO): void {
    this.repository.update(id, data)
  }
}
