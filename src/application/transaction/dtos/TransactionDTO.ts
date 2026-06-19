import type { InstallmentInfo } from '../../../domain/transaction/entities/Transaction'

export interface CreateTransactionDTO {
  description: string
  amount: number
  type: 'income' | 'outcome'
  category: string
  subcategory?: string
  tags?: string[]
  notes?: string
  date: string // YYYY-MM-DD
  installmentTotal?: number // se > 1, gera N transações parceladas
  installment?: InstallmentInfo // uso interno do use-case, não preencher manualmente
}

export interface TransactionFilterDTO {
  query?: string
  month?: number
  year?: number
  category?: string
  subcategory?: string
  tag?: string
}

