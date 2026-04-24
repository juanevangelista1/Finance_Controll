export interface CategorizeRequestDTO {
  description: string
  amount: number
  type: 'income' | 'outcome'
}

export interface CategorizeResponseDTO {
  category: string
  subcategory: string
  confidence: number // 0.0 - 1.0
}

export interface InsightsRequestDTO {
  transactions: Array<{
    description: string
    amount: number
    type: 'income' | 'outcome'
    category: string
    subcategory?: string
    createdAt: string
  }>
  period: string // ex: "Abril 2026"
}

export interface InsightDTO {
  type: 'tip' | 'warning' | 'achievement' | 'pattern'
  icon: string
  title: string
  message: string
}
