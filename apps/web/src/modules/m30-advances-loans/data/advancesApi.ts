"use client";
// Queries and changes for the Advances & Loans screens (S30-01 to S30-06).

import { useQuery } from "@tanstack/react-query";
import { api } from "@/shared/api/apiClient";
import { useApiMutation } from "@/shared/api/useApiMutation";

/** A salary advance or a staff loan. */
export interface Advance {
  id: string;
  number: string;
  staffName: string;
  department: string | null;
  kind: "advance" | "loan";
  amount: number;
  reason: string;
  instalments: number;
  instalmentAmount: number;
  startPeriod: string;
  status: "requested" | "approved" | "declined" | "cancelled" | "disbursed" | "repaid";
  repaid: number;
  requestedAt: string;
  decidedByName: string | null;
  decisionNote: string | null;
  disbursedByName: string | null;
}

/** One kind's limits. */
export interface KindRule {
  enabled: boolean;
  maxAmount: number;
  maxInstalments: number;
}
export interface AdvanceRules {
  advance: KindRule;
  loan: KindRule;
  oneOpenAtATime: boolean;
}

export const useMyAdvances = () => useQuery({ queryKey: ["advances", "mine"], queryFn: () => api<{ items: Advance[]; rules: AdvanceRules }>("/api/advances/mine") });

export const useAdvances = (status: string) => useQuery({ queryKey: ["advances", "list", status], queryFn: () => api<{ items: Advance[] }>(`/api/advances?limit=500${status ? `&status=${status}` : ""}`) });

export const useAdvance = (id: string) => useQuery({ queryKey: ["advances", id], queryFn: () => api<{ advance: Advance; repayments: { id: string; amount: number; period: string; payRunId: string | null; byName: string; at: string }[] }>(`/api/advances/${id}`), enabled: !!id });

export const useAdvanceRules = () => useQuery({ queryKey: ["advances", "rules"], queryFn: () => api<AdvanceRules>("/api/advances/settings") });

export const useRequestAdvance = () =>
  useApiMutation((body: { kind: Advance["kind"]; amount: number; instalments: number; reason: string }) => api<Advance>("/api/advances/mine", { method: "POST", body }), { done: "Request sent", refresh: [["advances"]] });

export const useCancelAdvance = () => useApiMutation((id: string) => api(`/api/advances/mine/${id}/cancel`, { method: "POST" }), { done: "Request taken back", refresh: [["advances"]] });

export const useDecideAdvance = (id: string) =>
  useApiMutation((body: { approve: boolean; note: string | null }) => api(`/api/advances/${id}/decide`, { method: "POST", body }), { done: "Decision saved", refresh: [["advances"]] });

export const useDisburseAdvance = (id: string) => useApiMutation(() => api(`/api/advances/${id}/disburse`, { method: "POST" }), { done: "Marked as paid out", refresh: [["advances"]] });

export const useRepayAdvance = (id: string) => useApiMutation((amount: number) => api(`/api/advances/${id}/repay`, { method: "POST", body: { amount } }), { done: "Repayment recorded", refresh: [["advances"]] });

export const useSaveAdvanceRules = () => useApiMutation((r: AdvanceRules) => api<AdvanceRules>("/api/advances/settings", { method: "PUT", body: r }), { done: "Rules saved", refresh: [["advances"]] });
