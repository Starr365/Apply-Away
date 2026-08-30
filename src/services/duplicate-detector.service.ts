import { PrismaOpportunityRepository } from "@/repositories/prisma-opportunity.repository";
import { Opportunity } from "@/domain/opportunity.types";

const repository = new PrismaOpportunityRepository();

export interface DuplicateCheckResult {
  isDuplicate: boolean;
  matchType: "URL_MATCH" | "TITLE_ORG_MATCH" | "NONE";
  existingOpportunity: Opportunity | null;
}

/**
 * Strips tracking parameters, hash, protocol, and trailing slashes to get a canonical URL key.
 */
function canonicalizeUrl(urlStr?: string | null): string {
  if (!urlStr || urlStr.trim() === "") return "";
  try {
    const u = new URL(urlStr.trim());
    const trackingParams = [
      "utm_source",
      "utm_medium",
      "utm_campaign",
      "utm_term",
      "utm_content",
      "ref",
      "source",
      "fbclid",
      "gclid",
      "mc_cid",
      "mc_eid",
      "trk",
      "tracking",
      "spm",
    ];
    trackingParams.forEach((param) => u.searchParams.delete(param));
    const path = u.pathname.replace(/\/+$/, "");
    const search = u.searchParams.toString();
    return `${u.hostname.toLowerCase().replace(/^www\./, "")}${path}${search ? `?${search}` : ""}`;
  } catch {
    return urlStr
      .toLowerCase()
      .trim()
      .replace(/^https?:\/\//, "")
      .replace(/^www\./, "")
      .replace(/\/+$/, "");
  }
}

/**
 * Normalizes organization name by stripping legal designations and non-alphanumeric chars.
 */
function normalizeOrg(org?: string | null): string {
  if (!org) return "";
  return org
    .toLowerCase()
    .replace(
      /\b(inc|incorporated|llc|ltd|limited|corp|corporation|co|company|foundation|organization|org|university|college|institute|group)\b/gi,
      ""
    )
    .replace(/[^a-z0-9]/g, "")
    .trim();
}

/**
 * Tokenizes text into a set of meaningful words (stripping common stopwords and punctuation).
 */
function tokenizeTitle(text?: string | null): Set<string> {
  if (!text) return new Set();
  const stopWords = new Set([
    "the",
    "a",
    "an",
    "and",
    "or",
    "for",
    "in",
    "at",
    "of",
    "to",
    "on",
    "with",
    "by",
    "from",
    "is",
    "program",
    "opportunity",
    "application",
    "applications",
    "fellowship",
    "scholarship",
    "internship",
    "grant",
    "call",
    "annual",
    "global",
    "fully",
    "funded",
  ]);

  return new Set(
    text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter((w) => w.length > 2 && !stopWords.has(w))
  );
}

/**
 * Computes Jaccard token similarity (0.0 to 1.0) between two token sets.
 */
function computeJaccardSimilarity(setA: Set<string>, setB: Set<string>): number {
  if (setA.size === 0 || setB.size === 0) return 0;
  let intersection = 0;
  for (const item of setA) {
    if (setB.has(item)) intersection++;
  }
  const union = new Set([...setA, ...setB]).size;
  return union > 0 ? intersection / union : 0;
}

/**
 * Service comparing incoming extracted opportunity data against existing vault records
 * using canonical URL matching and fuzzy token similarity across job boards.
 */
export class DuplicateDetectorService {
  async checkDuplicate(
    userId: string,
    title: string,
    organization: string,
    officialUrl?: string
  ): Promise<DuplicateCheckResult> {
    const existingList = await repository.findPotentialDuplicates(
      userId,
      title,
      organization,
      officialUrl
    );

    if (existingList.length === 0) {
      return { isDuplicate: false, matchType: "NONE", existingOpportunity: null };
    }

    const incomingCanonicalUrl = canonicalizeUrl(officialUrl);
    const incomingNormOrg = normalizeOrg(organization);
    const incomingTokens = tokenizeTitle(title);
    const incomingNormTitle = title.toLowerCase().replace(/[^a-z0-9]/g, "");

    // 1. Canonical URL Match
    if (incomingCanonicalUrl !== "") {
      const urlMatch = existingList.find((opp) => {
        const oppOfficial = canonicalizeUrl(opp.officialUrl);
        const oppApp = canonicalizeUrl(opp.applicationUrl);
        return (
          (oppOfficial !== "" && oppOfficial === incomingCanonicalUrl) ||
          (oppApp !== "" && oppApp === incomingCanonicalUrl)
        );
      });

      if (urlMatch) {
        return {
          isDuplicate: true,
          matchType: "URL_MATCH",
          existingOpportunity: urlMatch,
        };
      }
    }

    // 2. Exact or High-Similarity Org + Title Match across different job boards
    for (const opp of existingList) {
      const oppNormOrg = normalizeOrg(opp.organization);
      const orgMatches =
        incomingNormOrg !== "" &&
        oppNormOrg !== "" &&
        (incomingNormOrg === oppNormOrg ||
          incomingNormOrg.includes(oppNormOrg) ||
          oppNormOrg.includes(incomingNormOrg));

      const oppNormTitle = opp.title.toLowerCase().replace(/[^a-z0-9]/g, "");

      // Exact title match
      if (incomingNormTitle === oppNormTitle && (orgMatches || incomingNormOrg === "" || oppNormOrg === "")) {
        return {
          isDuplicate: true,
          matchType: "TITLE_ORG_MATCH",
          existingOpportunity: opp,
        };
      }

      // If organizations match, check token similarity in titles (e.g. "Software Engineer Intern" vs "Software Engineering Intern - 2025")
      if (orgMatches) {
        const oppTokens = tokenizeTitle(opp.title);
        const similarity = computeJaccardSimilarity(incomingTokens, oppTokens);

        // Either >= 40% token overlap or one title contains the other
        if (
          similarity >= 0.4 ||
          (incomingNormTitle.length > 5 && oppNormTitle.includes(incomingNormTitle)) ||
          (oppNormTitle.length > 5 && incomingNormTitle.includes(oppNormTitle))
        ) {
          return {
            isDuplicate: true,
            matchType: "TITLE_ORG_MATCH",
            existingOpportunity: opp,
          };
        }
      }
    }

    return { isDuplicate: false, matchType: "NONE", existingOpportunity: null };
  }
}
