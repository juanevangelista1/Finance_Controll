'use client'

import { ArrowDownCircle, ArrowUpCircle, Wallet } from 'lucide-react'
import { formatCurrency } from '../../../shared/utils/formatter'
import { useSummary } from '../../hooks/useSummary'
import { useTransactionsContext } from '../../contexts/TransactionsContext'
import { cn } from '../../../shared/utils/cn'

export function Summary() {
  const { transactions } = useTransactionsContext()
  const summary = useSummary(transactions)

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {/* Entradas */}
      <div className="rounded-xl border border-dt-green/20 bg-dt-card p-5 transition-all duration-200 hover:shadow-lg hover:shadow-dt-green/5 hover:-translate-y-0.5 animate-slide-up">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-dt-muted">Entradas</span>
          <div className="rounded-lg bg-dt-green/10 p-2">
            <ArrowUpCircle className="h-4 w-4 text-dt-green" />
          </div>
        </div>
        <p className="text-2xl font-bold text-dt-green">{formatCurrency(summary.income)}</p>
        <p className="mt-1.5 text-xs text-dt-muted">{summary.incomeCount} transação(ões)</p>
      </div>

      {/* Saídas */}
      <div className="rounded-xl border border-dt-red/20 bg-dt-card p-5 transition-all duration-200 hover:shadow-lg hover:shadow-dt-red/5 hover:-translate-y-0.5 animate-slide-up">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-dt-muted">Saídas</span>
          <div className="rounded-lg bg-dt-red/10 p-2">
            <ArrowDownCircle className="h-4 w-4 text-dt-red" />
          </div>
        </div>
        <p className="text-2xl font-bold text-dt-red">{formatCurrency(summary.outcome)}</p>
        <p className="mt-1.5 text-xs text-dt-muted">{summary.outcomeCount} transação(ões)</p>
      </div>

      {/* Total */}
      <div className={cn(
        'rounded-xl border p-5 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 animate-slide-up',
        summary.total >= 0
          ? 'border-dt-green/30 bg-dt-green/10 hover:shadow-dt-green/10'
          : 'border-dt-red/30 bg-dt-red/10 hover:shadow-dt-red/10',
      )}>
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-dt-muted">Saldo</span>
          <div className={cn('rounded-lg p-2', summary.total >= 0 ? 'bg-dt-green/20' : 'bg-dt-red/20')}>
            <Wallet className={cn('h-4 w-4', summary.total >= 0 ? 'text-dt-green' : 'text-dt-red')} />
          </div>
        </div>
        <p className={cn('text-2xl font-bold', summary.total >= 0 ? 'text-dt-green' : 'text-dt-red')}>
          {formatCurrency(summary.total)}
        </p>
        <p className="mt-1.5 text-xs text-dt-muted">
          {summary.total >= 0 ? 'Saldo positivo' : 'Saldo negativo'} • {summary.count} transações
        </p>
      </div>
    </div>
  )
}
