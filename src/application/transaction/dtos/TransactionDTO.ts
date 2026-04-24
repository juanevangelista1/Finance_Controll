export interface CreateTransactionDTO {
  description: string
  amount: number
  type: 'income' | 'outcome'
  category: string
  subcategory?: string
  tags?: string[]
  notes?: string
  date: string // YYYY-MM-DD
}

export interface TransactionFilterDTO {
  query?: string
  month?: number
  year?: number
  category?: string
  subcategory?: string
  tag?: string
}

