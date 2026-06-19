'use client'

import { useMemo } from 'react'
import type { Transaction } from '../../domain/transaction/entities/Transaction'
import { EXPENSE_GROUPS, getExpenseGroup, type ExpenseGroupKey } from '../../domain/transaction/value-objects/ExpenseGroups'
import { getCategoryLabel } from '../../domain/transaction/value-objects/CategoryRegistry'

export interface ExpenseGroupSummary {
  key: ExpenseGroupKey
  label: string
  icon: string
  total: number
  items: { category: string; label: string; amount: number }[]
}

export function useExpenseGroups(transactions: Transaction[], month: number, year: number): ExpenseGroupSummary[] {
  return useMemo(() => {
    const monthOutcome = transactions.filter((t) => {
      const d = new Date(t.createdAt)
      return t.type === 'outcome' && d.getMonth() === month && d.getFullYear() === year
    })

    const categorySpend: Record<string, number> = {}
    monthOutcome.forEach((t) => {
      categorySpend[t.category] = (categorySpend[t.category] ?? 0) + t.amount
    })

    return EXPENSE_GROUPS.map((def) => {
      const items = Object.entries(categorySpend)
        .filter(([cat]) => getExpenseGroup(cat) === def.key)
        .sort((a, b) => b[1] - a[1])
        .map(([category, amount]) => ({
          category,
          label: getCategoryLabel('outcome', category),
          amount,
        }))

      return {
        key: def.key,
        label: def.label,
        icon: def.icon,
        total: items.reduce((s, i) => s + i.amount, 0),
        items,
      }
    })
  }, [transactions, month, year])
}
