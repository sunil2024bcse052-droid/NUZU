import { prisma } from "../../config/prisma";
import { AppError } from "../../middleware/error.middleware";

export async function listReportsForReview(status?: string) {
  return prisma.report.findMany({
    where: status ? { status: status as any } : { status: { in: ["OPEN", "UNDER_REVIEW"] } },
    include: {
      reporter: { select: { id: true, name: true, email: true } },
      reportedUser: { select: { id: true, name: true, email: true } },
      activity: { select: { id: true, title: true } },
    },
    orderBy: { createdAt: "asc" },
  });
}

export async function updateReportStatus(reportId: string, status: "UNDER_REVIEW" | "RESOLVED" | "DISMISSED") {
  const report = await prisma.report.findUnique({ where: { id: reportId } });
  if (!report) {
    throw new AppError("Report not found", 404);
  }
  return prisma.report.update({ where: { id: reportId }, data: { status } });
}

// Section 15.5 escalation ladder: warning -> temporary suspension -> permanent ban
export async function applyRestriction(
  adminId: string,
  targetUserId: string,
  restrictionType: "ACTIVITY_CREATION_BLOCKED" | "TEMPORARY_SUSPENSION" | "PERMANENT_BAN",
  reason: string
) {
  const targetUser = await prisma.user.findUnique({ where: { id: targetUserId } });
  if (!targetUser) {
    throw new AppError("Target user not found", 404);
  }

  return prisma.restriction.create({
    data: {
      userId: targetUserId,
      restrictionType,
      reason,
      reviewerAdminId: adminId,
      reviewedAt: new Date(),
    },
  });
}

export async function listUserRestrictions(userId: string) {
  return prisma.restriction.findMany({
    where: { userId },
    orderBy: { appliedAt: "desc" },
  });
}