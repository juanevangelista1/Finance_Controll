'use client'

import { useState, useMemo } from 'react'
import { ChevronLeft, ChevronRight, Wallet, TrendingDown, TrendingUp, PiggyBank } from 'lucide-react'
import { useTransactionsContext } from '../../presentation/contexts/TransactionsContext'
import { useMonthlyClosing } from '../../presentation/hooks/useMonthlyClosing'
import { useExpenseGroups } from '../../presentation/hooks/useExpenseGroups'
import { formatCurrency, MONTHS } from '../../shared/utils/formatter'
import { LocalStorageTransactionRepository } from '../../infrastructure/repositories/SessionStorageTransactionRepository'
import { GetTransactionsUseCase } from '../../application/transaction/use-cases/GetTransactionsUseCase'
import { cn } from '../../shared/utils/cn'

export default function ClosingPage() {
  const now = new Date()
  const [month, setMonth] = useState(now.getMonth())
  const [year, setYear] = useState(now.getFullYear())
  const { transactions: contextTransactions } = useTransactionsContext()

  const allTransactions = useMemo(() => {
    const repo = new LocalStorageTransactionRepository()
    const uc = new GetTransactionsUseCase(repo)
    return uc.execute()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contextTransactions])

  const closing = useMonthlyClosing(allTransactions, month, year)
  const groups = useExpenseGroups(allTransactions, month, year)

  function prevMonth() {
    if (month === 0) { setMonth(11); setYear((y) => y - 1) }
    else setMonth((m) => m - 1)
  }

  function nextMonth() {
    if (month === 11) { setMonth(0); setYear((y) => y + 1) }
    else setMonth((m) => m + 1)
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Fechamento Mensal</h1>
          <p className="mt-1 text-sm text-dt-muted">Resumo consolidado do mês, no estilo da planilha</p>
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-dt-border bg-dt-card px-3 py-2 self-start sm:self-auto">
          <button onClick={prevMonth} className="cursor-pointer p-1 rounded text-dt-muted hover:text-white transition-colors">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="text-sm font-semibold text-white min-w-[130px] text-center">
            {MONTHS[month]} {year}
          </span>
          <button onClick={nextMonth} className="cursor-pointer p-1 rounded text-dt-muted hover:text-white transition-colors">
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        <div className="rounded-xl border border-dt-green/20 bg-dt-card p-4">
          <div className="flex items-center gap-2 mb-2">
            <Wallet className="h-4 w-4 text-dt-green" />
            <span className="text-xs text-dt-muted">Salário / Entradas</span>
          </div>
          <p className="text-xl font-bold text-dt-green">{formatCurrency(closing.income)}</p>
        </div>

        <div className="rounded-xl border border-dt-border bg-dt-card p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown className="h-4 w-4 text-dt-red" />
            <span className="text-xs text-dt-muted">Total Despesas</span>
          </div>
          <p className="text-xl font-bold text-white">{formatCurrency(closing.totalExpenses)}</p>
        </div>

        <div className="rounded-xl border border-emerald-500/20 bg-dt-card p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-4 w-4 text-emerald-400" />
            <span className="text-xs text-dt-muted">Investido</span>
          </div>
          <p className="text-xl font-bold text-emerald-400">{formatCurrency(closing.invested)}</p>
        </div>

        <div className="rounded-xl border border-dt-border bg-dt-card p-4 col-span-2 lg:col-span-1">
          <span className="text-xs text-dt-muted">Despesas + Investimento</span>
          <p className="mt-1 text-xl font-bold text-white">{formatCurrency(closing.totalExpensesWithInvestment)}</p>
        </div>

        <div className="rounded-xl border border-dt-border bg-dt-card p-4">
          <span className="text-xs text-dt-muted">Restante do Mês</span>
          <p className={cn('mt-1 text-xl font-bold', closing.remaining >= 0 ? 'text-emerald-400' : 'text-dt-red')}>
            {formatCurrency(closing.remaining)}
          </p>
        </div>

        <div className="rounded-xl border border-dt-purple/20 bg-dt-card p-4">
          <div className="flex items-center gap-2 mb-2">
            <PiggyBank className="h-4 w-4 text-dt-purple-light" />
            <span className="text-xs text-dt-muted">Saldo Anterior</span>
          </div>
          <p className="text-xl font-bold text-white">{formatCurrency(closing.previousBalance)}</p>
        </div>
      </div>

      {/* Final balance highlight */}
      <div className="rounded-xl border border-dt-purple/30 bg-dt-purple/5 p-5">
        <p className="text-sm text-dt-muted">Saldo Final Acumulado</p>
        <p className={cn('mt-1 text-2xl font-bold', closing.finalBalance >= 0 ? 'text-white' : 'text-dt-red')}>
          {formatCurrency(closing.finalBalance)}
        </p>
      </div>

      {/* Expense groups breakdown */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {groups.map((group) => (
          <div key={group.key} className="rounded-xl border border-dt-border bg-dt-card p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-lg">{group.icon}</span>
                <span className="text-sm font-semibold text-white">{group.label}</span>
              </div>
              <span className="text-sm font-bold text-dt-red">{formatCurrency(group.total)}</span>
            </div>
            {group.items.length === 0 ? (
              <p className="text-xs text-dt-muted">Nenhum gasto neste grupo</p>
            ) : (
              <div className="space-y-1.5">
                {group.items.map((item) => (
                  <div key={item.category} className="flex items-center justify-between text-xs">
                    <span className="text-dt-muted truncate">{item.label}</span>
                    <span className="text-white font-medium">{formatCurrency(item.amount)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
