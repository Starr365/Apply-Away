"use server";

import { auth } from "@/lib/auth";
import { PrismaOpportunityRepository } from "@/repositories/prisma-opportunity.repository";
import {
  CreateOpportunityDtoSchema,
  UpdateOpportunityDtoSchema,
  OpportunityStatusSchema,
  OpportunityPrioritySchema,
  OpportunityStatus,
  OpportunityPriority,
} from "@/domain/opportunity.types";
import { revalidatePath } from "next/cache";

const repository = new PrismaOpportunityRepository();

/**
 * Server Action: Create a new opportunity
 */
export async function createOpportunityAction(formData: unknown) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized. Please sign in." };
  }

  const result = CreateOpportunityDtoSchema.safeParse({
    ...(formData as object),
    userId: session.user.id,
  });

  if (!result.success) {
    return {
      success: false,
      error: "Validation failed.",
      fieldErrors: result.error.flatten().fieldErrors,
    };
  }

  try {
    const opportunity = await repository.create(result.data);

    // Create activity log
    const { prisma } = await import("@/lib/prisma");
    await prisma.activityLog.create({
      data: {
        userId: session.user.id,
        opportunityId: opportunity.id,
        action: "OPPORTUNITY_CREATED",
        description: `Created opportunity "${opportunity.title}" (${opportunity.organization}).`,
      },
    });

    revalidatePath("/dashboard");
    return { success: true, data: opportunity };
  } catch (err) {
    console.error("Failed to create opportunity:", err);
    return { success: false, error: "Failed to create opportunity. Please try again." };
  }
}

/**
 * Server Action: Update an existing opportunity
 */
export async function updateOpportunityAction(id: string, formData: unknown) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized. Please sign in." };
  }

  const result = UpdateOpportunityDtoSchema.safeParse(formData);
  if (!result.success) {
    return {
      success: false,
      error: "Validation failed.",
      fieldErrors: result.error.flatten().fieldErrors,
    };
  }

  try {
    const opportunity = await repository.update(id, session.user.id, result.data);

    // Create activity log
    const { prisma } = await import("@/lib/prisma");
    await prisma.activityLog.create({
      data: {
        userId: session.user.id,
        opportunityId: opportunity.id,
        action: "OPPORTUNITY_UPDATED",
        description: `Updated opportunity details for "${opportunity.title}".`,
      },
    });

    revalidatePath("/dashboard");
    revalidatePath(`/opportunities/${id}`);
    return { success: true, data: opportunity };
  } catch (err) {
    console.error(`Failed to update opportunity ${id}:`, err);
    return { success: false, error: "Failed to update opportunity. Please try again." };
  }
}

/**
 * Server Action: Delete an opportunity
 */
export async function deleteOpportunityAction(id: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized. Please sign in." };
  }

  try {
    const deleted = await repository.delete(id, session.user.id);
    if (!deleted) {
      return { success: false, error: "Opportunity not found or access denied." };
    }

    revalidatePath("/dashboard");
    return { success: true };
  } catch (err) {
    console.error(`Failed to delete opportunity ${id}:`, err);
    return { success: false, error: "Failed to delete opportunity. Please try again." };
  }
}

/**
 * Server Action: Quick update status
 */
export async function updateOpportunityStatusAction(
  id: string,
  status: OpportunityStatus
) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized. Please sign in." };
  }

  const parsedStatus = OpportunityStatusSchema.safeParse(status);
  if (!parsedStatus.success) {
    return { success: false, error: "Invalid status value." };
  }

  try {
    const opportunity = await repository.update(id, session.user.id, {
      status: parsedStatus.data,
    });

    // Create activity log
    const { prisma } = await import("@/lib/prisma");
    await prisma.activityLog.create({
      data: {
        userId: session.user.id,
        opportunityId: opportunity.id,
        action: "STATUS_CHANGED",
        description: `Changed status to "${parsedStatus.data.replace(/_/g, " ")}".`,
      },
    });

    revalidatePath("/dashboard");
    return { success: true, data: opportunity };
  } catch (err) {
    console.error(`Failed to update status for ${id}:`, err);
    return { success: false, error: "Failed to update status." };
  }
}

/**
 * Server Action: Quick update priority
 */
export async function updateOpportunityPriorityAction(
  id: string,
  priority: OpportunityPriority
) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized. Please sign in." };
  }

  const parsedPriority = OpportunityPrioritySchema.safeParse(priority);
  if (!parsedPriority.success) {
    return { success: false, error: "Invalid priority value." };
  }

  try {
    const opportunity = await repository.update(id, session.user.id, {
      priority: parsedPriority.data,
    });

    // Create activity log
    const { prisma } = await import("@/lib/prisma");
    await prisma.activityLog.create({
      data: {
        userId: session.user.id,
        opportunityId: opportunity.id,
        action: "PRIORITY_UPDATED",
        description: `Updated priority to "${parsedPriority.data}".`,
      },
    });

    revalidatePath("/dashboard");
    return { success: true, data: opportunity };
  } catch (err) {
    console.error(`Failed to update priority for ${id}:`, err);
    return { success: false, error: "Failed to update priority." };
  }
}
