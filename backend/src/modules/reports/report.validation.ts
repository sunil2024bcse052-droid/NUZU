import { z } from "zod";

export const createReportSchema = z.object({
  reportedUserId: z.string().uuid().optional(),
  activityId: z.string().uuid().optional(),
  category: z.enum([
    "HARASSMENT",
    "UNSAFE_BEHAVIOR",
    "FAKE_PROFILE",
    "INAPPROPRIATE_CONTENT",
    "NO_SHOW",
    "OTHER",
  ]),
  reason: z.string().trim().min(10).max(1000),
});

export type CreateReportInput = z.infer<typeof createReportSchema>;

// A report needs to point at either a user or an activity (or both), not neither.
export function validateReportTarget(input: CreateReportInput) {
  if (!input.reportedUserId && !input.activityId) {
    throw new Error("A report must reference a user, an activity, or both");
  }
}