import type { Transaction } from '../../domain/transaction/entities/Transaction'
import type { ITransactionRepository } from '../../domain/transaction/repositories/ITransactionRepository'
import type { CreateTransactionDTO } from '../../application/transaction/dtos/TransactionDTO'

const STORAGE_KEY = 'dt-money:v2:transactions'

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
}

/**
 * Migrates legacy transactions (without new fields) to the current schema.
 * Ensures backward compatibility when new fields are added.
 */
function migrateTransaction(raw: Record<string, unknown>): Transaction {
  return {
    id: raw.id as string,
    description: raw.description as string,
    type: raw.type as 'income' | 'outcome',
    amount: raw.amount as number,
    category: raw.category as string,
    subcategory: (raw.subcategory as string) ?? undefined,
    tags: Array.isArray(raw.tags) ? (raw.tags as string[]) : [],
    notes: (raw.notes as string) ?? undefined,
    createdAt: raw.createdAt as string,
  }
}

export class LocalStorageTransactionRepository implements ITransactionRepository {
  private getAll(): Transaction[] {
    if (typeof window === 'undefined') return []
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return []
    const parsed = JSON.parse(stored) as Record<string, unknown>[]
    return parsed.map(migrateTransaction)
  }

  private persist(transactions: Transaction[]): void {
    if (typeof window === 'undefined') return
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions))
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
      subcategory: data.subcategory,
      tags: data.tags ?? [],
      notes: data.notes,
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
      localStorage.removeItem(STORAGE_KEY)
    }
  }
}
