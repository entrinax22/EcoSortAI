import { getCsrfToken } from "./session";

// Switch to LOCAL for development: "http://127.0.0.1:8000"
export const BASE_URL = "https://dev.nielcarloasgar.online";

export type ApiResponse<T> = {
  data: T | null;
  error: string | null;
};

const MUTATING_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"]);

/**
 * Wrapper around fetch for API calls.
 * - Does NOT inject Cookie headers — React Native's native HTTP layer automatically
 *   sends the sessionid cookie from its native jar on every request.
 * - Only injects X-CSRFToken for mutating requests (POST/PUT/PATCH/DELETE).
 */
export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {},
  authenticated = true,
): Promise<ApiResponse<T>> {
  try {
    const method = (options.method ?? "GET").toUpperCase();
    const headers: Record<string, string> = {
      ...(options.headers as Record<string, string>),
    };

    if (authenticated && MUTATING_METHODS.has(method)) {
      const csrf = await getCsrfToken();
      if (csrf) headers["X-CSRFToken"] = csrf;
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const contentType = response.headers.get("content-type") ?? "";
    const json = contentType.includes("application/json")
      ? await response.json()
      : null;

    if (!response.ok) {
      const message =
        json?.detail ?? json?.message ?? `Error ${response.status}`;
      console.log("API error:", {
        endpoint,
        method,
        status: response.status,
        message,
      });
      return { data: null, error: message };
    }

    return { data: json as T, error: null };
  } catch {
    return {
      data: null,
      error: "Network error. Please check your connection.",
    };
  }
}
