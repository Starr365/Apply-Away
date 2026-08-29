import { NextRequest, NextResponse } from "next/server";
import * as bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/logger";

export async function POST(req: NextRequest) {
  try {
    const { email, code, newPassword } = await req.json();

    if (!email || !code || !newPassword) {
      return NextResponse.json(
        { error: "Email, code, and new password are required." },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check reset request
    const resetRequest = await prisma.passwordReset.findUnique({
      where: { email: normalizedEmail },
    });

    if (!resetRequest || resetRequest.code !== code.trim()) {
      return NextResponse.json({ error: "Invalid verification code." }, { status: 400 });
    }

    if (new Date() > resetRequest.expiresAt) {
      return NextResponse.json({ error: "Verification code has expired." }, { status: 400 });
    }

    // Hash the new password
    const passwordHash = await bcrypt.hash(newPassword, 12);

    // Update user password and clear reset code in transaction
    await prisma.$transaction([
      prisma.user.update({
        where: { email: normalizedEmail },
        data: { passwordHash },
      }),
      prisma.passwordReset.delete({
        where: { email: normalizedEmail },
      }),
    ]);

    return NextResponse.json({
      success: true,
      message: "Password updated successfully. Please login with your new password.",
    });
  } catch (error) {
    logger.error("[ResetPassword] Error:", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
