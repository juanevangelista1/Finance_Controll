import type {
  CategorizeRequestDTO,
  CategorizeResponseDTO,
  InsightsRequestDTO,
  InsightDTO,
} from '../dtos/AIRequestDTO'

export interface IAIService {
  categorize(request: CategorizeRequestDTO): Promise<CategorizeResponseDTO>
  generateInsights(request: InsightsRequestDTO): Promise<InsightDTO[]>
}
