"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateUserTimezone(newTimezone: string) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized. Please sign in.");
  }

  if (!newTimezone || newTimezone.trim() === "") {
    throw new Error("Invalid timezone.");
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: { timezone: newTimezone },
  });

  revalidatePath("/profile");
  revalidatePath("/dashboard");

  return { success: true, timezone: newTimezone };
}
