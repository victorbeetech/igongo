"use client";
// Queries and changes for saved and scheduled reports (S81-03, S81-04,
// S81-05): save a pick of areas and days, run it now or at 7 AM on a
// schedule, and read or download every past run.

import { useQuery } from "@tanstack/react-query";
import { api } from "@/shared/api/apiClient";
import { useApiMutation } from "@/shared/api/useApiMutation";
import type { DashboardGroup } from "./reportsApi";

/** How often a report runs by itself; `none` runs only by hand. */
export type ReportSchedule = "none" | "daily" | "weekly" | "monthly";

/** The schedule choices, in words. */
export const SCHEDULE_CHOICES: [ReportSchedule, string][] = [
  ["none", "Only when I run it"],
  ["daily", "Every day at 7 AM"],
  ["weekly", "Every Monday at 7 AM"],
  ["monthly", "On the 1st at 7 AM"],
];

/** The day choices, the same as the dashboard's. */
export const DAY_CHOICES: [string, string][] = [["1", "One day"], ["7", "7 days"], ["30", "30 days"]];

/** A saved report. Empty `modules` means every area its owner may see. */
export interface SavedReport {
  id: string;
  name: string;
  ownerName: string;
  modules: string[];
  days: 1 | 7 | 30;
  schedule: ReportSchedule;
  lastRunAt: string | null;
}

/** What the owner sets. */
export type SavedReportInput = Pick<SavedReport, "name" | "modules" | "days" | "schedule">;

/** One past run, without its numbers. */
export interface RunSummary {
  id: string;
  reportName: string;
  fromDay: string;
  toDay: string;
  trigger: "manual" | "schedule";
  ranAt: string;
}

/** One run with its numbers. */
export type ReportRun = RunSummary & { groups: DashboardGroup[] };

const KEY = ["reports", "saved"];

export const useSavedReports = () => useQuery({ queryKey: KEY, queryFn: () => api<{ reports: SavedReport[] }>("/api/reports/saved") });

export const useRuns = (id: string) => useQuery({ queryKey: [...KEY, id, "runs"], queryFn: () => api<{ runs: RunSummary[] }>(`/api/reports/saved/${id}/runs`) });

export const useRun = (id: string) => useQuery({ queryKey: ["reports", "run", id], queryFn: () => api<ReportRun>(`/api/reports/runs/${id}`) });

export const useCreateReport = () => useApiMutation((r: SavedReportInput) => api<SavedReport>("/api/reports/saved", { method: "POST", body: r }), { done: "Report saved", refresh: [KEY] });

export const useUpdateReport = () =>
  useApiMutation(({ id, ...r }: SavedReportInput & { id: string }) => api<SavedReport>(`/api/reports/saved/${id}`, { method: "PUT", body: r }), { done: "Report changed", refresh: [KEY] });

export const useRemoveReport = () => useApiMutation((id: string) => api<unknown>(`/api/reports/saved/${id}`, { method: "DELETE" }), { done: "Report removed", refresh: [KEY] });

export const useRunReport = () => useApiMutation((id: string) => api<ReportRun>(`/api/reports/saved/${id}/run`, { method: "POST" }), { done: "Report run", refresh: [KEY] });
