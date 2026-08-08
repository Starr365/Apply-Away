import { IAIExtractionService } from "./interfaces/ai-extraction.service";
import { GeminiAIExtractionService } from "./gemini-extraction.service";

/**
 * Factory pattern returning the production Gemini extraction service instance.
 */
export function getAIExtractionService(): IAIExtractionService {
  return new GeminiAIExtractionService();
}
