import { getStoredToken } from "./auth";

const API_BASE = import.meta.env.VITE_RAILWAY_API_URL || "";

export const buildUrl = (path: string, params?: Record<string, string | undefined>) => {
  const fallback =
    typeof window !== "undefined" ? window.location.origin : "http://localhost:5173";
  const url = new URL(path, API_BASE || fallback);
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value != null && value !== "") url.searchParams.set(key, value);
    }
  }
  return url;
};

export const apiFetch = async <T>(
  path: string,
  init: RequestInit & { params?: Record<string, string | undefined>; auth?: boolean } = {},
): Promise<T> => {
  const { params, auth = false, headers, ...rest } = init;
  const finalHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    ...(headers as Record<string, string> | undefined),
  };
  if (auth) {
    const token = getStoredToken();
    if (token) finalHeaders.authorization = `Bearer ${token}`;
  }
  const res = await fetch(buildUrl(path, params), { ...rest, headers: finalHeaders });
  if (!res.ok) {
    let message = "Request failed";
    try {
      const data = await res.json();
      message = data?.error || message;
    } catch {
      /* ignore */
    }
    throw new Error(message);
  }
  return (await res.json()) as T;
};

// ─── types ───────────────────────────────────────────────────────
export type Stage = "idea" | "building" | "beta" | "launched" | "growing";
export type Region =
  | "north_america"
  | "south_america"
  | "europe"
  | "africa"
  | "middle_east"
  | "asia"
  | "oceania"
  | "other";
export type ProjectType =
  | "agent_apps" | "ai_copilots" | "ai_workflow" | "ai_infra" | "dev_tools"
  | "apis_platform" | "saas_productivity" | "data_analytics" | "security_privacy"
  | "enterprise_software" | "fintech" | "payments" | "commerce" | "sales_crm"
  | "marketing_growth" | "customer_support" | "hr_recruiting" | "education"
  | "health_wellness" | "media_creator" | "consumer_social" | "community_tools"
  | "marketplaces" | "logistics_ops" | "legal_compliance" | "real_estate"
  | "climate_energy" | "robotics_hardware" | "web3_crypto" | "defi" | "gaming";

export type CanopyProject = {
  id: number;
  userId: number;
  name: string;
  tagline: string;
  description: string | null;
  city: string | null;
  region: Region | null;
  projectType: ProjectType | null;
  teamIntro: string | null;
  stage: Stage | null;
  lookingFor: string | null;
  logoUrl: string | null;
  website: string | null;
  twitter: string | null;
  linkedin: string | null;
  emailContact: string | null;
  tags: string[];
  createdAt: string | null;
  updatedAt: string | null;
  reactionCount?: number;
};

export type CanopyComment = {
  id: number;
  body: string;
  createdAt: string | null;
  userId: number;
  userName: string | null;
};

export type ProjectDetailResponse = {
  project: CanopyProject;
  author: { id: number; email: string; name: string; createdAt: string | null } | null;
  reactions: Record<string, number>;
  myReactions: string[];
  comments: CanopyComment[];
};

export type ProjectInput = Partial<
  Pick<
    CanopyProject,
    | "name"
    | "tagline"
    | "description"
    | "city"
    | "region"
    | "projectType"
    | "teamIntro"
    | "stage"
    | "lookingFor"
    | "logoUrl"
    | "website"
    | "twitter"
    | "linkedin"
    | "emailContact"
  >
> & { tags?: string[] };

// ─── helpers ─────────────────────────────────────────────────────
export const listProjects = (filters: {
  search?: string;
  city?: string;
  region?: string;
  projectType?: string;
  stage?: string;
  tag?: string;
  lookingFor?: string;
  sort?: string;
}) => apiFetch<{ projects: CanopyProject[] }>("/api/canopy/projects", { params: filters });

export const getProject = (id: number) =>
  apiFetch<ProjectDetailResponse>(`/api/canopy/projects/${id}`, { auth: true });

export const createProject = (body: ProjectInput) =>
  apiFetch<{ project: CanopyProject }>("/api/canopy/projects", {
    method: "POST",
    body: JSON.stringify(body),
    auth: true,
  });

export const updateProject = (id: number, body: ProjectInput) =>
  apiFetch<{ project: CanopyProject }>(`/api/canopy/projects/${id}`, {
    method: "PATCH",
    body: JSON.stringify(body),
    auth: true,
  });

export const deleteProject = (id: number) =>
  apiFetch<{ ok: true }>(`/api/canopy/projects/${id}`, { method: "DELETE", auth: true });

export const listMyProjects = () =>
  apiFetch<{ projects: CanopyProject[] }>("/api/canopy/me/projects", { auth: true });

export const toggleReaction = (projectId: number, kind: string) =>
  apiFetch<{ active: boolean }>(`/api/canopy/projects/${projectId}/reactions`, {
    method: "POST",
    body: JSON.stringify({ kind }),
    auth: true,
  });

export const postComment = (projectId: number, body: string) =>
  apiFetch<{ comment: CanopyComment }>(`/api/canopy/projects/${projectId}/comments`, {
    method: "POST",
    body: JSON.stringify({ body }),
    auth: true,
  });

export const deleteComment = (id: number) =>
  apiFetch<{ ok: true }>(`/api/canopy/comments/${id}`, { method: "DELETE", auth: true });

export const getCities = () => apiFetch<{ cities: string[] }>("/api/canopy/meta/cities");
export const getTags = () =>
  apiFetch<{ tags: { tag: string; count: number }[] }>("/api/canopy/meta/tags");

export const register = (email: string, password: string, name: string) =>
  apiFetch<{ user: import("./auth").CanopyUser; token: string }>(
    "/api/canopy/auth/register",
    { method: "POST", body: JSON.stringify({ email, password, name }) },
  );

export const login = (email: string, password: string) =>
  apiFetch<{ user: import("./auth").CanopyUser; token: string }>(
    "/api/canopy/auth/login",
    { method: "POST", body: JSON.stringify({ email, password }) },
  );

export const me = () =>
  apiFetch<{ user: import("./auth").CanopyUser }>("/api/canopy/auth/me", { auth: true });
