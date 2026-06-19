import type { CreditCard } from '../entities/CreditCard'
import type { CreateCreditCardDTO, UpdateCreditCardDTO } from '../../../application/creditCard/dtos/CreditCardDTO'

export interface ICreditCardRepository {
  findAll(): CreditCard[]
  create(data: CreateCreditCardDTO): CreditCard
  update(id: string, data: UpdateCreditCardDTO): void
  delete(id: string): void
}
