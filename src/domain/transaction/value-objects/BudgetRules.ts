export type BucketKey = 'necessidades' | 'pessoal' | 'investimentos'

export interface BudgetBucketDef {
  key: BucketKey
  label: string
  description: string
  icon: string
  percentage: number
  color: string
  categories: string[]
}

export const BUDGET_BUCKETS: BudgetBucketDef[] = [
  {
    key: 'necessidades',
    label: 'Necessidades Fixas',
    description: 'Moradia, saúde, transporte, educação e serviços essenciais',
    icon: '🏠',
    percentage: 50,
    color: '#3b82f6',
    categories: ['moradia', 'saude', 'educacao', 'transporte', 'servicos'],
  },
  {
    key: 'pessoal',
    label: 'Pessoal & Casal',
    description: 'Alimentação, lazer, compras, pets e gastos variáveis',
    icon: '💑',
    percentage: 30,
    color: '#8b5cf6',
    categories: ['alimentacao', 'lazer', 'compras', 'pets', 'outros_saida'],
  },
  {
    key: 'investimentos',
    label: 'Investimentos',
    description: 'Aportes em renda fixa, ações, previdência e reservas',
    icon: '📈',
    percentage: 20,
    color: '#10b981',
    categories: ['aporte_investimento'],
  },
]

export function getCategoryBucket(category: string): BucketKey | null {
  for (const bucket of BUDGET_BUCKETS) {
    if (bucket.categories.includes(category)) return bucket.key
  }
  return null
}
