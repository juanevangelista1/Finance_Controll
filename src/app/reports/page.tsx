'use client'

import { useState, useMemo } from 'react'
import { Download, TrendingUp, TrendingDown, Wallet, PieChart } from 'lucide-react'
import { useTransactionsContext } from '../../presentation/contexts/TransactionsContext'
import { useReports } from '../../presentation/hooks/useReports'
import { useSummary } from '../../presentation/hooks/useSummary'
import { MonthlyBarChart } from '../../presentation/components/Charts/MonthlyBarChart'
import { CategoryPieChart } from '../../presentation/components/Charts/CategoryPieChart'
import { BalanceLineChart } from '../../presentation/components/Charts/BalanceLineChart'
import { formatCurrency, getYearRange } from '../../shared/utils/formatter'
import { LocalStorageTransactionRepository } from '../../infrastructure/repositories/SessionStorageTransactionRepository'
import { GetTransactionsUseCase } from '../../application/transaction/use-cases/GetTransactionsUseCase'
import { exportToPDF } from '../../shared/utils/pdfExport'
import { cn } from '../../shared/utils/cn'

export default function ReportsPage() {
  const { filter, transactions: contextTransactions } = useTransactionsContext()
  const years = getYearRange()
  const [selectedYear, setSelectedYear] = useState(filter.year ?? new Date().getFullYear())
  const [exporting, setExporting] = useState(false)

  // Re-reads from LocalStorage whenever selectedYear or contextTransactions change
  const allYearTransactions = useMemo(() => {
    const repository = new LocalStorageTransactionRepository()
    const getAll = new GetTransactionsUseCase(repository)
    return getAll.executeAllMonths(selectedYear)
  // contextTransactions is used as a reactive trigger for when transactions are added/deleted
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedYear, contextTransactions])

  const summary = useSummary(allYearTransactions)
  const { monthlyData, categoryData, balanceEvolution } = useReports(allYearTransactions, selectedYear)

  async function handleExportPDF() {
    setExporting(true)
    await exportToPDF('reports-content', `dt-money-relatorio-${selectedYear}.pdf`)
    setExporting(false)
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Relatórios</h1>
          <p className="mt-1 text-sm text-dt-muted">Análise detalhada das suas finanças</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Year Selector */}
          <div className="flex gap-1 rounded-xl border border-dt-border bg-dt-card p-1">
            {years.map((year) => (
              <button
                key={year}
                onClick={() => setSelectedYear(year)}
                className={cn(
                  'rounded-lg px-3 py-1.5 text-sm font-medium transition-colors',
                  selectedYear === year
                    ? 'bg-dt-purple text-white'
                    : 'text-dt-muted hover:text-white',
                )}
              >
                {year}
              </button>
            ))}
          </div>
          <button
            onClick={handleExportPDF}
            disabled={exporting}
            className="flex items-center gap-2 rounded-xl bg-dt-green px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-dt-green/25 transition-all hover:bg-dt-green-dark active:scale-95 disabled:opacity-60"
          >
            <Download className="h-4 w-4" />
            {exporting ? 'Exportando...' : 'Exportar PDF'}
          </button>
        </div>
      </div>

      <div id="reports-content" className="space-y-6">
        {/* Annual Summary */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-dt-green/20 bg-dt-card p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="rounded-lg bg-dt-green/10 p-2">
                <TrendingUp className="h-4 w-4 text-dt-green" />
              </div>
              <span className="text-sm text-dt-muted">Total de Entradas</span>
            </div>
            <p className="text-2xl font-bold text-dt-green">{formatCurrency(summary.income)}</p>
            <p className="mt-1 text-xs text-dt-muted">{summary.incomeCount} transações em {selectedYear}</p>
          </div>
          <div className="rounded-xl border border-dt-red/20 bg-dt-card p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="rounded-lg bg-dt-red/10 p-2">
                <TrendingDown className="h-4 w-4 text-dt-red" />
              </div>
              <span className="text-sm text-dt-muted">Total de Saídas</span>
            </div>
            <p className="text-2xl font-bold text-dt-red">{formatCurrency(summary.outcome)}</p>
            <p className="mt-1 text-xs text-dt-muted">{summary.outcomeCount} transações em {selectedYear}</p>
          </div>
          <div className={cn(
            'rounded-xl border p-5',
            summary.total >= 0 ? 'border-dt-green/30 bg-dt-green/10' : 'border-dt-red/30 bg-dt-red/10',
          )}>
            <div className="flex items-center gap-2 mb-3">
              <div className={cn('rounded-lg p-2', summary.total >= 0 ? 'bg-dt-green/20' : 'bg-dt-red/20')}>
                <Wallet className={cn('h-4 w-4', summary.total >= 0 ? 'text-dt-green' : 'text-dt-red')} />
              </div>
              <span className="text-sm text-dt-muted">Saldo do Ano</span>
            </div>
            <p className={cn('text-2xl font-bold', summary.total >= 0 ? 'text-dt-green' : 'text-dt-red')}>
              {formatCurrency(summary.total)}
            </p>
            <p className="mt-1 text-xs text-dt-muted">{summary.count} transações no total</p>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Monthly Bar Chart */}
          <div className="rounded-xl border border-dt-border bg-dt-card p-5">
            <h3 className="mb-4 text-sm font-semibold text-white">Entradas vs Saídas por Mês</h3>
            <MonthlyBarChart data={monthlyData} />
          </div>

          {/* Balance Line Chart */}
          <div className="rounded-xl border border-dt-border bg-dt-card p-5">
            <h3 className="mb-4 text-sm font-semibold text-white">Evolução do Saldo</h3>
            <BalanceLineChart data={balanceEvolution} />
          </div>
        </div>

        {/* Category Pie Chart */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-xl border border-dt-border bg-dt-card p-5">
            <div className="flex items-center gap-2 mb-4">
              <PieChart className="h-4 w-4 text-dt-purple" />
              <h3 className="text-sm font-semibold text-white">Despesas por Categoria</h3>
            </div>
            <CategoryPieChart data={categoryData} />
          </div>

          {/* Category Breakdown */}
          <div className="rounded-xl border border-dt-border bg-dt-card p-5">
            <h3 className="mb-4 text-sm font-semibold text-white">Detalhamento por Categoria</h3>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {categoryData.length === 0 ? (
                <p className="text-sm text-dt-muted">Sem despesas no período</p>
              ) : (
                categoryData.map((cat) => {
                  const totalOutcome = summary.outcome || 1
                  const percentage = ((cat.value / totalOutcome) * 100).toFixed(1)
                  return (
                    <div key={cat.name}>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <div
                            className="h-2.5 w-2.5 rounded-full flex-shrink-0"
                            style={{ backgroundColor: cat.fill }}
                          />
                          <span className="text-sm text-white">{cat.name}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-semibold text-white">{formatCurrency(cat.value)}</span>
                          <span className="ml-2 text-xs text-dt-muted">{percentage}%</span>
                        </div>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-dt-border overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${percentage}%`,
                            backgroundColor: cat.fill,
                          }}
                        />
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
