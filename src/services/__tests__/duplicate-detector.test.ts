import { describe, it, expect, vi } from "vitest";
import { DuplicateDetectorService } from "../duplicate-detector.service";
import { Opportunity } from "@/domain/opportunity.types";

vi.mock("@/repositories/prisma-opportunity.repository", () => {
  return {
    PrismaOpportunityRepository: class {
      findPotentialDuplicates = vi.fn().mockImplementation((_userId: string, title: string, org: string, officialUrl?: string) => {
        if (officialUrl === "https://example.com/grant") {
          return [
            {
              id: "opp-1",
              title: "Global Tech Grant",
              organization: "Tech Foundation",
              officialUrl: "https://example.com/grant",
            } as Opportunity,
          ];
        }
        if (title === "Global Tech Grant" && org === "Tech Foundation") {
          return [
            {
              id: "opp-2",
              title: "Global Tech Grant",
              organization: "Tech Foundation",
              officialUrl: "https://example.com/other",
            } as Opportunity,
          ];
        }
        return [];
      });
    },
  };
});

describe("DuplicateDetectorService", () => {
  const service = new DuplicateDetectorService();

  it("should return NONE when no duplicates are found", async () => {
    const result = await service.checkDuplicate("user-1", "Unique Title", "Unique Org");
    expect(result.isDuplicate).toBe(false);
    expect(result.matchType).toBe("NONE");
    expect(result.existingOpportunity).toBeNull();
  });

  it("should prioritize URL_MATCH when exact officialUrl exists", async () => {
    const result = await service.checkDuplicate(
      "user-1",
      "Global Tech Grant",
      "Tech Foundation",
      "https://example.com/grant"
    );
    expect(result.isDuplicate).toBe(true);
    expect(result.matchType).toBe("URL_MATCH");
    expect(result.existingOpportunity?.id).toBe("opp-1");
  });

  it("should return TITLE_ORG_MATCH when title and org match without direct URL match", async () => {
    const result = await service.checkDuplicate(
      "user-1",
      "Global Tech Grant",
      "Tech Foundation",
      "https://example.com/new-link"
    );
    expect(result.isDuplicate).toBe(true);
    expect(result.matchType).toBe("TITLE_ORG_MATCH");
  });
});
