import type { IAIService } from '../ports/IAIService'
import type { InsightsRequestDTO, InsightDTO } from '../dtos/AIRequestDTO'

export class GenerateInsightsUseCase {
  constructor(private readonly aiService: IAIService) {}

  async execute(request: InsightsRequestDTO): Promise<InsightDTO[]> {
    return this.aiService.generateInsights(request)
  }
}
