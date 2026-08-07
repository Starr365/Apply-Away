import { z } from "zod";

/**
 * Domain Enums & Schemas for Apply Away
 */

export const OpportunityCategorySchema = z.enum([
  "FELLOWSHIP",
  "SCHOLARSHIP",
  "INTERNSHIP",
  "JOB",
  "GRANT",
  "COMPETITION",
  "RESEARCH",
  "CONFERENCE",
  "BOOTCAMP",
  "TRAINING",
  "OTHER",
]);

export type OpportunityCategory = z.infer<typeof OpportunityCategorySchema>;

export const OpportunityStatusSchema = z.enum([
  "NOT_STARTED",
  "IN_PROGRESS",
  "SUBMITTED",
  "INTERVIEW",
  "ACCEPTED",
  "REJECTED",
]);

export type OpportunityStatus = z.infer<typeof OpportunityStatusSchema>;

export const OpportunityPrioritySchema = z.enum(["HIGH", "MEDIUM", "LOW"]);

export type OpportunityPriority = z.infer<typeof OpportunityPrioritySchema>;

/**
 * Essay Question Entity Schema
 */
export const EssayQuestionSchema = z.object({
  id: z.string().optional(),
  opportunityId: z.string().optional(),
  question: z.string().min(1, "Question prompt cannot be empty"),
  wordLimit: z.number().optional(),
  draftResponse: z.string().optional(),
  createdAt: z.date().optional(),
});

export type EssayQuestion = z.infer<typeof EssayQuestionSchema>;

/**
 * Core Opportunity Domain Schema
 */
export const OpportunitySchema = z.object({
  id: z.string(),
  userId: z.string(),
  title: z.string().min(1, "Title is required"),
  organization: z.string().min(1, "Organization is required"),
  category: OpportunityCategorySchema,
  shortDescription: z.string().default(""),
  fullDescription: z.string().optional(),
  eligibility: z.array(z.string()).default([]),
  requirements: z.array(z.string()).default([]),
  benefits: z.array(z.string()).default([]),
  applicationUrl: z.string().url().or(z.literal("")).default(""),
  officialUrl: z.string().url().or(z.literal("")).default(""),
  startDate: z.date().nullable().optional(),
  deadline: z.date().nullable().optional(),
  interviewDate: z.date().nullable().optional(),
  originalTimezone: z.string().default("Africa/Lagos"),
  deadlineUtc: z.date().nullable().optional(),
  deadlineLocal: z.string().nullable().optional(),
  status: OpportunityStatusSchema.default("NOT_STARTED"),
  priority: OpportunityPrioritySchema.default("MEDIUM"),
  personalNotes: z.string().default(""),
  essayQuestions: z.array(EssayQuestionSchema).default([]),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Opportunity = z.infer<typeof OpportunitySchema>;

/**
 * DTO for Creating a New Opportunity
 */
export const CreateOpportunityDtoSchema = OpportunitySchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type CreateOpportunityDto = z.infer<typeof CreateOpportunityDtoSchema>;

/**
 * DTO for Updating an Existing Opportunity
 */
export const UpdateOpportunityDtoSchema = CreateOpportunityDtoSchema.partial();

export type UpdateOpportunityDto = z.infer<typeof UpdateOpportunityDtoSchema>;

/**
 * Activity Log Domain Entity
 */
export const ActivityLogSchema = z.object({
  id: z.string(),
  userId: z.string(),
  opportunityId: z.string(),
  action: z.string(),
  description: z.string(),
  createdAt: z.date(),
});

export type ActivityLog = z.infer<typeof ActivityLogSchema>;

/**
 * Monthly Reflection Journal Entity
 */
export const MonthlyReflectionSchema = z.object({
  id: z.string(),
  userId: z.string(),
  monthYear: z.string(), // Format: "YYYY-MM" (e.g., "2026-08")
  content: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type MonthlyReflection = z.infer<typeof MonthlyReflectionSchema>;
