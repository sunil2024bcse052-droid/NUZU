import { prisma } from "../../config/prisma";
import { AppError } from "../../middleware/error.middleware";
import { CreateCircleInput, ListCirclesQuery } from "./circle.validation";

export async function createCircle(userId: string, input: CreateCircleInput) {
  const circle = await prisma.circle.create({
    data: {
      name: input.name,
      type: input.type,
      address: input.address,
      pincode: input.pincode,
      memberships: {
        create: {
          userId,
          status: "VERIFIED",
          isModerator: true,
        },
      },
    },
    include: { memberships: true },
  });
  return circle;
}

export async function listCircles(query: ListCirclesQuery) {
  return prisma.circle.findMany({
    where: {
      ...(query.type && { type: query.type }),
      ...(query.search && {
        name: { contains: query.search, mode: "insensitive" },
      }),
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  });
}

export async function getCircleById(circleId: string) {
  const circle = await prisma.circle.findUnique({ where: { id: circleId } });
  if (!circle) {
    throw new AppError("Circle not found", 404);
  }
  return circle;
}

export async function joinCircle(userId: string, circleId: string) {
  await getCircleById(circleId);

  const existing = await prisma.circleMembership.findUnique({
    where: { userId_circleId: { userId, circleId } },
  });
  if (existing) {
    throw new AppError("You have already requested or joined this circle", 409);
  }

  return prisma.circleMembership.create({
    data: { userId, circleId, status: "PENDING" },
  });
}

async function assertIsModerator(userId: string, circleId: string) {
  const membership = await prisma.circleMembership.findUnique({
    where: { userId_circleId: { userId, circleId } },
  });
  if (!membership || !membership.isModerator) {
    throw new AppError("Only a circle moderator can perform this action", 403);
  }
}

export async function listMembers(requesterId: string, circleId: string) {
  await assertIsModerator(requesterId, circleId);
  return prisma.circleMembership.findMany({
    where: { circleId },
    include: { user: { select: { id: true, name: true, email: true } } },
    orderBy: { joinedAt: "asc" },
  });
}

export async function approveMembership(moderatorId: string, circleId: string, targetUserId: string) {
  await assertIsModerator(moderatorId, circleId);

  const membership = await prisma.circleMembership.findUnique({
    where: { userId_circleId: { userId: targetUserId, circleId } },
  });
  if (!membership) {
    throw new AppError("Membership request not found", 404);
  }

  return prisma.circleMembership.update({
    where: { userId_circleId: { userId: targetUserId, circleId } },
    data: { status: "VERIFIED" },
  });
}