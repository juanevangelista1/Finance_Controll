'use client'

import { useState, useMemo } from 'react'
import { ChevronLeft, ChevronRight, Wallet, TrendingUp, AlertTriangle, Info } from 'lucide-react'
import { useTransactionsContext } from '../../presentation/contexts/TransactionsContext'
import { useBudget } from '../../presentation/hooks/useBudget'
import { useAIInsights } from '../../presentation/hooks/useAIInsights'
import { BudgetBucketCard } from '../../presentation/components/BudgetBucketCard'
import { AIInsightsPanel } from '../../presentation/components/AIInsightsPanel'
import { formatCurrency, MONTHS } from '../../shared/utils/formatter'
import { LocalStorageTransactionRepository } from '../../infrastructure/repositories/SessionStorageTransactionRepository'
import { GetTransactionsUseCase } from '../../application/transaction/use-cases/GetTransactionsUseCase'
import { cn } from '../../shared/utils/cn'

export default function BudgetPage() {
  const now = new Date()
  const [month, setMonth] = useState(now.getMonth())
  const [year, setYear] = useState(now.getFullYear())
  const { transactions: contextTransactions } = useTransactionsContext()

  const allTransactions = useMemo(() => {
    const repo = new LocalStorageTransactionRepository()
    const uc = new GetTransactionsUseCase(repo)
    return uc.execute()
  // contextTransactions is the reactive trigger
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contextTransactions])

  const budget = useBudget(allTransactions, month, year)
  const { insights, isLoading: aiLoading, error: aiError, fetchInsights } = useAIInsights()

  function prevMonth() {
    if (month === 0) { setMonth(11); setYear((y) => y - 1) }
    else setMonth((m) => m - 1)
  }

  function nextMonth() {
    if (month === 11) { setMonth(0); setYear((y) => y + 1) }
    else setMonth((m) => m + 1)
  }

  function handleGenerateInsights() {
    const monthTx = allTransactions.filter((t) => {
      const d = new Date(t.createdAt)
      return d.getMonth() === month && d.getFullYear() === year
    })
    fetchInsights(monthTx, month, year)
  }

  const totalOutsideBuckets = budget.uncategorizedAmount

  const overallHealth = useMemo(() => {
    if (budget.income === 0) return null
    const dangerCount = budget.buckets.filter((b) => b.status === 'danger').length
    const warningCount = budget.buckets.filter((b) => b.status === 'warning').length
    if (dangerCount > 0) return { label: 'Atenção', color: 'text-dt-red', bg: 'bg-dt-red/10 border-dt-red/20' }
    if (warningCount > 0) return { label: 'Cuidado', color: 'text-yellow-400', bg: 'bg-yellow-400/10 border-yellow-400/20' }
    return { label: 'No controle', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' }
  }, [budget])

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Controle Orçamentário</h1>
          <p className="mt-1 text-sm text-dt-muted">
            Regra 50/30/20 — Necessidades Fixas · Pessoal &amp; Casal · Investimentos
          </p>
        </div>

        {/* Month Navigator */}
        <div className="flex items-center gap-2 rounded-xl border border-dt-border bg-dt-card px-3 py-2 self-start sm:self-auto">
          <button
            onClick={prevMonth}
            className="cursor-pointer p-1 rounded text-dt-muted hover:text-white transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="text-sm font-semibold text-white min-w-[130px] text-center">
            {MONTHS[month]} {year}
          </span>
          <button
            onClick={nextMonth}
            className="cursor-pointer p-1 rounded text-dt-muted hover:text-white transition-colors"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Top Summary Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {/* Renda */}
        <div className="col-span-2 lg:col-span-1 rounded-xl border border-dt-green/20 bg-dt-card p-4">
          <div className="flex items-center gap-2 mb-2">
            <Wallet className="h-4 w-4 text-dt-green" />
            <span className="text-xs text-dt-muted">Renda do Mês</span>
          </div>
          <p className="text-xl font-bold text-dt-green">{formatCurrency(budget.income)}</p>
          {overallHealth && (
            <span className={cn('mt-2 inline-block text-xs font-semibold', overallHealth.color)}>
              {overallHealth.label}
            </span>
          )}
        </div>

        {/* Buckets targets */}
        {budget.buckets.map((b) => (
          <div key={b.key} className="rounded-xl border border-dt-border bg-dt-card p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-base">{b.icon}</span>
              <span className="text-xs text-dt-muted truncate">{b.percentage}% — {b.label}</span>
            </div>
            <p className="text-lg font-bold text-white">{formatCurrency(b.target)}</p>
            <p className={cn(
              'text-xs font-medium mt-1',
              b.status === 'safe' ? 'text-emerald-400' : b.status === 'warning' ? 'text-yellow-400' : 'text-dt-red',
            )}>
              {b.target > 0 ? `${formatCurrency(b.spent)} gastos` : 'Sem renda registrada'}
            </p>
          </div>
        ))}
      </div>

      {/* No income warning */}
      {budget.income === 0 && (
        <div className="rounded-xl border border-yellow-400/20 bg-yellow-400/5 p-4 flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-yellow-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-yellow-400">Nenhuma entrada registrada em {MONTHS[month]}</p>
            <p className="text-xs text-dt-muted mt-0.5">
              Adicione suas entradas do mês para que os limites de cada bucket sejam calculados automaticamente.
            </p>
          </div>
        </div>
      )}

      {/* Budget Rule Info */}
      <div className="rounded-xl border border-dt-border bg-dt-card p-4 flex items-start gap-3">
        <Info className="h-4 w-4 text-dt-purple shrink-0 mt-0.5" />
        <p className="text-xs text-dt-muted leading-relaxed">
          <span className="text-white font-medium">Como funciona:</span> Cada transação de saída é automaticamente
          associada a um bucket pelo tipo de categoria.{' '}
          <span className="text-blue-400">Necessidades Fixas</span> inclui moradia, saúde, transporte, educação e serviços.{' '}
          <span className="text-dt-purple-light">Pessoal &amp; Casal</span> inclui alimentação, lazer, compras e pets.{' '}
          <span className="text-emerald-400">Investimentos</span> são aportes categorizados como &quot;Investimentos&quot; na saída.
        </p>
      </div>

      {/* Three Bucket Cards */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {budget.buckets.map((bucket) => (
          <BudgetBucketCard key={bucket.key} bucket={bucket} />
        ))}
      </div>

      {/* Uncategorized warning */}
      {totalOutsideBuckets > 0 && (
        <div className="rounded-xl border border-dt-border bg-dt-card p-4 flex items-start gap-3">
          <AlertTriangle className="h-4 w-4 text-yellow-400 shrink-0 mt-0.5" />
          <p className="text-xs text-dt-muted">
            <span className="text-yellow-400 font-medium">{formatCurrency(totalOutsideBuckets)}</span> em
            transações sem bucket definido. Verifique se todas as categorias estão corretas.
          </p>
        </div>
      )}

      {/* Investment tip */}
      <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5">
        <div className="flex items-start gap-3">
          <TrendingUp className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-emerald-400">Meta de Investimento do Mês</p>
            <p className="text-xs text-dt-muted mt-1">
              Sua meta é investir{' '}
              <span className="text-white font-semibold">{formatCurrency(budget.income * 0.2)}</span> (20% de{' '}
              {formatCurrency(budget.income)}). Você aportou{' '}
              <span className={cn(
                'font-semibold',
                budget.buckets[2].spent >= budget.income * 0.2 ? 'text-emerald-400' : 'text-yellow-400',
              )}>
                {formatCurrency(budget.buckets[2].spent)}
              </span>{' '}
              até agora.{' '}
              {budget.buckets[2].spent >= budget.income * 0.2
                ? '🎉 Meta atingida!'
                : `Faltam ${formatCurrency(budget.income * 0.2 - budget.buckets[2].spent)} para bater a meta.`}
            </p>
          </div>
        </div>
      </div>

      {/* AI Insights */}
      <AIInsightsPanel
        insights={insights}
        isLoading={aiLoading}
        error={aiError}
        onGenerate={handleGenerateInsights}
      />
    </div>
  )
}
