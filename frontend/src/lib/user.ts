import { apiRequest } from "./api";

export interface Profile {
  id: string;
  name: string;
  email: string;
  role: string;
  interests: string[];
  location: { latitude: number; longitude: number } | null;
  verifiedStatus: string;
  visibilityPreference: string;
  createdAt: string;
}

export async function getMyProfile() {
  return apiRequest<{ user: Profile }>("/users/me");
}