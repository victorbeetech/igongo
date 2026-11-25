"use client";
// Queries and changes for the Daily Reports screens (S38-01 to S38-08).

import { useQuery } from "@tanstack/react-query";
import { api } from "@/shared/api/apiClient";
import type { StaffRef } from "@/shared/api/types/staffRef";
import { useApiMutation } from "@/shared/api/useApiMutation";

/** One answered section. */
export interface ReportSection {
  title: string;
  text: string;
}

/** A report, as the API returns it. */
export interface DailyReport {
  id: string;
  staffId: string;
  workDate: string;
  status: "draft" | "submitted" | "signed" | "returned";
  sections: ReportSection[];
  reviewNote: string | null;
  submittedAt: string | null;
}

/** A comment under a report. */
export interface ReportComment {
  id: string;
  authorName: string;
  body: string;
  at: string;
}

/** Status words for people. */
export const REPORT_STATUS_WORDS: Record<DailyReport["status"], string> = { draft: "Draft", submitted: "Waiting for sign-off", signed: "Signed", returned: "Returned" };

/** YYYY-MM-DD, `days` ago. */
export const daysAgo = (days: number) => new Date(Date.now() - days * 86400000).toISOString().slice(0, 10);

export const useMyReport = (date: string) =>
  useQuery({ queryKey: ["reports", "mine", date], queryFn: () => api<{ date: string; report: DailyReport | null; comments: ReportComment[]; template: { sections: string[]; dueBy: string } }>(`/api/daily-reports/mine${date ? `?date=${date}` : ""}`) });

export const useSaveMyReport = () =>
  useApiMutation(({ date, sections, submit }: { date: string; sections: ReportSection[]; submit: boolean }) => api<DailyReport>(`/api/daily-reports/mine/${date}`, { method: "PUT", body: { sections, submit } }), { done: "Report saved", refresh: [["reports"]] });

export const useReports = (status: string) =>
  useQuery({ queryKey: ["reports", "list", status], queryFn: () => api<{ items: (DailyReport & { staff: StaffRef | null })[] }>(`/api/daily-reports?from=${daysAgo(14)}&to=${daysAgo(-1)}${status ? `&status=${status}` : ""}`) });

export const useMissing = () => useQuery({ queryKey: ["reports", "missing"], queryFn: () => api<{ date: string; items: StaffRef[] }>("/api/daily-reports/missing") });

export const useReport = (id: string) =>
  useQuery({ queryKey: ["reports", id], queryFn: () => api<{ report: DailyReport; staff: StaffRef | null; comments: ReportComment[] }>(`/api/daily-reports/${id}`), enabled: !!id });

export const useReview = (id: string) =>
  useApiMutation((body: { decision: "signed" | "returned"; note?: string }) => api<DailyReport>(`/api/daily-reports/${id}/review`, { method: "POST", body }), { done: "Report updated", refresh: [["reports"]] });

export const useComment = (id: string) => useApiMutation((body: string) => api(`/api/daily-reports/${id}/comments`, { method: "POST", body: { body } }), { done: "Comment added", refresh: [["reports"]] });
