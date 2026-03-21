export interface CreateTransactionDTO {
  description: string
  amount: number
  type: 'income' | 'outcome'
  category: string
  date: string // YYYY-MM-DD
}

export interface TransactionFilterDTO {
  query?: string
  month?: number
  year?: number
}
