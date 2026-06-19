'use client'

import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react'
import type { CreditCard } from '../../domain/creditCard/entities/CreditCard'
import type {
  CreateCreditCardDTO,
  UpdateCreditCardDTO,
} from '../../application/creditCard/dtos/CreditCardDTO'
import { LocalStorageCreditCardRepository } from '../../infrastructure/repositories/LocalStorageCreditCardRepository'
import { CreateCreditCardUseCase } from '../../application/creditCard/use-cases/CreateCreditCardUseCase'
import { GetCreditCardsUseCase } from '../../application/creditCard/use-cases/GetCreditCardsUseCase'
import { UpdateCreditCardUseCase } from '../../application/creditCard/use-cases/UpdateCreditCardUseCase'
import { DeleteCreditCardUseCase } from '../../application/creditCard/use-cases/DeleteCreditCardUseCase'

interface State {
  cards: CreditCard[]
  isLoading: boolean
}

type Action =
  | { type: 'SET_CARDS'; payload: CreditCard[] }
  | { type: 'SET_LOADING'; payload: boolean }

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_CARDS':
      return { ...state, cards: action.payload, isLoading: false }
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload }
    default:
      return state
  }
}

interface CreditCardsContextValue {
  cards: CreditCard[]
  isLoading: boolean
  createCard: (data: CreateCreditCardDTO) => void
  updateCard: (id: string, data: UpdateCreditCardDTO) => void
  deleteCard: (id: string) => void
}

const CreditCardsContext = createContext<CreditCardsContextValue | null>(null)

const repository = new LocalStorageCreditCardRepository()
const createUseCase = new CreateCreditCardUseCase(repository)
const getUseCase = new GetCreditCardsUseCase(repository)
const updateUseCase = new UpdateCreditCardUseCase(repository)
const deleteUseCase = new DeleteCreditCardUseCase(repository)

export function CreditCardsProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { cards: [], isLoading: true })

  const loadCards = useCallback(() => {
    dispatch({ type: 'SET_LOADING', payload: true })
    dispatch({ type: 'SET_CARDS', payload: getUseCase.execute() })
  }, [])

  useEffect(() => {
    loadCards()
  }, [loadCards])

  const createCard = useCallback(
    (data: CreateCreditCardDTO) => {
      createUseCase.execute(data)
      loadCards()
    },
    [loadCards],
  )

  const updateCard = useCallback(
    (id: string, data: UpdateCreditCardDTO) => {
      updateUseCase.execute(id, data)
      loadCards()
    },
    [loadCards],
  )

  const deleteCard = useCallback(
    (id: string) => {
      deleteUseCase.execute(id)
      loadCards()
    },
    [loadCards],
  )

  return (
    <CreditCardsContext.Provider
      value={{ cards: state.cards, isLoading: state.isLoading, createCard, updateCard, deleteCard }}
    >
      {children}
    </CreditCardsContext.Provider>
  )
}

export function useCreditCardsContext(): CreditCardsContextValue {
  const ctx = useContext(CreditCardsContext)
  if (!ctx) throw new Error('useCreditCardsContext must be used within CreditCardsProvider')
  return ctx
}
