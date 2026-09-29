import { apiRequest } from "./api";

export type CircleType = "SOCIETY" | "COLLEGE" | "UNIVERSITY" | "WORKPLACE";
export type MembershipStatus = "PENDING" | "VERIFIED";

export interface Circle {
  id: string;
  name: string;
  type: CircleType;
  address?: string | null;
  pincode?: string | null;
  createdAt: string;
}

export interface Membership {
  id: string;
  userId: string;
  circleId: string;
  status: MembershipStatus;
  isModerator: boolean;
  joinedAt: string;
  circle: Circle;
}

export interface MemberEntry {
  id: string;
  userId: string;
  circleId: string;
  status: MembershipStatus;
  isModerator: boolean;
  joinedAt: string;
  user: { id: string; name: string; email: string };
}

export const CIRCLE_TYPE_LABELS: Record<CircleType, string> = {
  SOCIETY: "Society / Building",
  COLLEGE: "College",
  UNIVERSITY: "University",
  WORKPLACE: "Workplace",
};

export async function listCircles(params: { type?: CircleType; search?: string } = {}) {
  const query = new URLSearchParams();
  if (params.type) query.set("type", params.type);
  if (params.search) query.set("search", params.search);
  const qs = query.toString();
  return apiRequest<{ circles: Circle[] }>(`/circles${qs ? `?${qs}` : ""}`);
}

export async function createCircle(input: {
  name: string;
  type: CircleType;
  address?: string;
  pincode?: string;
}) {
  return apiRequest<{ circle: Circle }>("/circles", { method: "POST", body: input });
}

export async function joinCircle(circleId: string) {
  return apiRequest(`/circles/${circleId}/join`, { method: "POST" });
}

export async function getMyMemberships() {
  return apiRequest<{ memberships: Membership[] }>("/circles/mine");
}

export async function getCircleMembers(circleId: string) {
  return apiRequest<{ members: MemberEntry[] }>(`/circles/${circleId}/members`);
}

export async function approveMember(circleId: string, userId: string) {
  return apiRequest(`/circles/${circleId}/members/${userId}`, { method: "PATCH" });
}