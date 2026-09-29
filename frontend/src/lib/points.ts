import { apiRequest } from "./api";

export interface PointsEntry {
  id: string;
  points: number;
  reason: string;
  createdAt: string;
  activity: { id: string; title: string } | null;
}

export async function getMyPointsHistory() {
  return apiRequest<{ total: number; entries: PointsEntry[] }>("/points/mine");
}