"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

/**
 * Server Action: Update Essay Question draft response
 */
export async function updateEssayDraftAction(essayId: string, draftResponse: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized. Please sign in." };
  }

  try {
    const essay = await prisma.essayQuestion.findFirst({
      where: { id: essayId, userId: session.user.id },
    });

    if (!essay) {
      return { success: false, error: "Essay prompt not found or access denied." };
    }

    await prisma.essayQuestion.update({
      where: { id: essayId },
      data: { draftResponse },
    });

    // Create activity log
    await prisma.activityLog.create({
      data: {
        userId: session.user.id,
        opportunityId: essay.opportunityId,
        action: "ESSAY_DRAFT_UPDATED",
        description: `Updated draft response for essay prompt.`,
      },
    });

    revalidatePath(`/opportunities/${essay.opportunityId}`);
    return { success: true };
  } catch (err) {
    console.error(`Failed to update essay draft ${essayId}:`, err);
    return { success: false, error: "Failed to update draft response." };
  }
}

/**
 * Server Action: Update Personal Notes
 */
export async function updatePersonalNotesAction(opportunityId: string, personalNotes: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized. Please sign in." };
  }

  try {
    const existing = await prisma.opportunity.findFirst({
      where: { id: opportunityId, userId: session.user.id },
    });

    if (!existing) {
      return { success: false, error: "Opportunity not found or access denied." };
    }

    await prisma.opportunity.update({
      where: { id: opportunityId },
      data: { personalNotes },
    });

    // Log activity
    await prisma.activityLog.create({
      data: {
        userId: session.user.id,
        opportunityId,
        action: "NOTES_UPDATED",
        description: `Updated personal notes for "${existing.title}".`,
      },
    });

    revalidatePath(`/opportunities/${opportunityId}`);
    return { success: true };
  } catch (err) {
    console.error(`Failed to update notes for ${opportunityId}:`, err);
    return { success: false, error: "Failed to update notes." };
  }
}
