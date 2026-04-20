import AsyncStorage from "@react-native-async-storage/async-storage";

const CSRF_TOKEN_KEY = "csrf_token";
const AUTH_FLAG_KEY = "is_authenticated";
const USER_KEY = "auth_user";

export type StoredUser = {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  household_id: string;
  street: string;
  barangay: string;
  role: "admin" | "collector" | "user";
  role_value: "ADMIN" | "COLLECTOR" | "USER";
  role_label: string;
  is_active: boolean;
};

export async function saveSession(
  csrfToken: string,
  user?: StoredUser,
): Promise<void> {
  const pairs: [string, string][] = [
    [CSRF_TOKEN_KEY, csrfToken],
    [AUTH_FLAG_KEY, "true"],
  ];
  if (user) pairs.push([USER_KEY, JSON.stringify(user)]);
  await AsyncStorage.multiSet(pairs);
  console.log("Session saved:", { csrfToken, user });
}

export async function saveUser(user: StoredUser): Promise<void> {
  await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
}

export async function getCsrfToken(): Promise<string | null> {
  return AsyncStorage.getItem(CSRF_TOKEN_KEY);
}

export async function getUser(): Promise<StoredUser | null> {
  const raw = await AsyncStorage.getItem(USER_KEY);
  return raw ? (JSON.parse(raw) as StoredUser) : null;
}

export async function clearSession(): Promise<void> {
  await AsyncStorage.multiRemove([CSRF_TOKEN_KEY, AUTH_FLAG_KEY, USER_KEY]);
}

export async function hasSession(): Promise<boolean> {
  const flag = await AsyncStorage.getItem(AUTH_FLAG_KEY);
  return flag === "true";
}
