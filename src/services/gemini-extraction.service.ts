import { GoogleGenAI, Type } from "@google/genai";
import {
  IAIExtractionService,
  ExtractedOpportunityData,
} from "./interfaces/ai-extraction.service";

/**
 * Google Gemini AI Extraction Service.
 * Uses @google/genai SDK with structured JSON output (constrained decoding).
 */
export class GeminiAIExtractionService implements IAIExtractionService {
  private ai: GoogleGenAI;
  private model: string;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY || "";
    this.model = process.env.GEMINI_MODEL || "gemini-3.6-flash";

    if (!apiKey || apiKey.trim() === "") {
      throw new Error(
        "Gemini API key is missing. Please set GEMINI_API_KEY in your .env file to enable AI extraction."
      );
    }

    this.ai = new GoogleGenAI({ apiKey });
  }

  async extractFromUrl(url: string): Promise<ExtractedOpportunityData> {
    const pageText = await this.fetchUrlContent(url);
    const textWithUrl = `Source URL: ${url}\n\n${pageText}`;
    const data = await this.extractFromText(textWithUrl);

    // Normalize and fallback if AI did not extract URLs
    if (!data.officialUrl || data.officialUrl.trim() === "") {
      data.officialUrl = url;
    }
    if (!data.applicationUrl || data.applicationUrl.trim() === "") {
      data.applicationUrl = url;
    }
    return data;
  }

  async extractFromText(text: string): Promise<ExtractedOpportunityData> {
    if (!text || text.trim() === "") {
      throw new Error("No text provided for extraction.");
    }

    try {
      const response = await this.ai.models.generateContent({
        model: this.model,
        contents: text,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: {
                type: Type.STRING,
                description: "Title of the opportunity",
              },
              organization: {
                type: Type.STRING,
                description: "Organization or company offering the opportunity",
              },
              category: {
                type: Type.STRING,
                description:
                  "Category of the opportunity. Must be one of: FELLOWSHIP, SCHOLARSHIP, INTERNSHIP, JOB, GRANT, COMPETITION, RESEARCH, CONFERENCE, BOOTCAMP, TRAINING, OTHER",
                enum: [
                  "FELLOWSHIP",
                  "SCHOLARSHIP",
                  "INTERNSHIP",
                  "JOB",
                  "GRANT",
                  "COMPETITION",
                  "RESEARCH",
                  "CONFERENCE",
                  "BOOTCAMP",
                  "TRAINING",
                  "OTHER",
                ],
              },
              shortDescription: {
                type: Type.STRING,
                description: "A brief one or two sentence summary of the opportunity",
              },
              fullDescription: {
                type: Type.STRING,
                description: "Full detailed description of the opportunity",
              },
              eligibility: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description:
                  "List of eligibility criteria (e.g. age, nationality, education level, GPA)",
              },
              requirements: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "List of application requirements (e.g. documents, essays, transcripts)",
              },
              benefits: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description:
                  "List of benefits provided (e.g. stipend, tuition coverage, travel, mentorship)",
              },
              applicationUrl: {
                type: Type.STRING,
                description: "Direct URL to the application form or portal (empty string if not found)",
              },
              officialUrl: {
                type: Type.STRING,
                description:
                  "Official webpage URL for the opportunity announcement (empty string if not found)",
              },
              startDate: {
                type: Type.STRING,
                description:
                  "Program or opportunity start date in ISO 8601 format (YYYY-MM-DD). Null if not found.",
                nullable: true,
              },
              deadline: {
                type: Type.STRING,
                description:
                  "Application deadline in ISO 8601 format (YYYY-MM-DD or YYYY-MM-DDTHH:mm:ss). Null if not found.",
                nullable: true,
              },
              interviewDate: {
                type: Type.STRING,
                description:
                  "Interview date in ISO 8601 format (YYYY-MM-DD). Null if not found.",
                nullable: true,
              },
              originalTimezone: {
                type: Type.STRING,
                description:
                  "Timezone of the deadline (e.g. America/New_York, Africa/Lagos, UTC). Default to Africa/Lagos if unclear.",
              },
              essayQuestions: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description:
                  "List of essay questions or writing prompts required for the application",
              },
            },
            required: [
              "title",
              "organization",
              "category",
              "shortDescription",
              "fullDescription",
              "eligibility",
              "requirements",
              "benefits",
              "applicationUrl",
              "officialUrl",
              "originalTimezone",
              "essayQuestions",
            ],
          },
          systemInstruction:
            "You are an AI assistant for Apply Away, a personal opportunity tracking application. Extract key opportunity information from the provided text into structured JSON. Be thorough and extract ALL details available. For eligibility, requirements, and benefits, extract each item as a separate string in the array. For dates, use ISO 8601 format. If a field is not found in the text, use an empty string for strings, an empty array for arrays, and null for nullable date fields. Always classify the opportunity into the most appropriate category.",
        },
      });

      const rawText = response.text;
      if (!rawText) {
        throw new Error("Gemini returned an empty response.");
      }

      const parsed = JSON.parse(rawText);

      // Validate and normalize output to match ExtractedOpportunityData
      const result: ExtractedOpportunityData = {
        title: parsed.title || "Extracted Opportunity",
        organization: parsed.organization || "Unknown Organization",
        category: parsed.category || "OTHER",
        shortDescription: parsed.shortDescription || "",
        fullDescription: parsed.fullDescription || text,
        eligibility: Array.isArray(parsed.eligibility) ? parsed.eligibility : [],
        requirements: Array.isArray(parsed.requirements) ? parsed.requirements : [],
        benefits: Array.isArray(parsed.benefits) ? parsed.benefits : [],
        applicationUrl: parsed.applicationUrl || "",
        officialUrl: parsed.officialUrl || "",
        startDate: parsed.startDate || null,
        deadline: parsed.deadline || null,
        interviewDate: parsed.interviewDate || null,
        originalTimezone: parsed.originalTimezone || "Africa/Lagos",
        essayQuestions: Array.isArray(parsed.essayQuestions) ? parsed.essayQuestions : [],
      };

      return result;
    } catch (error: unknown) {
      // Handle specific Gemini API errors with user-friendly messages
      const errorMessage = error instanceof Error ? error.message : String(error);
      const errorString = String(error);

      // Quota / Rate Limit errors
      if (
        errorString.includes("RESOURCE_EXHAUSTED") ||
        errorString.includes("429") ||
        errorString.includes("quota") ||
        errorString.includes("rate limit")
      ) {
        const quotaError = new Error(
          "AI extraction is temporarily unavailable. You've reached the current AI usage limit. You can still add this opportunity manually, or try again later."
        );
        (quotaError as Error & { isQuotaError: boolean }).isQuotaError = true;
        throw quotaError;
      }

      // Invalid API key
      if (
        errorString.includes("API_KEY_INVALID") ||
        errorString.includes("401") ||
        errorString.includes("UNAUTHENTICATED")
      ) {
        throw new Error(
          "AI extraction service is not configured correctly. Please contact the administrator."
        );
      }

      // Model not found
      if (
        errorString.includes("NOT_FOUND") ||
        errorString.includes("not found") ||
        errorString.includes("404")
      ) {
        throw new Error(
          `AI model "${this.model}" is not available. Please check your GEMINI_MODEL configuration.`
        );
      }

      // JSON parse failures
      if (errorMessage.includes("JSON") || errorMessage.includes("parse")) {
        throw new Error(
          "AI returned a malformed response. Please try again or add this opportunity manually."
        );
      }

      // Network errors
      if (
        errorString.includes("ENOTFOUND") ||
        errorString.includes("ECONNREFUSED") ||
        errorString.includes("fetch failed")
      ) {
        throw new Error(
          "Unable to reach the AI service. Please check your internet connection and try again."
        );
      }

      // Re-throw with sanitized message (never expose raw error details)
      console.error("[GeminiExtraction] Extraction failed:", errorMessage);
      throw new Error("Failed to extract opportunity data. Please try again or add it manually.");
    }
  }

  /**
   * Fetches and strips HTML from a given URL to extract readable text content.
   */
  private async fetchUrlContent(url: string): Promise<string> {
    try {
      const res = await fetch(url, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const html = await res.text();
      // Basic text cleanup: remove scripts, styles, HTML tags, and normalize whitespace
      return html
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
        .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
        .replace(/<[^>]+>/g, " ")
        .replace(/\s+/g, " ")
        .trim();
    } catch {
      return `URL: ${url}`;
    }
  }
}
