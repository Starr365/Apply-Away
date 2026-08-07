import {
  Opportunity,
  CreateOpportunityDto,
  UpdateOpportunityDto,
  OpportunityStatus,
  OpportunityCategory,
} from "@/domain/opportunity.types";

export interface OpportunityFilterParams {
  userId: string;
  category?: OpportunityCategory;
  status?: OpportunityStatus;
  search?: string;
  sortBy?: "deadline" | "createdAt" | "priority" | "title";
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}

/**
 * Interface defining the Opportunity Repository contract.
 * Following Clean Architecture: High-level business logic services depend on this interface,
 * enabling flexible database persistence layer implementations (Prisma, Mock, Postgres).
 */
export interface IOpportunityRepository {
  findById(id: string, userId: string): Promise<Opportunity | null>;
  findAll(params: OpportunityFilterParams): Promise<{ items: Opportunity[]; total: number }>;
  create(data: CreateOpportunityDto): Promise<Opportunity>;
  update(id: string, userId: string, data: UpdateOpportunityDto): Promise<Opportunity>;
  delete(id: string, userId: string): Promise<boolean>;
  findPotentialDuplicates(
    userId: string,
    title: string,
    organization: string,
    officialUrl?: string
  ): Promise<Opportunity[]>;
}
