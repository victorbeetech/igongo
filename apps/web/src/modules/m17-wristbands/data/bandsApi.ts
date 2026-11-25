"use client";
// Queries and changes for the Wristbands screens (S17-01, S17-03, S17-06, S17-07).

import { useQuery } from "@tanstack/react-query";
import { api } from "@/shared/api/apiClient";
import { useApiMutation } from "@/shared/api/useApiMutation";

/** A band, as the API returns it. */
export interface Band {
  bandNumber: number;
  status: "in_stock" | "assigned" | "missing" | "retired";
  eventKey: string | null;
  eventName: string | null;
  qr: string;
}

/** The door's verdict, in words. */
export const VERDICT_WORDS = { ok: "Let in", wrong_event: "Wrong event", not_assigned: "Not given out", blocked: "Blocked", unknown: "Unknown band" } as const;
export type Verdict = keyof typeof VERDICT_WORDS;

/** Status words for people. */
export const BAND_STATUS_WORDS: Record<Band["status"], string> = { in_stock: "In stock", assigned: "Assigned", missing: "Missing", retired: "Retired" };

export const useBandSummary = () =>
  useQuery({ queryKey: ["bands", "summary"], queryFn: () => api<{ byStatus: Record<Band["status"], number>; events: { eventKey: string; eventName: string | null; count: number }[] }>("/api/wristbands/summary") });

/** A range action: register, assign or reset. */
export const useRangeAction = (action: "register-range" | "assign-range" | "reset-range") =>
  useApiMutation((body: Record<string, unknown>) => api<Record<string, number>>(`/api/wristbands/${action}`, { method: "POST", body }), { done: "Wristbands updated", refresh: [["bands"]] });

export const useScanBand = () => useApiMutation((body: Record<string, unknown>) => api<{ result: Verdict; band: Band | null }>("/api/wristbands/scan", { method: "POST", body }), { done: "Scanned", refresh: [] });
