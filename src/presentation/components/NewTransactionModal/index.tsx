'use client'

import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import * as Dialog from '@radix-ui/react-dialog'
import { ArrowUpCircle, ArrowDownCircle, X } from 'lucide-react'
import { useTransactionsContext } from '../../contexts/TransactionsContext'
import { cn } from '../../../shared/utils/cn'

const schema = z.object({
  description: z.string().min(1, 'Descrição obrigatória'),
  amount: z.coerce.number().positive('Valor deve ser positivo'),
  category: z.string().min(1, 'Categoria obrigatória'),
  type: z.enum(['income', 'outcome']),
})

type FormData = z.infer<typeof schema>

const CATEGORIES = [
  'Alimentação', 'Moradia', 'Transporte', 'Saúde', 'Educação',
  'Lazer', 'Assinaturas', 'Trabalho', 'Freelance', 'Investimentos', 'Outros',
]

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function NewTransactionModal({ open, onOpenChange }: Props) {
  const { createTransaction } = useTransactionsContext()
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { type: 'income' },
  })

  function onSubmit(data: FormData) {
    createTransaction(data)
    reset()
    onOpenChange(false)
  }

  function handleClose() {
    reset()
    onOpenChange(false)
  }

  return (
    <Dialog.Root open={open} onOpenChange={handleClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm animate-fade-in" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-dt-border bg-dt-surface p-6 shadow-2xl animate-slide-up mx-4">
          <div className="mb-6 flex items-center justify-between">
            <Dialog.Title className="text-lg font-bold text-white">
              Nova Transação
            </Dialog.Title>
            <button
              onClick={handleClose}
              className="rounded-lg p-2 text-dt-muted hover:text-white hover:bg-white/5 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Description */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-dt-muted">
                Descrição
              </label>
              <input
                {...register('description')}
                placeholder="Ex: Aluguel, Salário..."
                className="h-11 w-full rounded-xl border border-dt-border bg-dt-card px-4 text-sm text-white placeholder:text-dt-muted/60 focus:border-dt-purple/60 focus:outline-none focus:ring-2 focus:ring-dt-purple/20 transition-all"
              />
              {errors.description && (
                <p className="mt-1 text-xs text-dt-red">{errors.description.message}</p>
              )}
            </div>

            {/* Amount */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-dt-muted">
                Valor (R$)
              </label>
              <input
                {...register('amount')}
                type="number"
                step="0.01"
                min="0"
                placeholder="0,00"
                className="h-11 w-full rounded-xl border border-dt-border bg-dt-card px-4 text-sm text-white placeholder:text-dt-muted/60 focus:border-dt-purple/60 focus:outline-none focus:ring-2 focus:ring-dt-purple/20 transition-all"
              />
              {errors.amount && (
                <p className="mt-1 text-xs text-dt-red">{errors.amount.message}</p>
              )}
            </div>

            {/* Category */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-dt-muted">
                Categoria
              </label>
              <select
                {...register('category')}
                className="h-11 w-full rounded-xl border border-dt-border bg-dt-card px-4 text-sm text-white focus:border-dt-purple/60 focus:outline-none focus:ring-2 focus:ring-dt-purple/20 transition-all appearance-none"
              >
                <option value="" className="bg-dt-surface">Selecione uma categoria</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat} className="bg-dt-surface">{cat}</option>
                ))}
              </select>
              {errors.category && (
                <p className="mt-1 text-xs text-dt-red">{errors.category.message}</p>
              )}
            </div>

            {/* Type */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-dt-muted">
                Tipo
              </label>
              <Controller
                control={control}
                name="type"
                render={({ field }) => (
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => field.onChange('income')}
                      className={cn(
                        'flex items-center justify-center gap-2 rounded-xl border py-3 text-sm font-semibold transition-all',
                        field.value === 'income'
                          ? 'border-dt-green bg-dt-green/15 text-dt-green'
                          : 'border-dt-border bg-dt-card text-dt-muted hover:border-dt-green/30 hover:text-dt-green',
                      )}
                    >
                      <ArrowUpCircle className="h-4 w-4" />
                      Entrada
                    </button>
                    <button
                      type="button"
                      onClick={() => field.onChange('outcome')}
                      className={cn(
                        'flex items-center justify-center gap-2 rounded-xl border py-3 text-sm font-semibold transition-all',
                        field.value === 'outcome'
                          ? 'border-dt-red bg-dt-red/15 text-dt-red'
                          : 'border-dt-border bg-dt-card text-dt-muted hover:border-dt-red/30 hover:text-dt-red',
                      )}
                    >
                      <ArrowDownCircle className="h-4 w-4" />
                      Saída
                    </button>
                  </div>
                )}
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-2 w-full rounded-xl bg-dt-purple py-3 text-sm font-bold text-white shadow-lg shadow-dt-purple/25 transition-all hover:bg-dt-purple-dark active:scale-[0.99] disabled:opacity-50"
            >
              {isSubmitting ? 'Cadastrando...' : 'Cadastrar transação'}
            </button>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
