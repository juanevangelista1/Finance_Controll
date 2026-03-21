export interface Transaction {
  id: string
  description: string
  type: 'income' | 'outcome'
  amount: number
  category: string
  createdAt: string
}
