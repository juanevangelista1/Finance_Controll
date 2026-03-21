export const priceFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
})

export const dateFormatter = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
})

export const MONTHS = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
]

export const MONTHS_SHORT = [
  'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
  'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez',
]

export function formatCurrency(value: number): string {
  return priceFormatter.format(value)
}

export function formatDate(dateString: string): string {
  return dateFormatter.format(new Date(dateString))
}

const START_YEAR = 2026

export function getYearRange(): number[] {
  const currentYear = new Date().getFullYear()
  const endYear = Math.max(currentYear + 1, START_YEAR)
  return Array.from({ length: endYear - START_YEAR + 1 }, (_, i) => START_YEAR + i)
}
