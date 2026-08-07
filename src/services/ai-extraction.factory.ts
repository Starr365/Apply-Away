import { IAIExtractionService } from "./interfaces/ai-extraction.service";
import { OpenAIAIExtractionService } from "./openai-extraction.service";

/**
 * Factory pattern returning the production OpenAI extraction service instance.
 */
export function getAIExtractionService(): IAIExtractionService {
  return new OpenAIAIExtractionService();
}
