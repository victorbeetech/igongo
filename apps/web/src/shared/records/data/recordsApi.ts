"use client";
// Queries and changes for every records-kit module's pages. Each hook takes
// the module's place (API path), so Lost & Found, Tasks, Leave, Visitors and
// the rest share them.

import { useQuery } from "@tanstack/react-query";
import { api } from "@/shared/api/apiClient";
import { useApiMutation } from "@/shared/api/useApiMutation";
import type { FieldValue } from "../types/fieldDef";
import type { RecordConfig } from "../types/recordConfig";
import type { RecordPlace } from "../types/recordPlace";
import type { RecordEvent, WorkRecord } from "../types/workRecord";

/** The filters a list page may send. */
export interface RecordQuery {
  type?: string;
  status?: string;
  open?: boolean;
  mine?: boolean;
  assigned?: boolean;
  q?: string;
  from?: string;
  to?: string;
}

/** [q] as a query string. */
function search(q: RecordQuery): string {
  const p = new URLSearchParams();
  if (q.type) p.set("type", q.type);
  if (q.status) p.set("status", q.status);
  if (q.open !== undefined) p.set("open", q.open ? "1" : "0");
  if (q.mine) p.set("mine", "1");
  if (q.assigned) p.set("assigned", "1");
  if (q.q) p.set("q", q.q);
  if (q.from) p.set("from", q.from);
  if (q.to) p.set("to", q.to);
  const s = p.toString();
  return s ? `?${s}` : "";
}

export const useRecordConfig = (p: RecordPlace) => useQuery({ queryKey: [p.path, "config"], queryFn: () => api<RecordConfig>(`${p.path}/config`) });

export const useRecords = (p: RecordPlace, q: RecordQuery) =>
  useQuery({ queryKey: [p.path, "records", q], queryFn: () => api<{ items: WorkRecord[] }>(`${p.path}/records${search(q)}`), refetchInterval: 30000 });

export const useRecord = (p: RecordPlace, id: string) =>
  useQuery({ queryKey: [p.path, "record", id], queryFn: () => api<{ record: WorkRecord; events: RecordEvent[] }>(`${p.path}/records/${id}`), enabled: !!id });

export const useRecordSummary = (p: RecordPlace) => useQuery({ queryKey: [p.path, "summary"], queryFn: () => api<{ items: { type: string; status: string; n: number }[] }>(`${p.path}/summary`) });

/** The body of a new record. */
export interface NewRecordInput {
  type: string;
  title?: string;
  fields: Record<string, FieldValue>;
  assigneeId?: string | null;
  dueOn?: string | null;
  location?: string | null;
  ownerName?: string;
}

export const useCreateRecord = (p: RecordPlace) => useApiMutation((b: NewRecordInput) => api<WorkRecord>(`${p.path}/records`, { method: "POST", body: b }), { done: "Saved", refresh: [[p.path]] });

export const useEditRecord = (p: RecordPlace, id: string) =>
  useApiMutation((b: { fields?: Record<string, FieldValue>; title?: string; dueOn?: string | null; location?: string | null }) => api<WorkRecord>(`${p.path}/records/${id}`, { method: "PATCH", body: b }), { done: "Saved", refresh: [[p.path]] });

export const useMoveRecord = (p: RecordPlace, id: string) =>
  useApiMutation((b: { status: string; note?: string }) => api<WorkRecord>(`${p.path}/records/${id}/status`, { method: "POST", body: b }), { done: "Status changed", refresh: [[p.path]] });

export const useAssignRecord = (p: RecordPlace, id: string) =>
  useApiMutation((staffId: string | null) => api<WorkRecord>(`${p.path}/records/${id}/assign`, { method: "POST", body: { staffId } }), { done: "Assigned", refresh: [[p.path]] });

export const useCommentOnRecord = (p: RecordPlace, id: string) =>
  useApiMutation((text: string) => api<WorkRecord>(`${p.path}/records/${id}/comments`, { method: "POST", body: { text } }), { done: "Comment added", refresh: [[p.path]] });

export const useLookupRecord = (p: RecordPlace) => useApiMutation((code: string) => api<WorkRecord>(`${p.path}/lookup/${encodeURIComponent(code)}`), { done: "Found", refresh: [] });

export const useSaveRecordConfig = (p: RecordPlace) => useApiMutation((c: RecordConfig) => api<RecordConfig>(`${p.path}/config`, { method: "PUT", body: c }), { done: "Settings saved", refresh: [[p.path, "config"]] });
