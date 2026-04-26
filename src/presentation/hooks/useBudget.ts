'use client'

import { useMemo } from 'react'
import type { Transaction } from '../../domain/transaction/entities/Transaction'
import { BUDGET_BUCKETS, getCategoryBucket, type BucketKey } from '../../domain/transaction/value-objects/BudgetRules'
import { getCategoryLabel } from '../../domain/transaction/value-objects/CategoryRegistry'

export interface BucketProgress {
  key: BucketKey
  label: string
  description: string
  icon: string
  percentage: number
  color: string
  target: number
  spent: number
  remaining: number
  progress: number
  status: 'safe' | 'warning' | 'danger'
  topCategories: { category: string; label: string; amount: number }[]
}

export interface BudgetSummary {
  income: number
  totalSpent: number
  buckets: BucketProgress[]
  uncategorizedAmount: number
}

export function useBudget(transactions: Transaction[], month: number, year: number): BudgetSummary {
  return useMemo(() => {
    const monthTx = transactions.filter((t) => {
      const d = new Date(t.createdAt)
      return d.getMonth() === month && d.getFullYear() === year
    })

    const income = monthTx
      .filter((t) => t.type === 'income')
      .reduce((s, t) => s + t.amount, 0)

    const outcomeTx = monthTx.filter((t) => t.type === 'outcome')

    const spentPerBucket: Record<BucketKey, number> = {
      necessidades: 0,
      pessoal: 0,
      investimentos: 0,
    }
    const categorySpend: Record<string, number> = {}
    const categoryBucketMap: Record<string, BucketKey | null> = {}
    let uncategorizedAmount = 0

    outcomeTx.forEach((t) => {
      categorySpend[t.category] = (categorySpend[t.category] ?? 0) + t.amount
      const bucket = getCategoryBucket(t.category)
      categoryBucketMap[t.category] = bucket
      if (bucket) {
        spentPerBucket[bucket] += t.amount
      } else {
        uncategorizedAmount += t.amount
      }
    })

    const buckets: BucketProgress[] = BUDGET_BUCKETS.map((def) => {
      const target = income * (def.percentage / 100)
      const spent = spentPerBucket[def.key]
      const remaining = Math.max(0, target - spent)
      const progress = target > 0 ? spent / target : 0
      const status: BucketProgress['status'] =
        progress < 0.8 ? 'safe' : progress < 1 ? 'warning' : 'danger'

      const topCategories = Object.entries(categorySpend)
        .filter(([cat]) => categoryBucketMap[cat] === def.key)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 4)
        .map(([category, amount]) => ({
          category,
          label: getCategoryLabel('outcome', category),
          amount,
        }))

      return {
        key: def.key,
        label: def.label,
        description: def.description,
        icon: def.icon,
        percentage: def.percentage,
        color: def.color,
        target,
        spent,
        remaining,
        progress,
        status,
        topCategories,
      }
    })

    const totalSpent = outcomeTx.reduce((s, t) => s + t.amount, 0)

    return { income, totalSpent, buckets, uncategorizedAmount }
  }, [transactions, month, year])
}
