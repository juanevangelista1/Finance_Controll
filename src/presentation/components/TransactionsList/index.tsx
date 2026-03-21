'use client'

import { useState } from 'react'
import { Trash2, TrendingUp, TrendingDown, Search } from 'lucide-react'
import * as Dialog from '@radix-ui/react-dialog'
import { useTransactionsContext } from '../../contexts/TransactionsContext'
import { formatCurrency, formatDate } from '../../../shared/utils/formatter'
import { cn } from '../../../shared/utils/cn'

function DeleteConfirmModal({
  open,
  onConfirm,
  onCancel,
  description,
}: {
  open: boolean
  onConfirm: () => void
  onCancel: () => void
  description: string
}) {
  return (
    <Dialog.Root open={open} onOpenChange={(v) => !v && onCancel()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm animate-fade-in" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-full max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-dt-border bg-dt-surface p-6 shadow-2xl mx-4 animate-slide-up">
          <Dialog.Title className="text-lg font-bold text-white mb-2">
            Confirmar exclusão
          </Dialog.Title>
          <p className="text-sm text-dt-muted mb-1">
            Deseja remover a transação:
          </p>
          <p className="text-sm font-semibold text-white mb-6">
            &ldquo;{description}&rdquo;
          </p>
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 cursor-pointer rounded-xl border border-dt-border py-2.5 text-sm font-semibold text-dt-muted hover:text-white hover:bg-white/5 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 cursor-pointer rounded-xl bg-dt-red py-2.5 text-sm font-bold text-white shadow-lg shadow-dt-red/25 hover:bg-dt-red-dark transition-colors active:scale-95"
            >
              Remover
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

export function TransactionsList() {
  const { transactions, isLoading, deleteTransaction } = useTransactionsContext()
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; description: string } | null>(null)

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-16 animate-pulse rounded-xl bg-dt-card" />
        ))}
      </div>
    )
  }

  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-dt-border bg-dt-card py-16 text-center">
        <Search className="mb-3 h-10 w-10 text-dt-border" />
        <p className="text-sm font-medium text-dt-muted">Nenhuma transação encontrada</p>
        <p className="mt-1 text-xs text-dt-muted/60">Tente outro mês ou adicione uma nova transação</p>
      </div>
    )
  }

  return (
    <>
      {/* Mobile: Card list */}
      <div className="space-y-3 lg:hidden">
        {transactions.map((transaction) => (
          <div
            key={transaction.id}
            className="rounded-xl border border-dt-border bg-dt-card p-4 transition-all hover:border-dt-border/80 animate-fade-in"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <p className="font-medium text-white truncate">{transaction.description}</p>
                <p className="mt-0.5 text-xs text-dt-muted">{transaction.category}</p>
              </div>
              <button
                onClick={() => setDeleteTarget({ id: transaction.id, description: transaction.description })}
                className="cursor-pointer p-1.5 rounded-lg text-dt-muted hover:text-dt-red hover:bg-dt-red/10 transition-colors flex-shrink-0"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                {transaction.type === 'income' ? (
                  <TrendingUp className="h-3.5 w-3.5 text-dt-green" />
                ) : (
                  <TrendingDown className="h-3.5 w-3.5 text-dt-red" />
                )}
                <span
                  className={cn(
                    'text-lg font-bold',
                    transaction.type === 'income' ? 'text-dt-green' : 'text-dt-red',
                  )}
                >
                  {transaction.type === 'outcome' && '-'}
                  {formatCurrency(transaction.amount)}
                </span>
              </div>
              <span className="text-xs text-dt-muted">{formatDate(transaction.createdAt)}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop: Table */}
      <div className="hidden lg:block rounded-xl border border-dt-border bg-dt-card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-dt-border">
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-dt-muted">
                Descrição
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-dt-muted">
                Valor
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-dt-muted">
                Categoria
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-dt-muted">
                Data
              </th>
              <th className="px-6 py-4 w-16" />
            </tr>
          </thead>
          <tbody className="divide-y divide-dt-border">
            {transactions.map((transaction) => (
              <tr
                key={transaction.id}
                className="transition-colors hover:bg-white/2 group"
              >
                <td className="px-6 py-4 font-medium text-white">{transaction.description}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1.5">
                    {transaction.type === 'income' ? (
                      <TrendingUp className="h-3.5 w-3.5 text-dt-green" />
                    ) : (
                      <TrendingDown className="h-3.5 w-3.5 text-dt-red" />
                    )}
                    <span
                      className={cn(
                        'font-semibold',
                        transaction.type === 'income' ? 'text-dt-green' : 'text-dt-red',
                      )}
                    >
                      {transaction.type === 'outcome' && '-'}
                      {formatCurrency(transaction.amount)}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center rounded-full border border-dt-border bg-dt-surface px-2.5 py-0.5 text-xs text-dt-muted">
                    {transaction.category}
                  </span>
                </td>
                <td className="px-6 py-4 text-dt-muted">{formatDate(transaction.createdAt)}</td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => setDeleteTarget({ id: transaction.id, description: transaction.description })}
                    className="cursor-pointer rounded-lg p-2 text-dt-muted opacity-0 group-hover:opacity-100 hover:text-dt-red hover:bg-dt-red/10 transition-all"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <DeleteConfirmModal
        open={!!deleteTarget}
        description={deleteTarget?.description ?? ''}
        onConfirm={() => {
          if (deleteTarget) {
            deleteTransaction(deleteTarget.id)
            setDeleteTarget(null)
          }
        }}
        onCancel={() => setDeleteTarget(null)}
      />
    </>
  )
}
