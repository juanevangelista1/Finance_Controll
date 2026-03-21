import { useMemo } from 'react'
import type { Transaction } from '../../domain/transaction/entities/Transaction'

export interface Summary {
  income: number
  outcome: number
  total: number
  count: number
  incomeCount: number
  outcomeCount: number
}

export function useSummary(transactions: Transaction[]): Summary {
  return useMemo(() => {
    const income = transactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0)

    const outcome = transactions
      .filter((t) => t.type === 'outcome')
      .reduce((sum, t) => sum + t.amount, 0)

    return {
      income,
      outcome,
      total: income - outcome,
      count: transactions.length,
      incomeCount: transactions.filter((t) => t.type === 'income').length,
      outcomeCount: transactions.filter((t) => t.type === 'outcome').length,
    }
  }, [transactions])
}
