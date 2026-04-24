export interface Transaction {
  id: string
  description: string
  type: 'income' | 'outcome'
  amount: number
  category: string
  subcategory?: string
  tags?: string[]
  notes?: string
  createdAt: string
}
