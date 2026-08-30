import { GoogleGenAI, Type } from "@google/genai";
import {
  IAIExtractionService,
  ExtractedOpportunityData,
} from "./interfaces/ai-extraction.service";
import { logger } from "@/lib/logger";

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
    const textWithUrl = `Target Opportunity URL: ${url}\n\nPage Content:\n${pageText}`;
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
                description:
                  "Clean title of the opportunity without clickbait or aggregator tags (e.g. 'Mandela Washington Fellowship', not '[Fully Funded] Apply: Mandela Fellowship')",
              },
              organization: {
                type: Type.STRING,
                description:
                  "The actual offering organization, university, or company (e.g. 'Google', 'Stanford University'). NOT the job board or aggregator where it was posted.",
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
                description: "A brief 1-2 sentence executive summary of the opportunity",
              },
              fullDescription: {
                type: Type.STRING,
                description: "Full detailed description of the opportunity and key terms",
              },
              eligibility: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description:
                  "List of eligibility criteria (e.g. nationality, degree, age limit, experience)",
              },
              requirements: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "List of application requirements (e.g. CV, transcripts, references, essays)",
              },
              benefits: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description:
                  "List of benefits (e.g. stipend, fully-funded travel, tuition, mentorship, health insurance)",
              },
              applicationUrl: {
                type: Type.STRING,
                description:
                  "Direct URL to the actual application form or portal if found in text/links (empty string if not found)",
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
                  "Application deadline in ISO 8601 format (YYYY-MM-DD or YYYY-MM-DDTHH:mm:ss). If application is rolling or open until filled without a fixed date, set null.",
                nullable: true,
              },
              isRolling: {
                type: Type.BOOLEAN,
                description:
                  "Set to true if the application states 'Rolling', 'Rolling basis', 'Open until filled', 'Continuous intake', or has no fixed deadline.",
              },
              deadlineNote: {
                type: Type.STRING,
                description:
                  "Description of deadline status. For rolling applications, output: 'Rolling admission / Open until filled — submit application as soon as possible'. For fixed dates, summarize the closing date and timezone.",
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
                  "Timezone of the deadline (e.g. America/New_York, Africa/Lagos, UTC). Default to Africa/Lagos if not specified.",
              },
              essayQuestions: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description:
                  "List of essay prompts, personal statement questions, or motivation questions required",
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
              "isRolling",
              "deadlineNote",
              "originalTimezone",
              "essayQuestions",
            ],
          },
          systemInstruction:
            "You are an expert AI opportunity analyst for Apply Away, a specialized opportunity vault and tracking application. Your mission is to deeply analyze web pages and text posts (including job boards, aggregator posts, LinkedIn, WhatsApp messages, or official application portals) and extract structured opportunity details with the utmost accuracy.\n\nCRITICAL RULES:\n1. REAL SPONSORING ORGANIZATION: Always extract the actual offering entity/company/institution (e.g. 'Google', 'Stanford University', 'Mastercard Foundation'). NEVER attribute the opportunity to the aggregator or job board where it was posted (e.g. NOT 'OpportunityDesk', 'LinkedIn', 'Jobberman', 'ScholarshipTab').\n2. CLEAN TITLE: Extract the pure, professional opportunity title. Strip promotional junk, clickbait, and status prefixes (e.g., remove '[Fully Funded]', 'Call for Applications 2025:', 'Job Vacancy:').\n3. DEADLINES & ROLLING ADMISSIONS: Inspect the entire text for closing dates, submission cutoffs, and application windows. If the opportunity is 'Rolling', 'Rolling basis', 'Open until filled', or continuous, set isRolling to true, deadline to null, and deadlineNote to 'Rolling admission / Open until filled — submit application as soon as possible'. If a fixed date is provided, format deadline as ISO 8601.\n4. APPLICATION URL: Extract direct application portal/form links (e.g., forms.gle/..., apply.domain.com/...) found within the content.\n5. ELIGIBILITY, REQUIREMENTS & BENEFITS: Extract comprehensive bullet points as separate array items.\n6. ESSAY PROMPTS: Extract any writing prompts or essay questions required for applicants.",
        },
      });

      const rawText = response.text;
      if (!rawText) {
        throw new Error("Gemini returned an empty response.");
      }

      const parsed = JSON.parse(rawText);

      // Validate and normalize output to match ExtractedOpportunityData
      const isRolling = Boolean(parsed.isRolling);
      const deadlineNote =
        parsed.deadlineNote ||
        (isRolling
          ? "Rolling admission / Open until filled — submit application as soon as possible"
          : parsed.deadline
          ? `Application deadline: ${parsed.deadline}`
          : "Rolling admission / Open until filled — submit application as soon as possible");

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
        isRolling,
        deadlineNote,
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
      logger.error("[GeminiExtraction] Extraction failed:", errorMessage);
      throw new Error("Failed to extract opportunity data. Please try again or add it manually.");
    }
  }

  /**
   * Fetches and strips HTML from a given URL to extract readable, structured text content.
   */
  private async fetchUrlContent(url: string): Promise<string> {
    try {
      const res = await fetch(url, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
          Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.9",
        },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const html = await res.text();

      // Extract metadata
      const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
      const title = titleMatch ? titleMatch[1].trim() : "";

      const metaDescMatch =
        html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i) ||
        html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*name=["']description["']/i) ||
        html.match(/<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']+)["']/i);
      const description = metaDescMatch ? metaDescMatch[1].trim() : "";

      // Clean HTML structure into readable blocks
      let cleaned = html
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
        .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
        .replace(/<noscript\b[^<]*(?:(?!<\/noscript>)<[^<]*)*<\/noscript>/gi, "")
        .replace(/<svg\b[^<]*(?:(?!<\/svg>)<[^<]*)*<\/svg>/gi, "");

      // Replace block tags with newline separators
      cleaned = cleaned
        .replace(/<\/(h[1-6]|p|div|section|article|li|tr|blockquote)>/gi, "\n")
        .replace(/<br\s*[\/]?>/gi, "\n")
        .replace(/<li[^>]*>/gi, " • ")
        .replace(/<[^>]+>/g, " ")
        .replace(/&nbsp;/gi, " ")
        .replace(/&amp;/gi, "&")
        .replace(/&lt;/gi, "<")
        .replace(/&gt;/gi, ">")
        .replace(/&quot;/gi, '"')
        .replace(/&#39;/gi, "'")
        .replace(/[ \t]+/g, " ")
        .replace(/\n\s*\n+/g, "\n\n")
        .trim();

      // Combine metadata summary and body text (capped to 15,000 characters)
      const metaSection = [
        title ? `Page Title: ${title}` : "",
        description ? `Meta Description: ${description}` : "",
      ]
        .filter(Boolean)
        .join("\n");

      const combined = `${metaSection}\n\nMain Content:\n${cleaned}`.slice(0, 15000);
      return combined;
    } catch {
      return `URL: ${url}`;
    }
  }
}
