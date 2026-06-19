import type { ICreditCardRepository } from '../../../domain/creditCard/repositories/ICreditCardRepository'
import type { CreditCard } from '../../../domain/creditCard/entities/CreditCard'

export class GetCreditCardsUseCase {
  constructor(private readonly repository: ICreditCardRepository) {}

  execute(): CreditCard[] {
    return this.repository.findAll()
  }
}
