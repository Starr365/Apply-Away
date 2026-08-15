import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { EmailService } from "@/services/email.service";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required." }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user) {
      // Fail silently to prevent user enumeration, but return a success message
      return NextResponse.json({
        success: true,
        message: "If your email is registered, we have sent a reset code.",
      });
    }

    // Generate a secure 6-digit verification code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes expiry

    // Upsert password reset entry
    await prisma.passwordReset.upsert({
      where: { email: normalizedEmail },
      update: { code, expiresAt, createdAt: new Date() },
      create: { email: normalizedEmail, code, expiresAt },
    });

    // Send code to email
    const emailService = new EmailService();
    await emailService.sendPasswordResetEmail({
      toEmail: normalizedEmail,
      code,
    });

    return NextResponse.json({
      success: true,
      message: "Verification code sent successfully to your email.",
    });
  } catch (error) {
    console.error("[ForgotPassword] Error:", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
