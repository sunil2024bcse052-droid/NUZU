import { z } from "zod";

export const updateReportStatusSchema = z.object({
  status: z.enum(["UNDER_REVIEW", "RESOLVED", "DISMISSED"]),
});

export const applyRestrictionSchema = z.object({
  userId: z.string().uuid(),
  restrictionType: z.enum(["ACTIVITY_CREATION_BLOCKED", "TEMPORARY_SUSPENSION", "PERMANENT_BAN"]),
  reason: z.string().trim().min(5).max(500),
});