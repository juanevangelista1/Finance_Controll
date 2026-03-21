import { useMemo } from 'react'
import type { Transaction } from '../../domain/transaction/entities/Transaction'
import { MONTHS_SHORT } from '../../shared/utils/formatter'

export interface MonthlyData {
  month: string
  income: number
  outcome: number
  total: number
}

export interface CategoryData {
  name: string
  value: number
  fill: string
}

const CATEGORY_COLORS = [
  '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#3b82f6',
  '#ec4899', '#14b8a6', '#f97316', '#6366f1', '#84cc16',
]

export function useReports(transactions: Transaction[], year: number) {
  const monthlyData: MonthlyData[] = useMemo(() => {
    return MONTHS_SHORT.map((month, index) => {
      const monthTransactions = transactions.filter((t) => {
        const d = new Date(t.createdAt)
        return d.getFullYear() === year && d.getMonth() === index
      })
      const income = monthTransactions
        .filter((t) => t.type === 'income')
        .reduce((s, t) => s + t.amount, 0)
      const outcome = monthTransactions
        .filter((t) => t.type === 'outcome')
        .reduce((s, t) => s + t.amount, 0)
      return { month, income, outcome, total: income - outcome }
    })
  }, [transactions, year])

  const categoryData: CategoryData[] = useMemo(() => {
    const outcomeTransactions = transactions.filter((t) => t.type === 'outcome')
    const categoryMap = new Map<string, number>()

    outcomeTransactions.forEach((t) => {
      categoryMap.set(t.category, (categoryMap.get(t.category) ?? 0) + t.amount)
    })

    return Array.from(categoryMap.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([name, value], i) => ({
        name,
        value,
        fill: CATEGORY_COLORS[i % CATEGORY_COLORS.length],
      }))
  }, [transactions])

  const balanceEvolution: { month: string; balance: number }[] = useMemo(() => {
    let accumulated = 0
    return monthlyData.map((d) => {
      accumulated += d.total
      return { month: d.month, balance: accumulated }
    })
  }, [monthlyData])

  return { monthlyData, categoryData, balanceEvolution }
}
