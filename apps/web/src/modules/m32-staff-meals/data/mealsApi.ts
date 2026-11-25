"use client";
// Queries and changes for the Staff Meals screens (S32-01, S32-03, S32-04).

import { useQuery } from "@tanstack/react-query";
import { api } from "@/shared/api/apiClient";
import type { StaffRef } from "@/shared/api/types/staffRef";
import { useApiMutation } from "@/shared/api/useApiMutation";
import type { Scan } from "@/shared/ui/scan/scanOf";

/** A meal on today's list, for me. */
export interface MyMeal {
  key: string;
  name: string;
  startsAt: string;
  endsAt: string;
  servedAt: string | null;
  openNow: boolean;
}

/** One meal served. */
export interface MealClaim {
  id: string;
  mealKey: string;
  method: string;
  at: string;
  staff: StaffRef | null;
}

export const useMyMeals = () => useQuery({ queryKey: ["meals", "today"], queryFn: () => api<{ date: string; meals: MyMeal[] }>("/api/staff-meals/today") });

export const useServed = () => useQuery({ queryKey: ["meals", "served"], queryFn: () => api<{ date: string; counts: Record<string, number>; items: MealClaim[] }>("/api/staff-meals/served"), refetchInterval: 30000 });

export const useServe = () =>
  useApiMutation((scan: Scan) => api<{ staff: StaffRef; mealName: string }>("/api/staff-meals/serve", { method: "POST", body: scan }), { done: "Meal served", refresh: [["meals"]] });
