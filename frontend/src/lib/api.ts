const API_BASE_URL = "http://localhost:4000/api";

function getToken(): string | null {
  return localStorage.getItem("nuzu_token");
}

export function setToken(token: string) {
  localStorage.setItem("nuzu_token", token);
}

export function clearToken() {
  localStorage.removeItem("nuzu_token");
}

interface ApiOptions {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  body?: unknown;
  auth?: boolean;
}

interface ValidationDetail {
  path: string;
  message: string;
}

export async function apiRequest<T>(path: string, options: ApiOptions = {}): Promise<T> {
  const { method = "GET", body, auth = true } = options;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (auth) {
    const token = getToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await response.json();

  if (!response.ok) {
    if (data.details && Array.isArray(data.details)) {
      const messages = (data.details as ValidationDetail[]).map((d) => d.message).join(", ");
      throw new Error(messages || data.error || "Something went wrong");
    }
    throw new Error(data.error || "Something went wrong");
  }

  return data as T;
}