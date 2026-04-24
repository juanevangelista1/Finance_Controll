import type { ITransactionRepository } from '../../../domain/transaction/repositories/ITransactionRepository'
import type { Transaction } from '../../../domain/transaction/entities/Transaction'
import type { TransactionFilterDTO } from '../dtos/TransactionDTO'

export class GetTransactionsUseCase {
  constructor(private readonly repository: ITransactionRepository) {}

  execute(filter?: TransactionFilterDTO): Transaction[] {
    let transactions = this.repository.findAll()

    if (filter?.query && filter.query.trim()) {
      const query = filter.query.toLowerCase().trim()
      transactions = transactions.filter(
        (t) =>
          t.description.toLowerCase().includes(query) ||
          t.category.toLowerCase().includes(query) ||
          (t.subcategory && t.subcategory.toLowerCase().includes(query)) ||
          (t.tags && t.tags.some((tag) => tag.toLowerCase().includes(query))),
      )
    }

    if (filter?.month !== undefined && filter?.year !== undefined) {
      transactions = transactions.filter((t) => {
        const date = new Date(t.createdAt)
        return date.getMonth() === filter.month && date.getFullYear() === filter.year
      })
    } else if (filter?.year !== undefined) {
      transactions = transactions.filter((t) => {
        const date = new Date(t.createdAt)
        return date.getFullYear() === filter.year
      })
    }

    if (filter?.category) {
      transactions = transactions.filter((t) => t.category === filter.category)
    }

    if (filter?.subcategory) {
      transactions = transactions.filter((t) => t.subcategory === filter.subcategory)
    }

    if (filter?.tag) {
      transactions = transactions.filter(
        (t) => t.tags && t.tags.includes(filter.tag!),
      )
    }

    return transactions.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
  }

  executeAllMonths(year: number): Transaction[] {
    const transactions = this.repository.findAll()
    return transactions.filter((t) => new Date(t.createdAt).getFullYear() === year)
  }
}
