"use client";
// Queries and changes for the Bonuses & Rewards screens (S31-01 to S31-05):
// cash bonuses paid with payroll, and buffet passes used at the buffet.

import { useQuery } from "@tanstack/react-query";
import { api } from "@/shared/api/apiClient";
import { useApiMutation } from "@/shared/api/useApiMutation";

/** A reward. */
export interface Bonus {
  id: string;
  staffName: string;
  department: string | null;
  kind: "cash" | "buffet";
  amount: number;
  passes: number;
  passesUsed: number;
  validUntil: string | null;
  reason: string;
  status: "pending" | "approved" | "declined" | "paid" | "used";
  awardedByName: string;
  decidedByName: string | null;
  createdAt: string;
}

/** The super admin's reward rules. */
export interface BonusRules {
  cashEnabled: boolean;
  buffetEnabled: boolean;
  requireApproval: boolean;
  buffetValidDays: number;
  onePassPerDay: boolean;
  reasons: string[];
}

/** The buffet station's answer to a tap. */
export type RedeemResult = { ok: true; staffName: string; passesLeft: number; validUntil: string | null } | { ok: false; reason: string; staffName: string | null; message: string };

/** Who the buffet station is serving. */
export type RedeemBody = { uid: string } | { qr: string } | { staffId: string };

export const useMyRewards = () => useQuery({ queryKey: ["bonuses", "mine"], queryFn: () => api<{ items: Bonus[]; passesLeft: number }>("/api/bonuses/mine") });

export const useBonuses = (status: string) => useQuery({ queryKey: ["bonuses", "list", status], queryFn: () => api<{ items: Bonus[] }>(`/api/bonuses?limit=500${status ? `&status=${status}` : ""}`) });

export const useBonusRules = () => useQuery({ queryKey: ["bonuses", "rules"], queryFn: () => api<BonusRules>("/api/bonuses/settings") });

export const useAwardBonus = () =>
  useApiMutation((body: { staffId: string; kind: Bonus["kind"]; amount: number; passes: number; reason: string }) => api<Bonus>("/api/bonuses", { method: "POST", body }), { done: "Reward given", refresh: [["bonuses"]] });

export const useDecideBonus = () => useApiMutation(({ id, approve }: { id: string; approve: boolean }) => api(`/api/bonuses/${id}/decide`, { method: "POST", body: { approve } }), { done: "Decision saved", refresh: [["bonuses"]] });

export const useRedeem = () => useApiMutation((body: RedeemBody) => api<RedeemResult>("/api/bonuses/buffet/redeem", { method: "POST", body }), { done: "Checked", refresh: [["bonuses"]] });

export const useSaveBonusRules = () => useApiMutation((r: BonusRules) => api<BonusRules>("/api/bonuses/settings", { method: "PUT", body: r }), { done: "Rules saved", refresh: [["bonuses"]] });
