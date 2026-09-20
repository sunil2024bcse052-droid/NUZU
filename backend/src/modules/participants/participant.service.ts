import { prisma } from "../../config/prisma";
import { AppError } from "../../middleware/error.middleware";

export async function joinActivity(userId: string, activityId: string) {
  const activity = await prisma.activity.findUnique({
    where: { id: activityId },
    include: { _count: { select: { participants: true } } },
  });
  if (!activity) {
    throw new AppError("Activity not found", 404);
  }

  // Circle-only activities require verified membership in that circle
  if (activity.visibility === "CIRCLE_ONLY" && activity.circleId) {
    const membership = await prisma.circleMembership.findUnique({
      where: { userId_circleId: { userId, circleId: activity.circleId } },
    });
    if (!membership || membership.status !== "VERIFIED") {
      throw new AppError("You must be a verified member of this circle to join this activity", 403);
    }
  }

  // Gender-restricted activities requiring verification
  if (activity.genderRestriction === "VERIFIED_ONLY") {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || user.verifiedStatus === "UNVERIFIED") {
      throw new AppError("This activity requires a verified account to join", 403);
    }
  }

  // Capacity check
  if (activity._count.participants >= activity.capacity) {
    throw new AppError("This activity is already at full capacity", 409);
  }

  // Duplicate join check
  const existing = await prisma.participant.findUnique({
    where: { userId_activityId: { userId, activityId } },
  });
  if (existing) {
    throw new AppError("You have already joined this activity", 409);
  }

  // NOTE: joinMode REQUEST_APPROVAL currently behaves the same as INSTANT
  // until a status field is added to the Participant model. Flagged for
  // a future schema update.
  return prisma.participant.create({
    data: { userId, activityId },
  });
}

export async function leaveActivity(userId: string, activityId: string) {
  const existing = await prisma.participant.findUnique({
    where: { userId_activityId: { userId, activityId } },
  });
  if (!existing) {
    throw new AppError("You are not a participant of this activity", 404);
  }

  await prisma.participant.delete({
    where: { userId_activityId: { userId, activityId } },
  });
  return { left: true };
}

export async function listParticipants(activityId: string) {
  const activity = await prisma.activity.findUnique({ where: { id: activityId } });
  if (!activity) {
    throw new AppError("Activity not found", 404);
  }

  return prisma.participant.findMany({
    where: { activityId },
    include: { user: { select: { id: true, name: true } } },
    orderBy: { joinedAt: "asc" },
  });
}