"use client";
// Queries and changes for the Faults & Maintenance screens (S40-01 to S40-07).

import { useQuery } from "@tanstack/react-query";
import { api } from "@/shared/api/apiClient";
import { useApiMutation } from "@/shared/api/useApiMutation";
import type { ThreadComment } from "@/shared/ui/social/CommentThread";

/** Where a fault is in its life. */
export const FAULT_STATUSES = ["open", "assigned", "in_progress", "on_hold", "fixed", "closed", "cancelled"] as const;
export type FaultStatus = (typeof FAULT_STATUSES)[number];
export const FAULT_PRIORITIES = ["low", "normal", "high", "urgent"] as const;

/** A person on a fault. */
interface FaultPerson {
  userId: string | null;
  staffId: string | null;
  name: string;
}

/** A fault report. */
export interface Fault {
  id: string;
  number: string;
  title: string;
  description: string;
  category: string | null;
  location: string | null;
  department: string | null;
  priority: string;
  status: FaultStatus;
  photoIds: string[];
  reportedBy: FaultPerson;
  assignedTo: FaultPerson | null;
  sourceModule: string;
  fixNote: string | null;
  createdAt: string;
}

/** A fault in a list, with its counts. */
export type FaultItem = Fault & { likes: number; comments: number; likedByMe: boolean };

/** The super admin's fault switches. */
export interface FaultSettings {
  categories: { key: string; name: string; department: string | null }[];
  likesEnabled: boolean;
  commentsEnabled: boolean;
  photoRequired: boolean;
}

/** What the list call returns. */
interface FaultList {
  items: FaultItem[];
  settings: FaultSettings;
  can: { report: boolean; assign: boolean; like: boolean; comment: boolean };
}

/** A filter: `reported` (mine), `assigned` (work given to me) or none (my scope). */
export type FaultView = "reported" | "assigned" | "scope";

export const useFaults = (view: FaultView, openOnly: boolean) =>
  useQuery({ queryKey: ["faults", view, openOnly], queryFn: () => api<FaultList>(`/api/faults?limit=100${view === "scope" ? "" : `&mine=${view}`}${openOnly ? "&open=1" : ""}`) });

export const useFaultSummary = () => useQuery({ queryKey: ["faults", "summary"], queryFn: () => api<{ counts: Partial<Record<FaultStatus, number>> }>("/api/faults/summary") });

export const useFault = (id: string) =>
  useQuery({
    queryKey: ["faults", id],
    queryFn: () => api<{ fault: Fault; events: { id: string; byName: string; from: string | null; to: string; note: string | null; at: string }[]; comments: ThreadComment[]; likes: number; settings: FaultSettings }>(`/api/faults/${id}`),
    enabled: !!id,
  });

export const useFaultSettings = () => useQuery({ queryKey: ["faults", "settings"], queryFn: () => api<FaultSettings>("/api/faults/settings") });

export const useReportFault = () =>
  useApiMutation((body: { title: string; description: string; category: string | null; location: string | null; priority: string; photoIds: string[] }) => api<Fault>("/api/faults", { method: "POST", body }), { done: "Fault reported", refresh: [["faults"]] });

export const useAssignFault = (id: string) => useApiMutation((staffId: string) => api(`/api/faults/${id}/assign`, { method: "POST", body: { staffId } }), { done: "Fault assigned", refresh: [["faults"]] });

export const useMoveFault = (id: string) =>
  useApiMutation((body: { status: FaultStatus; note: string | null }) => api(`/api/faults/${id}/status`, { method: "POST", body }), { done: "Fault updated", refresh: [["faults"]] });

export const useLikeFault = () => useApiMutation((id: string) => api(`/api/faults/${id}/like`, { method: "POST" }), { done: "Thanks", refresh: [["faults"]] });

export const useCommentOnFault = (id: string) => useApiMutation((body: string) => api(`/api/faults/${id}/comments`, { method: "POST", body: { body } }), { done: "Comment added", refresh: [["faults", id]] });

export const useSaveFaultSettings = () => useApiMutation((s: FaultSettings) => api<FaultSettings>("/api/faults/settings", { method: "PUT", body: s }), { done: "Fault settings saved", refresh: [["faults"]] });
