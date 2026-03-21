'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useTransactionsContext } from '../../contexts/TransactionsContext'
import { MONTHS_SHORT, getYearRange } from '../../../shared/utils/formatter'
import { cn } from '../../../shared/utils/cn'

export function MonthYearFilter() {
  const { filter, setFilter } = useTransactionsContext()
  const years = getYearRange()

  const currentMonth = filter.month ?? new Date().getMonth()
  const currentYear = filter.year ?? new Date().getFullYear()

  const isFirstMonth = currentMonth === 0 && currentYear === 2026
  const now = new Date()
  const isCurrentMonth = currentMonth === now.getMonth() && currentYear === now.getFullYear()

  function prevMonth() {
    if (isFirstMonth) return
    const month = currentMonth === 0 ? 11 : currentMonth - 1
    const year = currentMonth === 0 ? currentYear - 1 : currentYear
    setFilter({ month, year })
  }

  function nextMonth() {
    if (isCurrentMonth) return
    const month = currentMonth === 11 ? 0 : currentMonth + 1
    const year = currentMonth === 11 ? currentYear + 1 : currentYear
    setFilter({ month, year })
  }

  return (
    <div className="rounded-xl border border-dt-border bg-dt-card p-4">
      {/* Year Selector */}
      <div className="mb-3 flex items-center gap-2">
        <span className="text-xs font-medium text-dt-muted uppercase tracking-wider">Ano</span>
        <div className="flex gap-1">
          {years.map((year) => (
            <button
              key={year}
              onClick={() => setFilter({ year })}
              className={cn(
                'cursor-pointer rounded-lg px-3 py-1 text-sm font-medium transition-colors',
                currentYear === year
                  ? 'bg-dt-purple text-white'
                  : 'text-dt-muted hover:text-white hover:bg-white/5',
              )}
            >
              {year}
            </button>
          ))}
        </div>
      </div>

      {/* Month Selector */}
      <div className="flex items-center gap-2">
        <button
          onClick={prevMonth}
          disabled={isFirstMonth}
          className="p-1.5 rounded-lg text-dt-muted hover:text-white hover:bg-white/5 transition-colors flex-shrink-0 disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label="Mês anterior"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        <div className="flex flex-1 gap-1 overflow-x-auto pb-1 scrollbar-hide">
          {MONTHS_SHORT.map((month, index) => (
            <button
              key={month}
              onClick={() => setFilter({ month: index })}
              className={cn(
                'cursor-pointer flex-shrink-0 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all',
                currentMonth === index
                  ? 'bg-dt-purple text-white shadow-md shadow-dt-purple/30 scale-105'
                  : 'text-dt-muted hover:text-white hover:bg-white/5',
              )}
            >
              {month}
            </button>
          ))}
        </div>

        <button
          onClick={nextMonth}
          disabled={isCurrentMonth}
          className="p-1.5 rounded-lg text-dt-muted hover:text-white hover:bg-white/5 transition-colors flex-shrink-0 disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label="Próximo mês"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
