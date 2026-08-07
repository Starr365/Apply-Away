import { OpportunityCategory } from "@/domain/opportunity.types";

export interface ExtractedOpportunityData {
  title: string;
  organization: string;
  category: OpportunityCategory;
  shortDescription: string;
  fullDescription: string;
  eligibility: string[];
  requirements: string[];
  benefits: string[];
  applicationUrl: string;
  officialUrl: string;
  startDate: string | null; // ISO Date String
  deadline: string | null; // ISO Date String
  interviewDate: string | null; // ISO Date String
  originalTimezone: string;
  essayQuestions: string[];
}

/**
 * Service interface for AI-powered Opportunity Extraction.
 */
export interface IAIExtractionService {
  extractFromUrl(url: string): Promise<ExtractedOpportunityData>;
  extractFromText(text: string): Promise<ExtractedOpportunityData>;
}
