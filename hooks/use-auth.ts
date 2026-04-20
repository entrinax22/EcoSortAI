import { router } from "expo-router";
import { useEffect, useState } from "react";

import { getMe } from "@/services/auth";
import { StoredUser, clearSession, getUser, hasSession } from "@/services/session";

export type AuthState = {
  user: StoredUser | null;
  loading: boolean;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
};

export function useAuth(): AuthState {
  const [user, setUser] = useState<StoredUser | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchFresh = async () => {
    const { user: fresh } = await getMe();
    if (fresh) setUser(fresh);
  };

  useEffect(() => {
    async function init() {
      const authenticated = await hasSession();
      if (!authenticated) {
        router.replace("/login");
        return;
      }

      // Show cached user immediately so the UI isn't blank
      const cached = await getUser();
      setUser(cached);
      setLoading(false);

      // Then silently refresh from the server
      fetchFresh();
    }
    init();
  }, []);

  const logout = async () => {
    await clearSession();
    router.replace("/login");
  };

  return { user, loading, logout, refresh: fetchFresh };
}
