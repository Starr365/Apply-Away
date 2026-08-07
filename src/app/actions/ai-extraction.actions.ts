"use server";

import { auth } from "@/lib/auth";
import { getAIExtractionService } from "@/services/ai-extraction.factory";
import { DuplicateDetectorService } from "@/services/duplicate-detector.service";
import { ExtractedOpportunityData } from "@/services/interfaces/ai-extraction.service";

const duplicateDetector = new DuplicateDetectorService();

export interface AIExtractionActionResult {
  success: boolean;
  data?: ExtractedOpportunityData;
  isDuplicate?: boolean;
  duplicateMatchType?: "URL_MATCH" | "TITLE_ORG_MATCH" | "NONE";
  existingOpportunityId?: string;
  error?: string;
}

/**
 * Server Action: Extract opportunity from URL or raw text input via OpenAI Structured Outputs.
 */
export async function extractOpportunityAction(params: {
  url?: string;
  text?: string;
}): Promise<AIExtractionActionResult> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized. Please sign in." };
  }

  const { url, text } = params;
  if ((!url || url.trim() === "") && (!text || text.trim() === "")) {
    return { success: false, error: "Please provide a website URL or paste opportunity text." };
  }

  try {
    const aiService = getAIExtractionService();
    let extractedData: ExtractedOpportunityData;

    if (url && url.trim() !== "") {
      extractedData = await aiService.extractFromUrl(url.trim());
    } else if (text && text.trim() !== "") {
      extractedData = await aiService.extractFromText(text.trim());
    } else {
      return { success: false, error: "Invalid extraction parameters." };
    }

    // Check duplicate status against user's vault
    const dupCheck = await duplicateDetector.checkDuplicate(
      session.user.id,
      extractedData.title,
      extractedData.organization,
      extractedData.officialUrl || extractedData.applicationUrl
    );

    return {
      success: true,
      data: extractedData,
      isDuplicate: dupCheck.isDuplicate,
      duplicateMatchType: dupCheck.matchType,
      existingOpportunityId: dupCheck.existingOpportunity?.id,
    };
  } catch (err: unknown) {
    console.error("AI Extraction Action failed:", err);
    const errorMessage =
      err instanceof Error ? err.message : "Failed to extract opportunity data. Please try again.";
    return { success: false, error: errorMessage };
  }
}
