"use client";
// Queries and changes for the Super Admin Console screens (S01).

import { useQuery } from "@tanstack/react-query";
import { api } from "@/shared/api/apiClient";
import { useApiMutation } from "@/shared/api/useApiMutation";

/** A module's switch, with its catalogue details. */
export interface ModuleRow {
  moduleKey: string;
  number: number;
  name: string;
  group: string;
  enabled: boolean;
  maintenance: boolean;
  message: string | null;
  canSwitchOff: boolean;
}

export const useModules = () => useQuery({ queryKey: ["modules"], queryFn: () => api<{ items: ModuleRow[] }>("/api/admin/modules") });

export const useSetModule = () =>
  useApiMutation(({ moduleKey, ...body }: { moduleKey: string; enabled?: boolean; maintenance?: boolean }) => api(`/api/admin/modules/${moduleKey}`, { method: "PATCH", body }), {
    done: "Module saved",
    refresh: [["modules"]],
  });

/** Every settings section: hotel, branding, regional. */
export const useSettings = () => useQuery({ queryKey: ["settings"], queryFn: () => api<Record<string, Record<string, unknown>>>("/api/admin/settings") });

export const useSaveSection = () =>
  useApiMutation(({ section, values }: { section: string; values: Record<string, unknown> }) => api(`/api/admin/settings/${section}`, { method: "PATCH", body: values }), {
    done: "Settings saved",
    refresh: [["settings"]],
  });
