import type { ITransactionRepository } from '../../../domain/transaction/repositories/ITransactionRepository'
import type { Transaction } from '../../../domain/transaction/entities/Transaction'
import type { CreateTransactionDTO } from '../dtos/TransactionDTO'

function generateGroupId(): string {
  return `grp-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
}

function addMonths(dateISO: string, months: number): string {
  const [y, m, d] = dateISO.split('-').map(Number)
  const date = new Date(y, m - 1 + months, d)
  const yy = date.getFullYear()
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const dd = String(date.getDate()).padStart(2, '0')
  return `${yy}-${mm}-${dd}`
}

export class CreateTransactionUseCase {
  constructor(private readonly repository: ITransactionRepository) {}

  execute(data: CreateTransactionDTO): Transaction {
    const total = data.installmentTotal && data.installmentTotal > 1 ? data.installmentTotal : 1

    if (total === 1) {
      return this.repository.create(data)
    }

    const groupId = generateGroupId()
    const items: CreateTransactionDTO[] = Array.from({ length: total }, (_, i) => ({
      ...data,
      date: addMonths(data.date, i),
      installment: { current: i + 1, total, groupId },
    }))

    const created = this.repository.createMany(items)
    return created[0]
  }
}
