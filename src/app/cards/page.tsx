'use client'

import { useState } from 'react'
import { Plus, Trash2, CreditCard as CreditCardIcon } from 'lucide-react'
import { useCreditCardsContext } from '../../presentation/contexts/CreditCardsContext'
import { CreditCardForm } from '../../presentation/components/CreditCardForm'
import { formatCurrency } from '../../shared/utils/formatter'
import { cn } from '../../shared/utils/cn'

export default function CardsPage() {
  const { cards, isLoading, deleteCard } = useCreditCardsContext()
  const [formOpen, setFormOpen] = useState(false)

  const totalLimit = cards.reduce((s, c) => s + c.limit, 0)
  const totalUsed = cards.reduce((s, c) => s + c.used, 0)
  const totalFree = totalLimit - totalUsed

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Cartões de Crédito</h1>
          <p className="mt-1 text-sm text-dt-muted">Acompanhe limite, fatura e disponível de cada cartão</p>
        </div>
        <button
          onClick={() => setFormOpen(true)}
          className="flex cursor-pointer items-center gap-2 rounded-lg bg-dt-purple px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-dt-purple/25 transition-all hover:bg-dt-purple-dark active:scale-95 self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          Novo cartão
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-dt-border bg-dt-card p-4">
          <p className="text-xs text-dt-muted">Limite Total</p>
          <p className="mt-1 text-xl font-bold text-white">{formatCurrency(totalLimit)}</p>
        </div>
        <div className="rounded-xl border border-dt-border bg-dt-card p-4">
          <p className="text-xs text-dt-muted">Fatura Total</p>
          <p className="mt-1 text-xl font-bold text-dt-red">{formatCurrency(totalUsed)}</p>
        </div>
        <div className="rounded-xl border border-emerald-500/20 bg-dt-card p-4">
          <p className="text-xs text-dt-muted">Disponível</p>
          <p className="mt-1 text-xl font-bold text-emerald-400">{formatCurrency(totalFree)}</p>
        </div>
      </div>

      {/* Cards list */}
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-20 animate-pulse rounded-xl bg-dt-card" />
          ))}
        </div>
      ) : cards.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-dt-border bg-dt-card py-16 text-center">
          <CreditCardIcon className="mb-3 h-10 w-10 text-dt-border" />
          <p className="text-sm font-medium text-dt-muted">Nenhum cartão cadastrado</p>
          <p className="mt-1 text-xs text-dt-muted/60">Adicione seus cartões para acompanhar limite e fatura</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => {
            const free = card.limit - card.used
            const usagePct = card.limit > 0 ? Math.min(card.used / card.limit, 1) : 0
            const danger = usagePct >= 0.9
            return (
              <div key={card.id} className="rounded-xl border border-dt-border bg-dt-card p-5 flex flex-col gap-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-white">{card.name}</h3>
                    {card.status && (
                      <span className="text-xs text-yellow-400">{card.status}</span>
                    )}
                  </div>
                  <button
                    onClick={() => deleteCard(card.id)}
                    className="cursor-pointer p-1.5 rounded-lg text-dt-muted hover:text-dt-red hover:bg-dt-red/10 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="h-2 w-full rounded-full bg-dt-border overflow-hidden">
                  <div
                    className={cn('h-full rounded-full transition-all', danger ? 'bg-dt-red' : 'bg-dt-purple')}
                    style={{ width: `${usagePct * 100}%` }}
                  />
                </div>

                <div className="flex justify-between text-xs text-dt-muted">
                  <span>Fatura: {formatCurrency(card.used)}</span>
                  <span>Limite: {formatCurrency(card.limit)}</span>
                </div>

                <p className={cn('text-sm font-semibold', danger ? 'text-dt-red' : 'text-emerald-400')}>
                  {formatCurrency(free)} disponível
                </p>
              </div>
            )
          })}
        </div>
      )}

      <CreditCardForm open={formOpen} onOpenChange={setFormOpen} />
    </div>
  )
}
