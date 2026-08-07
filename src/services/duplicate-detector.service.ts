import { PrismaOpportunityRepository } from "@/repositories/prisma-opportunity.repository";
import { Opportunity } from "@/domain/opportunity.types";

const repository = new PrismaOpportunityRepository();

export interface DuplicateCheckResult {
  isDuplicate: boolean;
  matchType: "URL_MATCH" | "TITLE_ORG_MATCH" | "NONE";
  existingOpportunity: Opportunity | null;
}

/**
 * Service comparing incoming extracted opportunity data against existing vault records.
 */
export class DuplicateDetectorService {
  async checkDuplicate(
    userId: string,
    title: string,
    organization: string,
    officialUrl?: string
  ): Promise<DuplicateCheckResult> {
    const matches = await repository.findPotentialDuplicates(
      userId,
      title,
      organization,
      officialUrl
    );

    if (matches.length === 0) {
      return { isDuplicate: false, matchType: "NONE", existingOpportunity: null };
    }

    // Prioritize URL match if exact match exists
    const urlMatch = officialUrl
      ? matches.find(
          (m) => m.officialUrl && m.officialUrl.toLowerCase() === officialUrl.toLowerCase()
        )
      : null;

    if (urlMatch) {
      return {
        isDuplicate: true,
        matchType: "URL_MATCH",
        existingOpportunity: urlMatch,
      };
    }

    return {
      isDuplicate: true,
      matchType: "TITLE_ORG_MATCH",
      existingOpportunity: matches[0],
    };
  }
}
