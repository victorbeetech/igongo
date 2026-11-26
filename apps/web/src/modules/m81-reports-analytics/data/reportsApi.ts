"use client";
// Queries and changes for the Reports & Analytics screens (S81-01, S81-02,
// S81-06): the management dashboard built from every module's numbers.

import { useQuery } from "@tanstack/react-query";
import { api } from "@/shared/api/apiClient";
import { useApiMutation } from "@/shared/api/useApiMutation";

/** One number on the dashboard. */
export interface Kpi {
  key: string;
  label: string;
  value: number;
  unit: "count" | "ugx" | "percent";
}

/** One module's tiles; `failed` when that module could not answer. */
export interface DashboardGroup {
  module: string;
  title: string;
  kpis: Kpi[];
  failed: boolean;
}

/** Hidden tiles and the default range. */
export interface DashboardSettings {
  hidden: string[];
  defaultDays: 1 | 7 | 30;
}

/** A range of hotel days; empty means the super admin's default. */
export interface DayRange {
  from: string;
  to: string;
}

/** The query part for [range]. */
export const rangeQuery = (range: DayRange) => (range.from && range.to ? `?from=${range.from}&to=${range.to}` : "");

export const useDashboard = (range: DayRange) =>
  useQuery({ queryKey: ["reports", "dashboard", range], queryFn: () => api<{ from: string; to: string; groups: DashboardGroup[] }>(`/api/reports/dashboard${rangeQuery(range)}`), refetchInterval: 60_000 });

export const useDashboardSettings = () => useQuery({ queryKey: ["reports", "settings"], queryFn: () => api<DashboardSettings>("/api/reports/settings") });

export const useCatalogue = () => useQuery({ queryKey: ["reports", "catalogue"], queryFn: () => api<{ groups: DashboardGroup[] }>("/api/reports/catalogue") });

export const useSaveDashboardSettings = () => useApiMutation((s: DashboardSettings) => api<DashboardSettings>("/api/reports/settings", { method: "PUT", body: s }), { done: "Dashboard settings saved", refresh: [["reports"]] });
