import { NextRequest, NextResponse } from "next/server";
import * as bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { trackEvent } from "@/lib/analytics";

export async function POST(req: NextRequest) {
  try {
    const { email, name, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check if user already exists
    const existing = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existing) {
      return NextResponse.json(
        { error: "An account with this email already exists." },
        { status: 409 }
      );
    }

    // Hash password with bcrypt
    const passwordHash = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        email: normalizedEmail,
        name: name || "Apply Away User",
        passwordHash,
        timezone: "Africa/Lagos",
      },
    });

    // Track analytics sign_up event (centralized trackEvent)
    await trackEvent({
      eventName: "sign_up",
      userId: user.id,
      metadata: { email: normalizedEmail },
    });

    // Send welcome email via EmailService
    try {
      const { EmailService } = await import("@/services/email.service");
      const emailService = new EmailService();
      await emailService.sendWelcomeEmail({
        toEmail: normalizedEmail,
        userName: user.name || "Apply Away User",
      });
    } catch (emailErr) {
      console.warn("[SignUp] Failed to send welcome email:", emailErr);
    }

    return NextResponse.json(
      { message: "Account created successfully! Please sign in below.", userId: user.id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
