import { apiRequest } from "./api";

export interface Activity {
  id: string;
  title: string;
  description?: string;
  category: string;
  latitude: number;
  longitude: number;
  date: string;
  durationMinutes: number;
  capacity: number;
  distance_km?: number;
  creatorId?: string;
  creator?: { id: string; name: string };
  _count?: { participants: number };
}

export interface Participant {
  id: string;
  userId: string;
  joinedAt: string;
  user: { id: string; name: string };
}

export async function getNearbyActivities(latitude: number, longitude: number, radiusKm = 5) {
  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    radiusKm: String(radiusKm),
  });
  return apiRequest<{ activities: Activity[] }>(`/activities/nearby?${params}`);
}

export async function getActivity(id: string) {
  return apiRequest<{ activity: Activity }>(`/activities/${id}`);
}

export async function getParticipants(activityId: string) {
  return apiRequest<{ participants: Participant[] }>(`/activities/${activityId}/participants`);
}

export async function joinActivity(activityId: string) {
  return apiRequest(`/activities/${activityId}/join`, { method: "POST" });
}

export async function leaveActivity(activityId: string) {
  return apiRequest(`/activities/${activityId}/leave`, { method: "DELETE" });
}

export interface CreateActivityInput {
  title: string;
  description: string;
  category: string;
  latitude: number;
  longitude: number;
  date: string;
  durationMinutes: number;
  capacity: number;
}

export async function createActivity(input: CreateActivityInput) {
  return apiRequest<{ activity: Activity }>("/activities", {
    method: "POST",
    body: input,
  });
}

export interface QrResponse {
  token: string;
  qrImageDataUrl: string;
  expiresInMinutes: number;
}

export async function generateQr(activityId: string) {
  return apiRequest<QrResponse>(`/activities/${activityId}/qr`, { method: "POST" });
}

export async function scanQr(activityId: string, token: string) {
  return apiRequest<{ attendance: unknown; pointsAwarded: number }>(`/activities/${activityId}/scan`, {
    method: "POST",
    body: { token },
  });
}

// Helper: format a start time + duration into a readable window, e.g. "5:00 PM - 6:00 PM"
export function formatTimeWindow(isoDate: string, durationMinutes: number) {
  const start = new Date(isoDate);
  const end = new Date(start.getTime() + durationMinutes * 60000);
  const startLabel = start.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
  const endLabel = end.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
  return `${startLabel} - ${endLabel}`;
}

export function formatDuration(minutes: number) {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins === 0 ? `${hours} hr${hours > 1 ? "s" : ""}` : `${hours}h ${mins}m`;
}