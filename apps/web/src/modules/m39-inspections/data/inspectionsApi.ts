"use client";
// Queries and changes for the Inspections screens (S39-01 to S39-05): HOD
// daily and weekly checkups, their results, likes and comments.

import { useQuery } from "@tanstack/react-query";
import { api } from "@/shared/api/apiClient";
import { useApiMutation } from "@/shared/api/useApiMutation";
import type { ThreadComment } from "@/shared/ui/social/CommentThread";

/** One line to check. */
export interface ChecklistItem {
  key: string;
  label: string;
  photoOnFail: boolean;
  raiseFault: boolean;
}

/** A checklist built by the super admin or an HOD. */
export interface Checklist {
  id: string;
  name: string;
  department: string;
  frequency: "daily" | "weekly";
  dueBy: string;
  items: ChecklistItem[];
  active: boolean;
}
export type ChecklistDraft = Omit<Checklist, "id">;

/** An answer on a line. */
export type CheckAnswer = "ok" | "fault" | "na";

/** A done checkup. */
export interface InspectionRun {
  id: string;
  checklistId: string;
  checklistName: string;
  department: string;
  workDate: string;
  inspectorName: string;
  results: { key: string; label: string; result: CheckAnswer; note: string | null; photoIds: string[]; faultNumber: string | null }[];
  score: number;
  faults: number;
  note: string | null;
  submittedAt: string;
}
export type RunItem = InspectionRun & { likes: number; comments: number; likedByMe: boolean };

/** Likes and comments switches. */
export interface InspectionSettings {
  likesEnabled: boolean;
  commentsEnabled: boolean;
}

export const useToday = () => useQuery({ queryKey: ["inspections", "today"], queryFn: () => api<{ date: string; items: { checklist: Checklist; done: InspectionRun | null }[] }>("/api/inspections/today") });

export const useChecklists = () => useQuery({ queryKey: ["inspections", "checklists"], queryFn: () => api<{ items: Checklist[] }>("/api/inspections/checklists") });

export const useRuns = () =>
  useQuery({ queryKey: ["inspections", "runs"], queryFn: () => api<{ items: RunItem[]; settings: InspectionSettings; can: { like: boolean; comment: boolean } }>("/api/inspections/runs?limit=100") });

export const useRun = (id: string) =>
  useQuery({ queryKey: ["inspections", "runs", id], queryFn: () => api<{ run: InspectionRun; comments: ThreadComment[]; likes: number; settings: InspectionSettings }>(`/api/inspections/runs/${id}`), enabled: !!id });

export const useInspectionSettings = () => useQuery({ queryKey: ["inspections", "settings"], queryFn: () => api<InspectionSettings>("/api/inspections/settings") });

export const useSubmitRun = () =>
  useApiMutation(
    (body: { checklistId: string; answers: { key: string; result: CheckAnswer; note: string | null; photoIds: string[] }[]; note: string | null }) => api<InspectionRun>("/api/inspections/runs", { method: "POST", body }),
    { done: "Checkup submitted", refresh: [["inspections"], ["faults"]] },
  );

export const useSaveChecklist = () =>
  useApiMutation(({ id, draft }: { id: string | null; draft: ChecklistDraft }) => api<Checklist>(id ? `/api/inspections/checklists/${id}` : "/api/inspections/checklists", { method: id ? "PUT" : "POST", body: draft }), {
    done: "Checklist saved",
    refresh: [["inspections"]],
  });

export const useLikeRun = () => useApiMutation((id: string) => api(`/api/inspections/runs/${id}/like`, { method: "POST" }), { done: "Thanks", refresh: [["inspections", "runs"]] });

export const useCommentOnRun = (id: string) => useApiMutation((body: string) => api(`/api/inspections/runs/${id}/comments`, { method: "POST", body: { body } }), { done: "Comment added", refresh: [["inspections", "runs", id]] });

export const useSaveInspectionSettings = () => useApiMutation((s: InspectionSettings) => api<InspectionSettings>("/api/inspections/settings", { method: "PUT", body: s }), { done: "Settings saved", refresh: [["inspections"]] });
