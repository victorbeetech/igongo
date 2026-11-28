"use client";
// Points rewards for the super admin (S57-05): reads and saves every rule,
// and runs expiry on demand. Calls the API's `/api/points/admin` routes.

import { useQuery } from "@tanstack/react-query";
import { api } from "@/shared/api/apiClient";
import { useApiMutation } from "@/shared/api/useApiMutation";

/** The points rules, exactly as the API keeps them. */
export interface PointsRules {
  /** The switch: off means guests see no points and nothing is earned or spent. */
  enabled: boolean;
  /** Points earned for every 1,000 UGX paid on an order. */
  pointsPer1000Ugx: number;
  /** Points given once at sign-up (0 for none). */
  signupBonus: number;
  /** The fewest points a guest may spend in one go. */
  minimumToRedeem: number;
  /** Shillings off for each point spent. */
  ugxPerPoint: number;
  /** Days before earned points expire. 0 means they never expire. */
  expiryDays: number;
}

/** The key the rules are cached under, so a save refreshes them. */
const RULES_KEY = ["points-rules"];

/** Every rule, for the admin screen. */
export const usePointsRules = () => useQuery({ queryKey: RULES_KEY, queryFn: () => api<PointsRules>("/api/points/admin/rules") });

/** Saves the whole rule set. The API checks every number before saving. */
export const useSavePointsRules = () =>
  useApiMutation((rules: PointsRules) => api<PointsRules>("/api/points/admin/rules", { method: "PUT", body: rules }), {
    done: "Points rules saved",
    refresh: [RULES_KEY],
  });

/** Runs expiry now and reports how many points expired. */
export const useRunPointsExpiry = () =>
  useApiMutation(() => api<{ lots: number; points: number }>("/api/points/admin/expire", { method: "POST" }), {
    done: "Expiry run",
    refresh: [RULES_KEY],
  });
