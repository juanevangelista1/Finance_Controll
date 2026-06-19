import type { CreditCard } from '../../domain/creditCard/entities/CreditCard'
import type { ICreditCardRepository } from '../../domain/creditCard/repositories/ICreditCardRepository'
import type { CreateCreditCardDTO, UpdateCreditCardDTO } from '../../application/creditCard/dtos/CreditCardDTO'

const STORAGE_KEY = 'dt-money:v2:credit-cards'

function generateId(): string {
  return `card-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
}

export class LocalStorageCreditCardRepository implements ICreditCardRepository {
  private getAll(): CreditCard[] {
    if (typeof window === 'undefined') return []
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return []
    try {
      const parsed = JSON.parse(stored) as CreditCard[]
      return Array.isArray(parsed) ? parsed : []
    } catch {
      localStorage.setItem(`${STORAGE_KEY}:corrupted:${Date.now()}`, stored)
      console.error('Dados corrompidos em', STORAGE_KEY, '— backup salvo, retornando lista vazia')
      return []
    }
  }

  private persist(cards: CreditCard[]): void {
    if (typeof window === 'undefined') return
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cards))
  }

  findAll(): CreditCard[] {
    return this.getAll()
  }

  create(data: CreateCreditCardDTO): CreditCard {
    const cards = this.getAll()
    const newCard: CreditCard = {
      id: generateId(),
      name: data.name,
      limit: data.limit,
      used: data.used,
      status: data.status,
    }
    this.persist([...cards, newCard])
    return newCard
  }

  update(id: string, data: UpdateCreditCardDTO): void {
    const cards = this.getAll()
    this.persist(cards.map((c) => (c.id === id ? { ...c, ...data } : c)))
  }

  delete(id: string): void {
    const cards = this.getAll()
    this.persist(cards.filter((c) => c.id !== id))
  }
}
