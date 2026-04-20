import { apiFetch, BASE_URL } from "./api";
import { saveSession, saveUser, StoredUser } from "./session";

// ── Cookie helpers ────────────────────────────────────────────────────────────

/**
 * Extracts a named cookie value from a raw Set-Cookie header string.
 * React Native joins multiple Set-Cookie values with ", " in one header.
 */
function extractCookie(setCookieHeader: string, name: string): string | null {
  // Each directive is separated by "; ", individual cookies by ", "
  // Split on ", " but only where a new cookie name starts (has "=")
  const cookies = setCookieHeader.split(/,(?=\s*[a-zA-Z_-]+=)/);
  for (const cookie of cookies) {
    const match = cookie.trim().match(new RegExp(`^${name}=([^;]+)`));
    if (match) return match[1];
  }
  return null;
}

// ── Payload / response types ──────────────────────────────────────────────────

export type LoginPayload = {
  email: string; // mapped to Django's "username" field
  password: string;
};

export type RegisterPayload = {
  name: string;
  email: string;
  password: string;
};

export type AuthResult = {
  user: StoredUser | null;
  error: string | null;
};

// ── Auth API calls ────────────────────────────────────────────────────────────

/**
 * Step 1: GET /login/ to obtain the csrftoken cookie before posting.
 * Django sets csrftoken on the GET response — we must send it back in the POST.
 */
async function fetchCsrfToken(): Promise<string | null> {
  try {
    const response = await fetch(`${BASE_URL}/login/`, { method: "GET" });
    const setCookie = response.headers.get("set-cookie") ?? "";
    return extractCookie(setCookie, "csrftoken");
  } catch {
    return null;
  }
}

/**
 * POST /login/
 * Two-step CSRF flow required by Django:
 *   1. GET /login/ → obtain csrftoken from Set-Cookie
 *   2. POST /login/ → send csrftoken as Cookie header + csrfmiddlewaretoken in body
 * Saves sessionid + csrftoken to AsyncStorage on success.
 */
export async function login(payload: LoginPayload): Promise<AuthResult> {
  try {
    // Step 1 — get the CSRF token
    const csrfToken = await fetchCsrfToken();
    if (!csrfToken) {
      return {
        user: null,
        error: "Could not reach the server. Please try again.",
      };
    }

    // Step 2 — POST with CSRF token in both Cookie header and form body
    const body = new URLSearchParams({
      username: payload.email,
      password: payload.password,
      csrfmiddlewaretoken: csrfToken,
    }).toString();

    const response = await fetch(`${BASE_URL}/login/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Cookie: `csrftoken=${csrfToken}`,
        Referer: BASE_URL,
      },
      body,
    });

    if (!response.ok) {
      const contentType = response.headers.get("content-type") ?? "";
      const json = contentType.includes("application/json")
        ? await response.json()
        : null;
      return {
        user: null,
        error: json?.detail ?? json?.message ?? "Invalid credentials.",
      };
    }

    // sessionid is set by Django on the 302 redirect response. React Native follows
    // the redirect and stores sessionid in the native cookie jar automatically —
    // we cannot read it from JS, but it will be sent on every subsequent request.
    // We only need to extract csrftoken from the final response Set-Cookie.
    const setCookie = response.headers.get("set-cookie") ?? "";
    const finalCsrf = extractCookie(setCookie, "csrftoken") ?? csrfToken;

    // Django login returns HTML — no user JSON here.
    // Save the session first so the cookie jar + CSRF are ready,
    // then immediately call /api/auth/me/ to get the full user object.
    await saveSession(finalCsrf);

    const meResult = await getMe();
    return { user: meResult.user, error: null };
  } catch {
    return {
      user: null,
      error: "Network error. Please check your connection.",
    };
  }
}

/**
 * POST /api/auth/register/
 * Endpoint to be confirmed by backend — using JSON for now.
 * Update Content-Type to form-encoded if backend requires it.
 */
export async function register(payload: RegisterPayload): Promise<AuthResult> {
  const { data, error } = await apiFetch<{
    user: StoredUser;
    csrftoken: string;
  }>(
    "/api/auth/register/",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    },
    false,
  );

  if (error || !data)
    return { user: null, error: error ?? "Unexpected error." };

  await saveSession(data.csrftoken, data.user);
  return { user: data.user, error: null };
}

/**
 * GET /api/auth/me/
 * Fetches the currently authenticated user's profile from the server.
 * Also persists the fresh data to AsyncStorage so it survives restarts.
 */
export async function getMe(): Promise<AuthResult> {
  const { data, error } = await apiFetch<StoredUser | { user: StoredUser }>(
    "/api/auth/me/",
  );
  if (error || !data)
    return { user: null, error: error ?? "Unexpected error." };

  // Handle both { user: {...} } wrapper and a bare user object
  const user: StoredUser =
    "user" in data && data.user
      ? (data as { user: StoredUser }).user
      : (data as StoredUser);

  // console.log("Fetched user profile:", user);

  await saveUser(user);
  return { user, error: null };
}
