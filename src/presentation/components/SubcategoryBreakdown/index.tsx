'use client'

import { useState, useMemo } from 'react'
import { ChevronDown, ChevronRight } from 'lucide-react'
import type { Transaction } from '../../../domain/transaction/entities/Transaction'
import {
  getCategoryLabel,
  getSubcategoryLabel,
  getCategoryIcon,
  OUTCOME_CATEGORY_REGISTRY,
} from '../../../domain/transaction/value-objects/CategoryRegistry'
import { formatCurrency } from '../../../shared/utils/formatter'
import { cn } from '../../../shared/utils/cn'

const CATEGORY_COLORS = [
  '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#3b82f6',
  '#ec4899', '#14b8a6', '#f97316', '#6366f1', '#84cc16',
]

interface SubcategoryBreakdownProps {
  transactions: Transaction[]
}

interface CategoryGroup {
  category: string
  label: string
  icon: string
  total: number
  color: string
  subcategories: Array<{
    subcategory: string
    label: string
    total: number
    count: number
  }>
}

export function SubcategoryBreakdown({ transactions }: SubcategoryBreakdownProps) {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null)

  const categoryGroups: CategoryGroup[] = useMemo(() => {
    const outcomeTransactions = transactions.filter((t) => t.type === 'outcome')
    const categoryMap = new Map<string, { total: number; subcategories: Map<string, { total: number; count: number }> }>()

    outcomeTransactions.forEach((t) => {
      if (!categoryMap.has(t.category)) {
        categoryMap.set(t.category, { total: 0, subcategories: new Map() })
      }
      const catData = categoryMap.get(t.category)!
      catData.total += t.amount

      const subKey = t.subcategory || '_sem_sub'
      if (!catData.subcategories.has(subKey)) {
        catData.subcategories.set(subKey, { total: 0, count: 0 })
      }
      const subData = catData.subcategories.get(subKey)!
      subData.total += t.amount
      subData.count += 1
    })

    // Sort by OUTCOME_CATEGORY_REGISTRY order
    const registryOrder = OUTCOME_CATEGORY_REGISTRY.map((c) => c.value)

    return Array.from(categoryMap.entries())
      .sort((a, b) => {
        const aIdx = registryOrder.indexOf(a[0])
        const bIdx = registryOrder.indexOf(b[0])
        if (aIdx === -1 && bIdx === -1) return b[1].total - a[1].total
        if (aIdx === -1) return 1
        if (bIdx === -1) return -1
        return aIdx - bIdx
      })
      .map(([category, data], i) => ({
        category,
        label: getCategoryLabel('outcome', category),
        icon: getCategoryIcon('outcome', category),
        total: data.total,
        color: CATEGORY_COLORS[i % CATEGORY_COLORS.length],
        subcategories: Array.from(data.subcategories.entries())
          .sort((a, b) => b[1].total - a[1].total)
          .map(([sub, subData]) => ({
            subcategory: sub,
            label: sub === '_sem_sub'
              ? 'Sem detalhamento'
              : getSubcategoryLabel('outcome', category, sub),
            total: subData.total,
            count: subData.count,
          })),
      }))
  }, [transactions])

  const totalOutcome = useMemo(
    () => categoryGroups.reduce((sum, g) => sum + g.total, 0),
    [categoryGroups],
  )

  if (categoryGroups.length === 0) {
    return (
      <p className="text-sm text-dt-muted py-4">Sem despesas no período</p>
    )
  }

  return (
    <div className="space-y-2">
      {categoryGroups.map((group) => {
        const isExpanded = expandedCategory === group.category
        const percentage = totalOutcome > 0 ? ((group.total / totalOutcome) * 100) : 0

        return (
          <div key={group.category} className="animate-fade-in">
            {/* Category header — clicável para expandir */}
            <button
              type="button"
              onClick={() => setExpandedCategory(isExpanded ? null : group.category)}
              className={cn(
                'cursor-pointer w-full flex items-center gap-3 rounded-lg p-3 transition-all',
                isExpanded
                  ? 'bg-dt-surface border border-dt-border'
                  : 'hover:bg-dt-surface/50',
              )}
            >
              <span className="text-lg flex-shrink-0">{group.icon}</span>
              <div className="flex-1 min-w-0 text-left">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-white">{group.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-white">
                      {formatCurrency(group.total)}
                    </span>
                    <span className="text-xs text-dt-muted">
                      {percentage.toFixed(1)}%
                    </span>
                  </div>
                </div>
                <div className="h-1.5 w-full rounded-full bg-dt-border overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%`, backgroundColor: group.color }}
                  />
                </div>
              </div>
              {group.subcategories.length > 1 || (group.subcategories.length === 1 && group.subcategories[0].subcategory !== '_sem_sub') ? (
                isExpanded ? (
                  <ChevronDown className="h-4 w-4 text-dt-muted flex-shrink-0" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-dt-muted flex-shrink-0" />
                )
              ) : null}
            </button>

            {/* Subcategories — expandido */}
            {isExpanded && group.subcategories.length > 0 && (
              <div className="ml-10 mt-1 space-y-1 animate-fade-in">
                {group.subcategories.map((sub) => {
                  const subPercentage = group.total > 0 ? ((sub.total / group.total) * 100) : 0
                  return (
                    <div
                      key={sub.subcategory}
                      className="flex items-center justify-between rounded-lg px-3 py-2 hover:bg-dt-card/50 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="h-2 w-2 rounded-full flex-shrink-0"
                          style={{ backgroundColor: group.color, opacity: 0.6 }}
                        />
                        <span className="text-xs text-dt-muted">{sub.label}</span>
                        <span className="text-[10px] text-dt-muted/60">({sub.count}x)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-white">
                          {formatCurrency(sub.total)}
                        </span>
                        <span className="text-[10px] text-dt-muted w-10 text-right">
                          {subPercentage.toFixed(0)}%
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
