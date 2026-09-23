import { apiRequest, setToken } from "./api";

export interface User {
  id: string;
  name: string;
  email: string;
  role: "USER" | "ADMIN";
  verifiedStatus: string;
  createdAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export async function registerUser(input: {
  name: string;
  email: string;
  password: string;
  birthDate: string;
}) {
  const result = await apiRequest<AuthResponse>("/auth/register", {
    method: "POST",
    body: input,
    auth: false,
  });
  setToken(result.token);
  return result;
}

export async function loginUser(input: { email: string; password: string }) {
  const result = await apiRequest<AuthResponse>("/auth/login", {
    method: "POST",
    body: input,
    auth: false,
  });
  setToken(result.token);
  return result;
}

export async function getMe() {
  return apiRequest<{ user: User }>("/auth/me");
}