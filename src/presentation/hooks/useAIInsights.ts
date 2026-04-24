'use client'

import { useState, useCallback } from 'react'
import type { InsightDTO } from '../../application/ai/dtos/AIRequestDTO'
import type { Transaction } from '../../domain/transaction/entities/Transaction'
import { GeminiAIAdapter } from '../../infrastructure/ai/GeminiAIAdapter'
import { GenerateInsightsUseCase } from '../../application/ai/use-cases/GenerateInsightsUseCase'
import { MONTHS } from '../../shared/utils/formatter'

const adapter = new GeminiAIAdapter()
const generateInsightsUseCase = new GenerateInsightsUseCase(adapter)

export function useAIInsights() {
  const [insights, setInsights] = useState<InsightDTO[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchInsights = useCallback(async (transactions: Transaction[], month?: number, year?: number) => {
    if (transactions.length === 0) {
      setInsights([])
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const period = month !== undefined && year !== undefined
        ? `${MONTHS[month]} ${year}`
        : year !== undefined
          ? `${year}`
          : 'Período atual'

      const result = await generateInsightsUseCase.execute({
        transactions: transactions.map((t) => ({
          description: t.description,
          amount: t.amount,
          type: t.type,
          category: t.category,
          subcategory: t.subcategory,
          createdAt: t.createdAt,
        })),
        period,
      })

      setInsights(result)
    } catch (err) {
      console.error('Failed to fetch insights:', err)
      setError('Não foi possível gerar insights. Verifique se a API Key do Gemini está configurada.')
      setInsights([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  return { insights, isLoading, error, fetchInsights }
}
