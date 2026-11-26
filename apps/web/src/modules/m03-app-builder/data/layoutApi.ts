"use client";
// Queries and changes for the App Layout pages (S03-01 to S03-09). A publish
// also refreshes the signed-in person's own layout, so the sidebar follows.

import { useQuery } from "@tanstack/react-query";
import { api } from "@/shared/api/apiClient";
import { useApiMutation } from "@/shared/api/useApiMutation";
import { MY_LAYOUT_KEY } from "@/shared/session/useMyLayout";
import type { LayoutSettings } from "../domain/layoutSettings";
import type { LayoutVersion } from "../domain/layoutVersion";
import type { RoleChoice } from "../domain/roleChoice";
import type { RoleLayout } from "../domain/roleLayout";

const KEY = "layout";
const refresh = [[KEY], MY_LAYOUT_KEY];

export const useRoleChoices = () => useQuery({ queryKey: [KEY, "roles"], queryFn: () => api<{ items: RoleChoice[] }>("/api/access/roles") });

export const useRoleLayout = (roleId: string) =>
  useQuery({ queryKey: [KEY, "role", roleId], queryFn: () => api<RoleLayout>(`/api/layout/roles/${roleId}`), enabled: !!roleId });

export const useLayoutHistory = (roleId: string) =>
  useQuery({ queryKey: [KEY, "history", roleId], queryFn: () => api<{ items: LayoutVersion[] }>(`/api/layout/roles/${roleId}/history`), enabled: !!roleId });

export const usePublishLayout = (roleId: string) =>
  useApiMutation((b: Pick<RoleLayout, "menu" | "hidden" | "tabs" | "tiles">) => api<RoleLayout>(`/api/layout/roles/${roleId}`, { method: "PUT", body: b }), { done: "Layout published", refresh });

export const useRollBack = (roleId: string) =>
  useApiMutation((version: number) => api<RoleLayout>(`/api/layout/roles/${roleId}/rollback`, { method: "POST", body: { version } }), { done: "Rolled back", refresh });

export const useLayoutSettings = () => useQuery({ queryKey: [KEY, "settings"], queryFn: () => api<LayoutSettings>("/api/layout/settings") });

export const useSaveLayoutSettings = () => useApiMutation((b: LayoutSettings) => api<LayoutSettings>("/api/layout/settings", { method: "PUT", body: b }), { done: "Layout rules saved", refresh });
