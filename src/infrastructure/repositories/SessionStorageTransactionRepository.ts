import type { Transaction } from '../../domain/transaction/entities/Transaction'
import type { ITransactionRepository } from '../../domain/transaction/repositories/ITransactionRepository'
import type { CreateTransactionDTO } from '../../application/transaction/dtos/TransactionDTO'

const STORAGE_KEY = 'dt-money:v2:transactions'

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
}

export class SessionStorageTransactionRepository implements ITransactionRepository {
  private getAll(): Transaction[] {
    if (typeof window === 'undefined') return []
    const stored = sessionStorage.getItem(STORAGE_KEY)
    if (!stored) return []
    return JSON.parse(stored) as Transaction[]
  }

  private persist(transactions: Transaction[]): void {
    if (typeof window === 'undefined') return
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(transactions))
  }

  findAll(): Transaction[] {
    return this.getAll()
  }

  findById(id: string): Transaction | undefined {
    return this.getAll().find((t) => t.id === id)
  }

  create(data: CreateTransactionDTO): Transaction {
    const transactions = this.getAll()
    // Parse the date as local noon to avoid UTC offset crossing month boundary
    const [y, m, d] = data.date.split('-').map(Number)
    const localDate = new Date(y, m - 1, d, 12, 0, 0)
    const newTransaction: Transaction = {
      id: generateId(),
      description: data.description,
      type: data.type,
      amount: data.amount,
      category: data.category,
      createdAt: localDate.toISOString(),
    }
    this.persist([...transactions, newTransaction])
    return newTransaction
  }

  delete(id: string): void {
    const transactions = this.getAll()
    this.persist(transactions.filter((t) => t.id !== id))
  }

  clear(): void {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem(STORAGE_KEY)
    }
  }
}
