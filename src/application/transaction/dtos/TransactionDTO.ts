export interface CreateTransactionDTO {
  description: string
  amount: number
  type: 'income' | 'outcome'
  category: string
}

export interface TransactionFilterDTO {
  query?: string
  month?: number
  year?: number
}
