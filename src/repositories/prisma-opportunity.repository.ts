import { prisma } from "@/lib/prisma";
import {
  IOpportunityRepository,
  OpportunityFilterParams,
} from "./interfaces/opportunity.repository";
import {
  Opportunity,
  CreateOpportunityDto,
  UpdateOpportunityDto,
} from "@/domain/opportunity.types";

type OpportunityWhereInput = NonNullable<Parameters<typeof prisma.opportunity.findMany>[0]>["where"];
type OpportunityUpdateInput = NonNullable<Parameters<typeof prisma.opportunity.update>[0]>["data"];

/**
 * Concrete Prisma implementation of IOpportunityRepository.
 * Enforces strict multi-tenant isolation by requiring `userId` on all queries.
 */
export class PrismaOpportunityRepository implements IOpportunityRepository {
  async findById(id: string, userId: string): Promise<Opportunity | null> {
    const record = await prisma.opportunity.findFirst({
      where: { id, userId },
      include: {
        essayQuestions: true,
      },
    });

    if (!record) return null;
    return record as unknown as Opportunity;
  }

  async findAll(
    params: OpportunityFilterParams
  ): Promise<{ items: Opportunity[]; total: number }> {
    const {
      userId,
      category,
      status,
      search,
      sortBy = "createdAt",
      sortOrder = "desc",
      page = 1,
      limit = 10,
    } = params;

    const where: OpportunityWhereInput = {
      userId,
      ...(category ? { category } : {}),
      ...(status ? { status } : {}),
      ...(search
        ? {
            OR: [
              { title: { contains: search, mode: "insensitive" } },
              { organization: { contains: search, mode: "insensitive" } },
              { shortDescription: { contains: search, mode: "insensitive" } },
            ],
          }
        : {}),
    };

    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      prisma.opportunity.findMany({
        where,
        orderBy: { [sortBy]: sortOrder },
        skip,
        take: limit,
        include: {
          essayQuestions: true,
        },
      }),
      prisma.opportunity.count({ where }),
    ]);

    return {
      items: items as unknown as Opportunity[],
      total,
    };
  }

  async create(data: CreateOpportunityDto): Promise<Opportunity> {
    const { essayQuestions = [], ...rest } = data;

    const record = await prisma.opportunity.create({
      data: {
        ...rest,
        essayQuestions: {
          create: essayQuestions.map((q) => ({
            userId: data.userId,
            question: q.question,
            wordLimit: q.wordLimit,
            draftResponse: q.draftResponse,
          })),
        },
      },
      include: {
        essayQuestions: true,
      },
    });

    return record as unknown as Opportunity;
  }

  async update(
    id: string,
    userId: string,
    data: UpdateOpportunityDto
  ): Promise<Opportunity> {
    const updatePayload = { ...data };
    delete (updatePayload as Record<string, unknown>).essayQuestions;
    delete (updatePayload as Record<string, unknown>).userId;

    // Verify user ownership
    const existing = await prisma.opportunity.findFirst({
      where: { id, userId },
    });

    if (!existing) {
      throw new Error(`Opportunity with ID ${id} not found or access denied.`);
    }

    const record = await prisma.opportunity.update({
      where: { id },
      data: updatePayload as OpportunityUpdateInput,
      include: {
        essayQuestions: true,
      },
    });

    return record as unknown as Opportunity;
  }

  async delete(id: string, userId: string): Promise<boolean> {
    const existing = await prisma.opportunity.findFirst({
      where: { id, userId },
    });

    if (!existing) return false;

    await prisma.opportunity.delete({
      where: { id },
    });

    return true;
  }

  async findPotentialDuplicates(
    userId: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _title: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _organization: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _officialUrl?: string
  ): Promise<Opportunity[]> {
    const items = await prisma.opportunity.findMany({
      where: {
        userId,
      },
      include: {
        essayQuestions: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return items as unknown as Opportunity[];
  }
}
