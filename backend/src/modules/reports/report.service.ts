import { prisma } from "../../config/prisma";
import { AppError } from "../../middleware/error.middleware";
import { CreateReportInput } from "./report.validation";

// Section 15.5 - after this many OPEN/UNDER_REVIEW reports against the same
// user, automatically restrict them from creating new activities pending review.
const AUTO_RESTRICTION_THRESHOLD = 3;

export async function fileReport(reporterId: string, input: CreateReportInput) {
  if (!input.reportedUserId && !input.activityId) {
    throw new AppError("A report must reference a user, an activity, or both", 422);
  }

  const report = await prisma.report.create({
    data: {
      reporterId,
      reportedUserId: input.reportedUserId,
      activityId: input.activityId,
      category: input.category,
      reason: input.reason,
    },
  });

  if (input.reportedUserId) {
    await maybeAutoRestrict(input.reportedUserId);
  }

  return report;
}

async function maybeAutoRestrict(userId: string) {
  const activeReportCount = await prisma.report.count({
    where: {
      reportedUserId: userId,
      status: { in: ["OPEN", "UNDER_REVIEW"] },
    },
  });

  if (activeReportCount < AUTO_RESTRICTION_THRESHOLD) {
    return;
  }

  const existingRestriction = await prisma.restriction.findFirst({
    where: {
      userId,
      restrictionType: "ACTIVITY_CREATION_BLOCKED",
      reviewedAt: null,
    },
  });
  if (existingRestriction) {
    return;
  }

  await prisma.restriction.create({
    data: {
      userId,
      restrictionType: "ACTIVITY_CREATION_BLOCKED",
      reason: `Automatically applied after ${activeReportCount} active reports`,
    },
  });
}

export async function listMyReports(reporterId: string) {
  return prisma.report.findMany({
    where: { reporterId },
    orderBy: { createdAt: "desc" },
  });
}