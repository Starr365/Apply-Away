import { env } from "@/lib/env";
import {
  IAIExtractionService,
  ExtractedOpportunityData,
} from "./interfaces/ai-extraction.service";

/**
 * Production OpenAI API Extraction Service.
 * Uses OpenAI Structured JSON Extraction.
 */
export class OpenAIAIExtractionService implements IAIExtractionService {
  private apiKey: string;

  constructor() {
    this.apiKey = env.OPENAI_API_KEY || "";
  }

  async extractFromUrl(url: string): Promise<ExtractedOpportunityData> {
    if (!this.apiKey || this.apiKey.trim() === "") {
      throw new Error(
        "OpenAI API key is missing. Please set OPENAI_API_KEY in your .env file to enable AI extraction."
      );
    }

    // Scrape URL web page content
    const pageText = await this.fetchUrlContent(url);
    return this.extractFromText(pageText);
  }

  async extractFromText(text: string): Promise<ExtractedOpportunityData> {
    if (!this.apiKey || this.apiKey.trim() === "") {
      throw new Error(
        "OpenAI API key is missing. Please set OPENAI_API_KEY in your .env file to enable AI extraction."
      );
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "You are an AI assistant for Apply Away. Extract key opportunity information from text into structured JSON matching: title, organization, category (FELLOWSHIP, SCHOLARSHIP, INTERNSHIP, JOB, GRANT, COMPETITION, RESEARCH, CONFERENCE, BOOTCAMP, TRAINING, OTHER), shortDescription, fullDescription, eligibility, requirements, benefits, applicationUrl, officialUrl, startDate, deadline, interviewDate, originalTimezone, essayQuestions.",
          },
          {
            role: "user",
            content: text,
          },
        ],
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        `OpenAI API request failed: ${response.statusText} (${JSON.stringify(errorData)})`
      );
    }

    const result = await response.json();
    const parsed = JSON.parse(result.choices[0].message.content);

    return {
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
  }

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
      // Basic text cleanup
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
