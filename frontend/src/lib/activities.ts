import { apiRequest } from "./api";

export interface Activity {
  id: string;
  title: string;
  category: string;
  latitude: number;
  longitude: number;
  date: string;
  capacity: number;
  distance_km?: number;
  _count?: { participants: number };
}

export async function getNearbyActivities(latitude: number, longitude: number, radiusKm = 5) {
  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    radiusKm: String(radiusKm),
  });
  return apiRequest<{ activities: Activity[] }>(`/activities/nearby?${params}`);
}

export async function joinActivity(activityId: string) {
  return apiRequest(`/activities/${activityId}/join`, { method: "POST" });
}

export interface CreateActivityInput {
  title: string;
  description: string;
  category: string;
  latitude: number;
  longitude: number;
  date: string;
  capacity: number;
}

export async function createActivity(input: CreateActivityInput) {
  return apiRequest<{ activity: Activity }>("/activities", {
    method: "POST",
    body: input,
  });
}