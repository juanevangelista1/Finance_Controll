'use client'

import { useMemo } from 'react'
import type { Transaction } from '../../domain/transaction/entities/Transaction'

export interface MonthlyClosing {
  income: number
  totalExpenses: number
  invested: number
  totalExpensesWithInvestment: number
  remaining: number
  previousBalance: number
  finalBalance: number
}

export function useMonthlyClosing(transactions: Transaction[], month: number, year: number): MonthlyClosing {
  return useMemo(() => {
    const monthTx = transactions.filter((t) => {
      const d = new Date(t.createdAt)
      return d.getMonth() === month && d.getFullYear() === year
    })

    const income = monthTx
      .filter((t) => t.type === 'income')
      .reduce((s, t) => s + t.amount, 0)

    const invested = monthTx
      .filter((t) => t.type === 'outcome' && t.category === 'aporte_investimento')
      .reduce((s, t) => s + t.amount, 0)

    const totalExpenses = monthTx
      .filter((t) => t.type === 'outcome' && t.category !== 'aporte_investimento')
      .reduce((s, t) => s + t.amount, 0)

    const totalExpensesWithInvestment = totalExpenses + invested
    const remaining = income - totalExpensesWithInvestment

    const previousBalance = transactions
      .filter((t) => {
        const d = new Date(t.createdAt)
        return d.getFullYear() < year || (d.getFullYear() === year && d.getMonth() < month)
      })
      .reduce((s, t) => s + (t.type === 'income' ? t.amount : -t.amount), 0)

    const finalBalance = previousBalance + remaining

    return { income, totalExpenses, invested, totalExpensesWithInvestment, remaining, previousBalance, finalBalance }
  }, [transactions, month, year])
}
