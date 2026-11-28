"use client";
// Queries and changes for the account screens (S04-01 to S04-06, S00-36).

import { useQuery } from "@tanstack/react-query";
import { api } from "@/shared/api/apiClient";
import { useApiMutation } from "@/shared/api/useApiMutation";

/** An account as the admin screens show it. */
export interface Account {
  id: string;
  name: string;
  email: string;
  /** Google and Apple verify it; email sign-ups verify by the link. Needed for the staff match. */
  emailVerified: boolean;
  phoneNumber: string | null;
  status: "active" | "pending" | "locked" | "suspended";
  kind: "staff" | "client";
  twoFactorEnabled: boolean;
  createdAt: string;
  providers: string[];
}

/** A signed-in device. */
export interface Session {
  id: string;
  createdAt: string;
  expiresAt: string;
  ipAddress: string | null;
  userAgent: string | null;
  current?: boolean;
}

/** One login method's switch, for S04-06. */
export interface MethodSetting {
  method: string;
  label: string;
  platform: string;
  enabled: boolean;
  allowedRoleKeys: string[] | null;
  sortOrder: number;
}

export const useAccounts = (q: string, status: string) =>
  useQuery({
    queryKey: ["accounts", q, status],
    queryFn: () => api<{ items: Account[]; total: number }>(`/api/users?limit=50&q=${encodeURIComponent(q)}${status ? `&status=${status}` : ""}`),
  });

export const useAccount = (id: string) => useQuery({ queryKey: ["accounts", id], queryFn: () => api<Account>(`/api/users/${id}`), enabled: !!id });

export const useAccountSessions = (id: string) => useQuery({ queryKey: ["accounts", id, "sessions"], queryFn: () => api<{ items: Session[] }>(`/api/users/${id}/sessions`), enabled: !!id });

export const useMySessions = () => useQuery({ queryKey: ["my-sessions"], queryFn: () => api<{ items: Session[] }>("/api/users/me/sessions") });

export const useSetStatus = (id: string) =>
  useApiMutation((status: Account["status"]) => api(`/api/users/${id}/status`, { method: "PATCH", body: { status } }), { done: "Account updated", refresh: [["accounts"]] });

/** Deletes a guest account (super admin only). The server refuses staff and the admin's own account. */
export const useDeleteAccount = (id: string) =>
  useApiMutation(() => api(`/api/users/${id}`, { method: "DELETE" }), { done: "Guest account deleted", refresh: [["accounts"]] });

export const useSignOutAccount = (id: string) =>
  useApiMutation(() => api(`/api/users/${id}/sessions`, { method: "DELETE" }), { done: "Signed out everywhere", refresh: [["accounts", id, "sessions"]] });

export const useRevokeMySession = () =>
  useApiMutation((sessionId: string) => api(`/api/users/me/sessions/${sessionId}`, { method: "DELETE" }), { done: "Device signed out", refresh: [["my-sessions"]] });

export const useCreateAccount = () =>
  useApiMutation((body: { name: string; email: string; password?: string }) => api<{ id: string }>("/api/users", { method: "POST", body }), { done: "Account created", refresh: [["accounts"]] });

export const useMethodSettings = () => useQuery({ queryKey: ["login-methods-admin"], queryFn: () => api<{ methods: MethodSetting[]; policy: Record<string, unknown> }>("/api/login-methods/admin") });

export const useUpdateMethod = () =>
  useApiMutation(({ method, ...body }: { method: string; enabled?: boolean; allowedRoleKeys?: string[] | null }) => api(`/api/login-methods/${method}`, { method: "PATCH", body }), {
    done: "Login method saved",
    refresh: [["login-methods-admin"], ["login-methods"]],
  });

export const useUpdatePolicy = () =>
  useApiMutation((body: Record<string, unknown>) => api("/api/login-methods/policy", { method: "PATCH", body }), { done: "Login rules saved", refresh: [["login-methods-admin"]] });
