export const TRANSACTION_TYPES = {
  INCOME: 'income',
  OUTCOME: 'outcome',
} as const

export type TransactionType = (typeof TRANSACTION_TYPES)[keyof typeof TRANSACTION_TYPES]
