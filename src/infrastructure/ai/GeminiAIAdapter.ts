import type { IAIService } from '../../application/ai/ports/IAIService'
import type {
  CategorizeRequestDTO,
  CategorizeResponseDTO,
  InsightsRequestDTO,
  InsightDTO,
} from '../../application/ai/dtos/AIRequestDTO'

/**
 * AI adapter that calls Next.js API Routes which proxy to Google Gemini.
 * This keeps the API key on the server side.
 */
export class GeminiAIAdapter implements IAIService {
  async categorize(request: CategorizeRequestDTO): Promise<CategorizeResponseDTO> {
    const response = await fetch('/api/ai/categorize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    })

    if (!response.ok) {
      throw new Error(`AI categorize failed: ${response.status}`)
    }

    return response.json()
  }

  async generateInsights(request: InsightsRequestDTO): Promise<InsightDTO[]> {
    const response = await fetch('/api/ai/insights', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    })

    if (!response.ok) {
      throw new Error(`AI insights failed: ${response.status}`)
    }

    return response.json()
  }
}
