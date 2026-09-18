import { Prisma } from "@prisma/client";
import { prisma } from "../../config/prisma";
import { AppError } from "../../middleware/error.middleware";
import { CreateActivityInput, NearbyQuery } from "./activity.validation";

interface NearbyActivityRow {
  id: string;
  title: string;
  category: string;
  latitude: number;
  longitude: number;
  date: Date;
  capacity: number;
  distance_km: number;
}

export async function createActivity(userId: string, input: CreateActivityInput) {
  if (input.visibility === "CIRCLE_ONLY" && !input.circleId) {
    throw new AppError("circleId is required when visibility is CIRCLE_ONLY", 422);
  }

  if (input.circleId) {
    const membership = await prisma.circleMembership.findUnique({
      where: { userId_circleId: { userId, circleId: input.circleId } },
    });
    if (!membership || membership.status !== "VERIFIED") {
      throw new AppError("You must be a verified member of this circle to post here", 403);
    }
  }

  return prisma.activity.create({
    data: {
      title: input.title,
      description: input.description,
      category: input.category,
      latitude: input.latitude,
      longitude: input.longitude,
      date: new Date(input.date),
      capacity: input.capacity,
      visibility: input.visibility,
      genderRestriction: input.genderRestriction,
      joinMode: input.joinMode,
      isSmallGroup: input.isSmallGroup,
      creatorId: userId,
      circleId: input.circleId,
    },
  });
}

export async function getActivityById(activityId: string) {
  const activity = await prisma.activity.findUnique({
    where: { id: activityId },
    include: {
      creator: { select: { id: true, name: true } },
      _count: { select: { participants: true } },
    },
  });
  if (!activity) {
    throw new AppError("Activity not found", 404);
  }
  return activity;
}

export async function findNearbyActivities(query: NearbyQuery) {
  const { latitude, longitude, radiusKm, category } = query;

  const categoryFilter = category
    ? Prisma.sql`AND category = ${category}`
    : Prisma.empty;

  const sql = Prisma.sql`
    SELECT id, title, category, latitude, longitude, date, capacity,
      (
        6371 * acos(
          cos(radians(${latitude})) * cos(radians(latitude)) *
          cos(radians(longitude) - radians(${longitude})) +
          sin(radians(${latitude})) * sin(radians(latitude))
        )
      ) AS distance_km
    FROM "Activity"
    WHERE visibility = 'OPEN_NEARBY'
      AND date >= NOW()
      ${categoryFilter}
    ORDER BY distance_km ASC
    LIMIT 50
  `;

  const rows = (await prisma.$queryRaw(sql)) as NearbyActivityRow[];

  return rows.filter((row) => row.distance_km <= radiusKm);
}

export async function listActivities(filters: { category?: string; circleId?: string }) {
  return prisma.activity.findMany({
    where: {
      ...(filters.category && { category: filters.category }),
      ...(filters.circleId && { circleId: filters.circleId }),
      date: { gte: new Date() },
    },
    orderBy: { date: "asc" },
    take: 50,
    include: { _count: { select: { participants: true } } },
  });
}