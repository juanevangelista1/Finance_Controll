import type { ICreditCardRepository } from '../../../domain/creditCard/repositories/ICreditCardRepository'
import type { CreditCard } from '../../../domain/creditCard/entities/CreditCard'
import type { CreateCreditCardDTO } from '../dtos/CreditCardDTO'

export class CreateCreditCardUseCase {
  constructor(private readonly repository: ICreditCardRepository) {}

  execute(data: CreateCreditCardDTO): CreditCard {
    return this.repository.create(data)
  }
}
