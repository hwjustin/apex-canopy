import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  clearAuth,
  getStoredToken,
  getStoredUser,
  storeAuth,
  type CanopyUser,
} from "@/lib/auth";
import * as api from "@/lib/api";

type AuthState = {
  user: CanopyUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  refresh: () => Promise<void>;
};

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<CanopyUser | null>(() => getStoredUser());
  const [loading, setLoading] = useState(() => Boolean(getStoredToken()));

  const refresh = async () => {
    const token = getStoredToken();
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const res = await api.me();
      setUser(res.user);
      window.localStorage.setItem("canopy_user", JSON.stringify(res.user));
    } catch {
      clearAuth();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = useMemo<AuthState>(
    () => ({
      user,
      loading,
      refresh,
      async login(email, password) {
        const res = await api.login(email, password);
        storeAuth(res.token, res.user);
        setUser(res.user);
      },
      async register(email, password, name) {
        const res = await api.register(email, password, name);
        storeAuth(res.token, res.user);
        setUser(res.user);
      },
      logout() {
        clearAuth();
        setUser(null);
      },
    }),
    [user, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
