export type ExpenseGroupKey = 'casa' | 'saude' | 'carro' | 'pessoal' | 'outros'

export interface ExpenseGroupDef {
  key: ExpenseGroupKey
  label: string
  icon: string
  categories: string[]
}

export const EXPENSE_GROUPS: ExpenseGroupDef[] = [
  { key: 'casa', label: 'Casa', icon: '🏠', categories: ['moradia', 'servicos'] },
  { key: 'saude', label: 'Saúde', icon: '🏥', categories: ['saude'] },
  { key: 'carro', label: 'Carro', icon: '🚗', categories: ['transporte'] },
  { key: 'pessoal', label: 'Pessoal', icon: '🛍️', categories: ['alimentacao', 'lazer', 'compras', 'pets', 'educacao'] },
  { key: 'outros', label: 'Outros', icon: '📦', categories: ['outros_saida'] },
]

export function getExpenseGroup(category: string): ExpenseGroupKey {
  const found = EXPENSE_GROUPS.find((g) => g.categories.includes(category))
  return found ? found.key : 'outros'
}
