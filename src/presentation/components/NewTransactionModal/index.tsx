'use client'

import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import * as Dialog from '@radix-ui/react-dialog'
import { ArrowUpCircle, ArrowDownCircle, X, CalendarDays } from 'lucide-react'
import { useTransactionsContext } from '../../contexts/TransactionsContext'
import { cn } from '../../../shared/utils/cn'

const schema = z.object({
  description: z.string().min(1, 'Descrição obrigatória'),
  amount: z.coerce.number().positive('Valor deve ser positivo'),
  category: z.string().min(1, 'Categoria obrigatória'),
  type: z.enum(['income', 'outcome']),
  date: z.string().min(1, 'Data obrigatória'),
})

type FormData = z.infer<typeof schema>

const INCOME_CATEGORIES = [
  'Plantão', 'SAMU', 'AeroMédico', 'Salário',
  'Freelance', 'Investimentos', 'Outros',
]

const OUTCOME_CATEGORIES = [
  'Alimentação', 'Moradia', 'Transporte', 'Saúde', 'Educação',
  'Lazer', 'Assinaturas', 'Outros',
]

function todayISO(): string {
  const now = new Date()
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  const d = String(now.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

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
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { type: 'income', date: todayISO() },
  })

  const currentType = watch('type')
  const categories = currentType === 'income' ? INCOME_CATEGORIES : OUTCOME_CATEGORIES

  function onSubmit(data: FormData) {
    createTransaction(data)
    reset({ type: 'income', date: todayISO() })
    onOpenChange(false)
  }

  function handleClose() {
    reset({ type: 'income', date: todayISO() })
    onOpenChange(false)
  }

  return (
    <Dialog.Root open={open} onOpenChange={handleClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm animate-fade-in" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-dt-border bg-dt-surface p-6 shadow-2xl animate-slide-up mx-4 max-h-[90dvh] overflow-y-auto">
          <div className="mb-6 flex items-center justify-between">
            <Dialog.Title className="text-lg font-bold text-white">
              Nova Transação
            </Dialog.Title>
            <button
              onClick={handleClose}
              className="cursor-pointer rounded-lg p-2 text-dt-muted hover:text-white hover:bg-white/5 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Type — primeiro para as categorias reagirem */}
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
                      onClick={() => {
                        field.onChange('income')
                        setValue('category', '')
                      }}
                      className={cn(
                        'cursor-pointer flex items-center justify-center gap-2 rounded-xl border py-3 text-sm font-semibold transition-all',
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
                      onClick={() => {
                        field.onChange('outcome')
                        setValue('category', '')
                      }}
                      className={cn(
                        'cursor-pointer flex items-center justify-center gap-2 rounded-xl border py-3 text-sm font-semibold transition-all',
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

            {/* Description */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-dt-muted">
                Descrição
              </label>
              <input
                {...register('description')}
                placeholder="Ex: Plantão 12h, Aluguel..."
                className="h-11 w-full rounded-xl border border-dt-border bg-dt-card px-4 text-sm text-white placeholder:text-dt-muted/60 focus:border-dt-purple/60 focus:outline-none focus:ring-2 focus:ring-dt-purple/20 transition-all"
              />
              {errors.description && (
                <p className="mt-1 text-xs text-dt-red">{errors.description.message}</p>
              )}
            </div>

            {/* Amount + Date lado a lado */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-dt-muted">
                  Valor (R$)
                </label>
                <Controller
                  control={control}
                  name="amount"
                  render={({ field }) => {
                    const numVal = typeof field.value === 'number' ? field.value : 0
                    const displayValue = numVal > 0
                      ? numVal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                      : ''
                    return (
                      <input
                        type="text"
                        inputMode="numeric"
                        value={displayValue}
                        onChange={(e) => {
                          const digits = e.target.value.replace(/\D/g, '')
                          field.onChange(digits ? parseInt(digits, 10) / 100 : 0)
                        }}
                        placeholder="0,00"
                        className="h-11 w-full rounded-xl border border-dt-border bg-dt-card px-4 text-sm text-white placeholder:text-dt-muted/60 focus:border-dt-purple/60 focus:outline-none focus:ring-2 focus:ring-dt-purple/20 transition-all"
                      />
                    )
                  }}
                />
                {errors.amount && (
                  <p className="mt-1 text-xs text-dt-red">{errors.amount.message}</p>
                )}
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-dt-muted">
                  Data
                </label>
                <label className="relative block cursor-pointer">
                  <CalendarDays className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-dt-muted" />
                  <input
                    {...register('date')}
                    type="date"
                    className="h-11 w-full cursor-pointer rounded-xl border border-dt-border bg-dt-card pl-10 pr-4 text-sm text-white focus:border-dt-purple/60 focus:outline-none focus:ring-2 focus:ring-dt-purple/20 transition-all [color-scheme:dark]"
                  />
                </label>
                {errors.date && (
                  <p className="mt-1 text-xs text-dt-red">{errors.date.message}</p>
                )}
              </div>
            </div>

            {/* Category — reativa ao tipo */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-dt-muted">
                {currentType === 'income' ? 'Origem' : 'Categoria'}
              </label>
              <select
                {...register('category')}
                className="h-11 w-full cursor-pointer rounded-xl border border-dt-border bg-dt-card px-4 text-sm text-white focus:border-dt-purple/60 focus:outline-none focus:ring-2 focus:ring-dt-purple/20 transition-all appearance-none"
              >
                <option value="" className="bg-dt-surface">
                  {currentType === 'income' ? 'Selecione a origem' : 'Selecione a categoria'}
                </option>
                {categories.map((cat) => (
                  <option key={cat} value={cat} className="bg-dt-surface">{cat}</option>
                ))}
              </select>
              {errors.category && (
                <p className="mt-1 text-xs text-dt-red">{errors.category.message}</p>
              )}
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
