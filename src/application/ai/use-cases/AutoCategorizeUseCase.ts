import type { IAIService } from '../ports/IAIService'
import type { CategorizeRequestDTO, CategorizeResponseDTO } from '../dtos/AIRequestDTO'

export class AutoCategorizeUseCase {
  constructor(private readonly aiService: IAIService) {}

  async execute(request: CategorizeRequestDTO): Promise<CategorizeResponseDTO> {
    return this.aiService.categorize(request)
  }
}
