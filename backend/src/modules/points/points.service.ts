import { prisma } from "../../config/prisma";

export async function getMyPointsHistory(userId: string) {
  const entries = await prisma.points.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: { activity: { select: { id: true, title: true } } },
  });

  const total = entries.reduce((sum, e) => sum + e.points, 0);
  return { total, entries };
}