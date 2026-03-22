'use client'

import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react'
import type { Transaction } from '../../domain/transaction/entities/Transaction'
import type {
  CreateTransactionDTO,
  TransactionFilterDTO,
} from '../../application/transaction/dtos/TransactionDTO'
import { LocalStorageTransactionRepository } from '../../infrastructure/repositories/SessionStorageTransactionRepository'
import { CreateTransactionUseCase } from '../../application/transaction/use-cases/CreateTransactionUseCase'
import { GetTransactionsUseCase } from '../../application/transaction/use-cases/GetTransactionsUseCase'
import { DeleteTransactionUseCase } from '../../application/transaction/use-cases/DeleteTransactionUseCase'

// --- State & Actions ---
interface State {
  transactions: Transaction[]
  filter: TransactionFilterDTO
  isLoading: boolean
}

type Action =
  | { type: 'SET_TRANSACTIONS'; payload: Transaction[] }
  | { type: 'SET_FILTER'; payload: Partial<TransactionFilterDTO> }
  | { type: 'SET_LOADING'; payload: boolean }

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_TRANSACTIONS':
      return { ...state, transactions: action.payload, isLoading: false }
    case 'SET_FILTER':
      return { ...state, filter: { ...state.filter, ...action.payload } }
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload }
    default:
      return state
  }
}

// --- Context ---
interface TransactionsContextValue {
  transactions: Transaction[]
  filter: TransactionFilterDTO
  isLoading: boolean
  createTransaction: (data: CreateTransactionDTO) => void
  deleteTransaction: (id: string) => void
  setFilter: (filter: Partial<TransactionFilterDTO>) => void
  clearFilter: () => void
}

const TransactionsContext = createContext<TransactionsContextValue | null>(null)

// --- Repository & Use Cases (singleton) ---
const repository = new LocalStorageTransactionRepository()
const createUseCase = new CreateTransactionUseCase(repository)
const getUseCase = new GetTransactionsUseCase(repository)
const deleteUseCase = new DeleteTransactionUseCase(repository)

const now = new Date()
const initialFilter: TransactionFilterDTO = {
  month: now.getMonth(),
  year: now.getFullYear(),
}

// --- Provider ---
export function TransactionsProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, {
    transactions: [],
    filter: initialFilter,
    isLoading: true,
  })

  const loadTransactions = useCallback((filter: TransactionFilterDTO) => {
    dispatch({ type: 'SET_LOADING', payload: true })
    const result = getUseCase.execute(filter)
    dispatch({ type: 'SET_TRANSACTIONS', payload: result })
  }, [])

  useEffect(() => {
    loadTransactions(initialFilter)
  }, [loadTransactions])

  const createTransaction = useCallback(
    (data: CreateTransactionDTO) => {
      createUseCase.execute(data)
      loadTransactions(state.filter)
    },
    [state.filter, loadTransactions],
  )

  const deleteTransaction = useCallback(
    (id: string) => {
      deleteUseCase.execute(id)
      loadTransactions(state.filter)
    },
    [state.filter, loadTransactions],
  )

  const setFilter = useCallback(
    (filter: Partial<TransactionFilterDTO>) => {
      const newFilter = { ...state.filter, ...filter }
      dispatch({ type: 'SET_FILTER', payload: filter })
      loadTransactions(newFilter)
    },
    [state.filter, loadTransactions],
  )

  const clearFilter = useCallback(() => {
    const resetFilter = initialFilter
    dispatch({ type: 'SET_FILTER', payload: resetFilter })
    loadTransactions(resetFilter)
  }, [loadTransactions])

  return (
    <TransactionsContext.Provider
      value={{
        transactions: state.transactions,
        filter: state.filter,
        isLoading: state.isLoading,
        createTransaction,
        deleteTransaction,
        setFilter,
        clearFilter,
      }}
    >
      {children}
    </TransactionsContext.Provider>
  )
}

export function useTransactionsContext(): TransactionsContextValue {
  const ctx = useContext(TransactionsContext)
  if (!ctx) throw new Error('useTransactionsContext must be used within TransactionsProvider')
  return ctx
}
