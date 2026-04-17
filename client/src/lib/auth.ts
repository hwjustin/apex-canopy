const TOKEN_KEY = "canopy_token";
const USER_KEY = "canopy_user";

export type CanopyUser = {
  id: number;
  email: string;
  name: string;
  createdAt: string | null;
};

export const getStoredToken = () =>
  typeof window === "undefined" ? null : window.localStorage.getItem(TOKEN_KEY);

export const getStoredUser = (): CanopyUser | null => {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as CanopyUser;
  } catch {
    return null;
  }
};

export const storeAuth = (token: string, user: CanopyUser) => {
  window.localStorage.setItem(TOKEN_KEY, token);
  window.localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const clearAuth = () => {
  window.localStorage.removeItem(TOKEN_KEY);
  window.localStorage.removeItem(USER_KEY);
};
