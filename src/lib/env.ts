import { z } from "zod";

/**
 * Environment variable schema definition.
 * Enforces runtime validation for both server-side and client-side variables.
 */
const envSchema = z.object({
  // Database Configuration
  DATABASE_URL: z
    .string()
    .min(1, "DATABASE_URL is required")
    .default("postgresql://user:password@localhost:5432/apply_away?schema=public"),

  // Authentication Configuration
  NEXTAUTH_SECRET: z
    .string()
    .min(1, "NEXTAUTH_SECRET is required")
    .default("development-nextauth-secret-key-min-32-chars-long"),
  NEXTAUTH_URL: z
    .string()
    .url("NEXTAUTH_URL must be a valid URL")
    .default("http://localhost:3000"),
  AUTH_GOOGLE_ID: z.string().optional(),
  AUTH_GOOGLE_SECRET: z.string().optional(),

  // AI Service Configuration (Google Gemini)
  GEMINI_API_KEY: z.string().optional(),
  GEMINI_MODEL: z.string().default("gemini-3.6-flash"),

  // Public Application URL (used for email links and metadata)
  NEXT_PUBLIC_APP_URL: z.string().url("NEXT_PUBLIC_APP_URL must be a valid URL").optional(),

  // Email Service Configuration.
  RESEND_API_KEY: z.string().optional(),
  EMAIL_FROM: z.string().min(1).default("notifications@applyaway.mmesomanzeribe.me"),

  // Reminder Scheduling Configuration
  CRON_SECRET: z.string().optional(),
  REMINDER_HOUR: z.coerce.number().int().min(0).max(23).default(7),
  ENABLE_NODE_CRON: z.string().optional(),

  // Timezone Configuration
  DEFAULT_TIMEZONE: z.string().default("Africa/Lagos"),

  // Node Environment
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
});

/**
 * Parses and validates process.env against envSchema.
 * Safe fallback for client runtime compilation without crashing.
 */
export function getEnv() {
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    console.warn("⚠️ Invalid environment variables detected:", result.error.flatten().fieldErrors);
    // Return formatted defaults for smooth development start
    return envSchema.parse({
      DATABASE_URL: process.env.DATABASE_URL || "postgresql://user:password@localhost:5432/apply_away",
      NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET || "development-nextauth-secret-key-min-32-chars-long",
      NEXTAUTH_URL: process.env.NEXTAUTH_URL || "http://localhost:3000",
      GEMINI_API_KEY: process.env.GEMINI_API_KEY,
      GEMINI_MODEL: process.env.GEMINI_MODEL || "gemini-3.6-flash",
      NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
      RESEND_API_KEY: process.env.RESEND_API_KEY,
      EMAIL_FROM: process.env.EMAIL_FROM || "notifications@applyaway.mmesomanzeribe.me",
      CRON_SECRET: process.env.CRON_SECRET,
      REMINDER_HOUR: process.env.REMINDER_HOUR || 7,
      ENABLE_NODE_CRON: process.env.ENABLE_NODE_CRON,
      DEFAULT_TIMEZONE: process.env.DEFAULT_TIMEZONE || "Africa/Lagos",
      NODE_ENV: process.env.NODE_ENV || "development",
    });
  }

  return result.data;
}

export const env = getEnv();
