"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

/**
 * Server Action: Save or update monthly reflection journal entry
 */
export async function saveMonthlyReflectionAction(monthYear: string, content: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized. Please sign in." };
  }

  if (!monthYear || monthYear.trim() === "") {
    return { success: false, error: "Invalid month year format." };
  }

  try {
    const reflection = await prisma.monthlyReflection.upsert({
      where: {
        userId_monthYear: {
          userId: session.user.id,
          monthYear: monthYear.trim(),
        },
      },
      update: {
        content,
      },
      create: {
        userId: session.user.id,
        monthYear: monthYear.trim(),
        content,
      },
    });

    revalidatePath("/reflection");
    return { success: true, data: reflection };
  } catch (err) {
    console.error("Failed to save monthly reflection:", err);
    return { success: false, error: "Failed to save monthly reflection notes." };
  }
}
